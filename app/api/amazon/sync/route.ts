import { NextRequest, NextResponse } from 'next/server';
import { amazonMarketplaceService } from '@/lib/amazon/marketplace-service';
import { getAllAvailableProducts } from '@/lib/services/productResolver';

export async function POST(request: NextRequest) {
  try {
    const { action, productIds } = await request.json();

    // Validate action
    if (!['products', 'inventory', 'validate'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: products, inventory, or validate' },
        { status: 400 }
      );
    }

    // Get products to sync
    const productData = getAllAvailableProducts();
    const productsToSync = productIds
      ? productData.filter(p => productIds.includes(p.id))
      : productData;

    if (productsToSync.length === 0) {
      return NextResponse.json(
        { error: 'No products found to sync' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'validate':
        // Validate products for Amazon requirements
        const { validProducts, invalidProducts } = amazonMarketplaceService.prepareProductsForSync(productsToSync);

        return NextResponse.json({
          success: true,
          summary: {
            total: productsToSync.length,
            valid: validProducts.length,
            invalid: invalidProducts.length
          },
          validProducts: validProducts.map(p => ({ id: p.id, name: p.name })),
          invalidProducts: invalidProducts.map(({ product, errors }) => ({
            id: product.id,
            name: product.name,
            errors
          }))
        });

      case 'products':
        // Sync products to Amazon
        const { validProducts: validForSync } = amazonMarketplaceService.prepareProductsForSync(productsToSync);

        if (validForSync.length === 0) {
          return NextResponse.json(
            { error: 'No valid products to sync' },
            { status: 400 }
          );
        }

        const productSyncResult = await amazonMarketplaceService.syncProducts(validForSync);

        return NextResponse.json({
          action: 'products',
          result: productSyncResult,
          processed: validForSync.length
        });

      case 'inventory':
        // Sync inventory to Amazon
        const inventorySyncResult = await amazonMarketplaceService.syncInventory(productsToSync);

        return NextResponse.json({
          action: 'inventory',
          result: inventorySyncResult,
          processed: productsToSync.length
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Amazon sync API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get marketplace status
    const status = await amazonMarketplaceService.getMarketplaceStatus();
    const productData = getAllAvailableProducts();

    return NextResponse.json({
      status: 'active',
      amazon: status,
      lastSync: new Date().toISOString(),
      availableProducts: productData.length
    });

  } catch (error) {
    console.error('Amazon status API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}