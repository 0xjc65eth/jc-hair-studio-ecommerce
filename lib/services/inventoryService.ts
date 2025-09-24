import { prisma } from '@/lib/mongodb';

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  reorderPoint: number;
  reorderQuantity: number;
  location?: string;
  lastUpdated: Date;
  isTracked: boolean;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RESERVED' | 'RELEASED';
  quantity: number;
  reason: string;
  reference?: string;
  timestamp: Date;
  userId?: string;
}

export interface LowStockAlert {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  currentStock: number;
  threshold: number;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: Date;
}

export class InventoryService {
  /**
   * Get inventory status for a product/variant
   */
  static async getInventoryStatus(productId: string, variantId?: string): Promise<InventoryItem | null> {
    const inventory = await prisma.inventory.findFirst({
      where: {
        productId,
        variantId: variantId || null
      }
    });

    if (!inventory) return null;

    return {
      id: inventory.id,
      productId: inventory.productId,
      variantId: inventory.variantId || undefined,
      sku: inventory.sku,
      quantity: inventory.quantity,
      reservedQuantity: inventory.reservedQuantity,
      availableQuantity: inventory.quantity - inventory.reservedQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      reorderPoint: inventory.reorderPoint,
      reorderQuantity: inventory.reorderQuantity,
      location: inventory.location || undefined,
      lastUpdated: inventory.updatedAt,
      isTracked: inventory.trackQuantity
    };
  }

  /**
   * Check if product/variant is in stock
   */
  static async isInStock(productId: string, variantId?: string, requestedQuantity: number = 1): Promise<boolean> {
    const inventory = await this.getInventoryStatus(productId, variantId);

    if (!inventory || !inventory.isTracked) {
      return true; // If not tracked, assume in stock
    }

    return inventory.availableQuantity >= requestedQuantity;
  }

