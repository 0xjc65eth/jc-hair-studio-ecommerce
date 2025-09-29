import { PrismaClient } from '@prisma/client';
import { InventoryService } from './inventoryService';
import { CartService } from './cartService';

let prisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    name: string;
    sku: string;
    image?: string;
  };
  variant?: {
    name: string;
    sku: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  userId?: string;
  sessionId?: string;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Shipping
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };

  // Payment
  paymentIntentId?: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  // Pricing
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;

  // Tracking
  trackingCode?: string;
  trackingUrl?: string;

  // Items
  items: OrderItem[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface CreateOrderData {
  userId?: string;
  sessionId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  paymentIntentId?: string;
  promoCode?: string;
}

export class OrderService {
  /**
   * Create a new order from cart
   */
  static async createOrder(data: CreateOrderData): Promise<{ success: boolean; order?: Order; message: string }> {
    try {
      const cartKey = data.userId || data.sessionId || '';

      // Get cart items
      const cartSummary = await CartService.getCartSummary(cartKey);

      if (cartSummary.items.length === 0) {
        return {
          success: false,
          message: 'Carrinho vazio'
        };
      }

      // Validate stock for all items
      for (const item of cartSummary.items) {
        const isInStock = await InventoryService.isInStock(
          item.productId,
          item.variantId,
          item.quantity
        );

        if (!isInStock) {
          return {
            success: false,
            message: `Produto ${item.name} não tem estoque suficiente`
          };
        }
      }

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Calculate totals
      const subtotal = cartSummary.subtotal;
      const taxAmount = subtotal * 0.21; // 21% VAT
      const shippingCost = data.shippingMethod.price;
      let discountAmount = 0;

      // Apply promo code discount if provided
      if (data.promoCode) {
        // Calculate discount based on promo code
        const promoDiscount = this.calculatePromoDiscount(data.promoCode, subtotal);
        discountAmount = promoDiscount;
      }

      const total = subtotal + taxAmount + shippingCost - discountAmount;

      // Create order in database
      const order = await getPrismaClient().order.create({
        data: {
          orderNumber,
          status: 'PENDING',
          userId: data.userId,
          sessionId: data.sessionId,

          // Customer
          customerName: data.customerInfo.name,
          customerEmail: data.customerInfo.email,
          customerPhone: data.customerInfo.phone,

          // Shipping
          shippingStreet: data.shippingAddress.street,
          shippingNumber: data.shippingAddress.number,
          shippingComplement: data.shippingAddress.complement,
          shippingNeighborhood: data.shippingAddress.neighborhood,
          shippingCity: data.shippingAddress.city,
          shippingState: data.shippingAddress.state,
          shippingZipCode: data.shippingAddress.zipCode,

          shippingMethodId: data.shippingMethod.id,
          shippingMethodName: data.shippingMethod.name,
          shippingCost: data.shippingMethod.price,
          estimatedDeliveryDays: data.shippingMethod.estimatedDays,

          // Payment
          paymentIntentId: data.paymentIntentId,
          paymentMethod: 'STRIPE',
          paymentStatus: 'PENDING',

          // Pricing
          subtotal,
          taxAmount,
          shippingCost,
          discountAmount,
          total,

          // Items
          items: {
            create: cartSummary.items.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              totalPrice: item.price * item.quantity,
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        }
      });

      // Reserve stock for all items
      for (const item of cartSummary.items) {
        await InventoryService.reserveStock(
          item.productId,
          item.quantity,
          item.variantId,
          orderNumber
        );
      }

      // Clear cart after order creation
      await CartService.clearCart(cartKey);

      return {
        success: true,
        order: this.formatOrder(order),
        message: 'Pedido criado com sucesso'
      };

    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: 'Erro ao criar pedido'
      };
    }
  }

  /**
   * Confirm order payment
   */
  static async confirmPayment(orderId: string, paymentIntentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const order = await getPrismaClient().order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) {
        return { success: false, message: 'Pedido não encontrado' };
      }

      // Update order status
      await getPrismaClient().order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          paymentIntentId
        }
      });

      // Confirm sale and reduce actual stock
      for (const item of order.items) {
        await InventoryService.confirmSale(
          item.productId,
          item.quantity,
          item.variantId || undefined,
          order.orderNumber
        );
      }

      return {
        success: true,
        message: 'Pagamento confirmado'
      };

    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        message: 'Erro ao confirmar pagamento'
      };
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    trackingCode?: string,
    trackingUrl?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'SHIPPED') {
        updateData.shippedAt = new Date();
        if (trackingCode) updateData.trackingCode = trackingCode;
        if (trackingUrl) updateData.trackingUrl = trackingUrl;
      }

      if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date();
      }

      await getPrismaClient().order.update({
        where: { id: orderId },
        data: updateData
      });

      return {
        success: true,
        message: 'Status do pedido atualizado'
      };

    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        message: 'Erro ao atualizar status'
      };
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const order = await getPrismaClient().order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) {
        return { success: false, message: 'Pedido não encontrado' };
      }

      if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
        return { success: false, message: 'Não é possível cancelar pedido já enviado' };
      }

      // Update order status
      await getPrismaClient().order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date(),
          cancellationReason: reason
        }
      });

      // Release reserved stock
      for (const item of order.items) {
        await InventoryService.releaseStock(
          item.productId,
          item.quantity,
          item.variantId || undefined,
          order.orderNumber
        );
      }

      return {
        success: true,
        message: 'Pedido cancelado com sucesso'
      };

    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: 'Erro ao cancelar pedido'
      };
    }
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId: string, limit: number = 20): Promise<Order[]> {
    try {
      const orders = await getPrismaClient().order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return orders.map(order => this.formatOrder(order));

    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await getPrismaClient().order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        }
      });

      if (!order) return null;

      return this.formatOrder(order);

    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  /**
   * Private helper methods
   */
  private static async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const datePrefix = `${year}${month}${day}`;

    // Get count of orders today
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const orderCount = await getPrismaClient().order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    const sequence = (orderCount + 1).toString().padStart(4, '0');

    return `JC${datePrefix}${sequence}`;
  }

  private static calculatePromoDiscount(promoCode: string, subtotal: number): number {
    const promoCodes: Record<string, number> = {
      'BEMVINDO20': 20,
      'DESCONTO20': 20,
      'PROMO20': 20,
    };

    const discount = promoCodes[promoCode.toUpperCase()];
    if (discount) {
      return (subtotal * discount) / 100;
    }

    return 0;
  }

  private static formatOrder(order: any): Order {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      userId: order.userId,
      sessionId: order.sessionId,

      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,

      shippingAddress: {
        street: order.shippingStreet,
        number: order.shippingNumber,
        complement: order.shippingComplement,
        neighborhood: order.shippingNeighborhood,
        city: order.shippingCity,
        state: order.shippingState,
        zipCode: order.shippingZipCode,
      },

      shippingMethod: {
        id: order.shippingMethodId,
        name: order.shippingMethodName,
        price: order.shippingCost,
        estimatedDays: order.estimatedDeliveryDays,
      },

      paymentIntentId: order.paymentIntentId,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,

      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      total: order.total,

      trackingCode: order.trackingCode,
      trackingUrl: order.trackingUrl,

      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        product: {
          name: item.product.name,
          sku: item.product.sku,
          image: item.product.images?.[0]?.url,
        },
        variant: item.variant ? {
          name: item.variant.name,
          sku: item.variant.sku,
        } : undefined,
      })),

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      confirmedAt: order.confirmedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
    };
  }
}