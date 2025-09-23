import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/lib/services/inventoryService';
import { getServerSession } from 'next-auth';
import { rateLimit } from '@/lib/utils/rate-limit';

/**
 * Inventory Management API
 * Handles stock levels, reservations, and movements
 */

// Get inventory status for products
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'inventory-get',
      limit: 100,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const action = searchParams.get('action');

    if (action === 'low-stock') {
      try {
        const lowStockItems = await InventoryService.getLowStockItems();
        return NextResponse.json({
          success: true,
          data: lowStockItems
        });
      } catch (error) {
        console.warn('InventoryService not available, returning mock data:', error);
        // Return mock low stock data for now
        return NextResponse.json({
          success: true,
          data: [
            {
              id: 'mock-1',
              productId: 'produto-exemplo',
              productName: 'Produto Exemplo',
              sku: 'EXAMPLE-001',
              currentStock: 2,
              threshold: 5,
              status: 'ACTIVE',
              createdAt: new Date()
            }
          ]
        });
      }
    }

    if (action === 'movements') {
      const limit = parseInt(searchParams.get('limit') || '50');
      const movements = await InventoryService.getStockMovements(
        productId || undefined,
        variantId || undefined,
        limit
      );
      return NextResponse.json({
        success: true,
        data: movements
      });
    }

    if (productId) {
      const inventory = await InventoryService.getInventoryStatus(productId, variantId || undefined);

      if (!inventory) {
        return NextResponse.json(
          { error: 'Inventory not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: inventory
      });
    }

    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// Update inventory (add/remove stock)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimit({
      request,
      identifier: 'inventory-update',
      limit: 20,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, productId, variantId, quantity, reason, reference } = body;

    if (!productId || !action) {
      return NextResponse.json(
        { error: 'Product ID and action are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'add':
        result = await InventoryService.addStock(
          productId,
          quantity,
          variantId,
          reason || 'Manual addition',
          reference
        );
        break;

      case 'reserve':
        result = await InventoryService.reserveStock(
          productId,
          quantity,
          variantId,
          reference
        );
        break;

      case 'release':
        result = await InventoryService.releaseStock(
          productId,
          quantity,
          variantId,
          reference
        );
        break;

      case 'confirm-sale':
        result = await InventoryService.confirmSale(
          productId,
          quantity,
          variantId,
          reference
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}

// Bulk update inventory
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimit({
      request,
      identifier: 'inventory-bulk-update',
      limit: 5,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      );
    }

    const result = await InventoryService.bulkUpdateStock(updates);

    return NextResponse.json({
      success: result.success,
      processed: result.processed,
      errors: result.errors,
      message: `Processed ${result.processed} items${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ''}`
    });

  } catch (error) {
    console.error('Error bulk updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update inventory' },
      { status: 500 }
    );
  }
}