  /**
   * Reserve stock for cart/order
   */
  static async reserveStock(
    productId: string,
    quantity: number,
    variantId?: string,
    reference?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId,
          variantId: variantId || null
        }
      });

      if (!inventory) {
        return { success: false, message: 'Produto não encontrado no inventário' };
      }

      if (!inventory.trackQuantity) {
        return { success: true, message: 'Estoque não rastreado - reserva confirmada' };
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;

      if (availableQuantity < quantity) {
        return {
          success: false,
          message: `Estoque insuficiente. Disponível: ${availableQuantity}`
        };
      }

      // Update reserved quantity
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          reservedQuantity: inventory.reservedQuantity + quantity
        }
      });

      // Record stock movement
      await this.recordStockMovement(
        inventory.id,
        'RESERVED',
        quantity,
        `Reserva de estoque - ${reference || 'Carrinho'}`,
        reference
      );

      return { success: true, message: 'Estoque reservado com sucesso' };
    } catch (error) {
      console.error('Error reserving stock:', error);
      return { success: false, message: 'Erro ao reservar estoque' };
    }
  }

  /**
   * Release reserved stock
   */
  static async releaseStock(
    productId: string,
    quantity: number,
    variantId?: string,
    reference?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId,
          variantId: variantId || null
        }
      });

      if (!inventory) {
        return { success: false, message: 'Produto não encontrado no inventário' };
      }

      if (!inventory.trackQuantity) {
        return { success: true, message: 'Estoque não rastreado - liberação confirmada' };
      }

      // Update reserved quantity
      const newReservedQuantity = Math.max(0, inventory.reservedQuantity - quantity);

      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          reservedQuantity: newReservedQuantity
        }
      });

      // Record stock movement
      await this.recordStockMovement(
        inventory.id,
        'RELEASED',
        quantity,
        `Liberação de estoque - ${reference || 'Carrinho cancelado'}`,
        reference
      );

      return { success: true, message: 'Estoque liberado com sucesso' };
    } catch (error) {
      console.error('Error releasing stock:', error);
      return { success: false, message: 'Erro ao liberar estoque' };
    }
  }

  /**
   * Confirm sale and reduce actual stock
   */
  static async confirmSale(
    productId: string,
    quantity: number,
    variantId?: string,
    orderId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId,
          variantId: variantId || null
        }
      });

      if (!inventory) {
        return { success: false, message: 'Produto não encontrado no inventário' };
      }

      if (!inventory.trackQuantity) {
        return { success: true, message: 'Estoque não rastreado - venda confirmada' };
      }

      // Reduce both actual and reserved quantities
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: Math.max(0, inventory.quantity - quantity),
          reservedQuantity: Math.max(0, inventory.reservedQuantity - quantity)
        }
      });

      // Record stock movement
      await this.recordStockMovement(
        inventory.id,
        'OUT',
        quantity,
        `Venda confirmada - Pedido ${orderId || 'N/A'}`,
        orderId
      );

      // Check for low stock alert
      await this.checkLowStockAlert(inventory.id);

      return { success: true, message: 'Venda confirmada e estoque atualizado' };
    } catch (error) {
      console.error('Error confirming sale:', error);
      return { success: false, message: 'Erro ao confirmar venda' };
    }
  }

  /**
   * Add stock (restock)
   */
  static async addStock(
    productId: string,
    quantity: number,
    variantId?: string,
    reason: string = 'Reposição de estoque',
    reference?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId,
          variantId: variantId || null
        }
      });

      if (!inventory) {
        return { success: false, message: 'Produto não encontrado no inventário' };
      }

      // Add to quantity
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: inventory.quantity + quantity
        }
      });

      // Record stock movement
      await this.recordStockMovement(
        inventory.id,
        'IN',
        quantity,
        reason,
        reference
      );

      return { success: true, message: 'Estoque adicionado com sucesso' };
    } catch (error) {
      console.error('Error adding stock:', error);
      return { success: false, message: 'Erro ao adicionar estoque' };
    }
  }

  /**
   * Get low stock items
   */
  static async getLowStockItems(): Promise<LowStockAlert[]> {
    // Mock implementation - inventory system not configured in MongoDB
    console.log('📦 Returning mock low stock data (inventory system not configured)');
    return [];
  }

  /**
   * Get stock movements history
   */
  static async getStockMovements(
    productId?: string,
    variantId?: string,
    limit: number = 50
  ): Promise<StockMovement[]> {
    const where: any = {};

    if (productId) {
      where.inventory = {
        productId,
        variantId: variantId || null
      };
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        inventory: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return movements.map(movement => ({
      id: movement.id,
      inventoryItemId: movement.inventoryId,
      type: movement.type as any,
      quantity: movement.quantity,
      reason: movement.reason,
      reference: movement.reference || undefined,
      timestamp: movement.createdAt,
      userId: movement.userId || undefined
    }));
  }

  /**
   * Bulk update stock levels
   */
  static async bulkUpdateStock(
    updates: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      reason?: string;
    }>
  ): Promise<{ success: boolean; processed: number; errors: string[] }> {
    const errors: string[] = [];
    let processed = 0;

    for (const update of updates) {
      try {
        const result = await this.addStock(
          update.productId,
          update.quantity,
          update.variantId,
          update.reason || 'Atualização em lote'
        );

        if (result.success) {
          processed++;
        } else {
          errors.push(`${update.productId}: ${result.message}`);
        }
      } catch (error) {
        errors.push(`${update.productId}: Erro inesperado`);
      }
    }

    return {
      success: errors.length === 0,
      processed,
      errors
    };
  }

  /**
   * Private method to record stock movement
   */
  private static async recordStockMovement(
    inventoryId: string,
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RESERVED' | 'RELEASED',
    quantity: number,
    reason: string,
    reference?: string,
    userId?: string
  ): Promise<void> {
    await prisma.stockMovement.create({
      data: {
        inventoryId,
        type,
        quantity,
        reason,
        reference,
        userId
      }
    });
  }

  /**
   * Private method to check and create low stock alerts
   */
  private static async checkLowStockAlert(inventoryId: string): Promise<void> {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { product: true, variant: true }
    });

    if (!inventory) return;

    if (inventory.quantity <= inventory.lowStockThreshold) {
      // Create or update low stock alert
      await prisma.lowStockAlert.upsert({
        where: {
          productId_variantId: {
            productId: inventory.productId,
            variantId: inventory.variantId || ''
          }
        },
        create: {
          productId: inventory.productId,
          variantId: inventory.variantId,
          currentStock: inventory.quantity,
          threshold: inventory.lowStockThreshold,
          status: 'ACTIVE'
        },
        update: {
          currentStock: inventory.quantity,
          status: 'ACTIVE',
          updatedAt: new Date()
        }
      });
    }
  }
}