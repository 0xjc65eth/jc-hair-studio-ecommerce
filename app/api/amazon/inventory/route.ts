import { NextRequest, NextResponse } from 'next/server';
import { amazonMarketplaceService } from '@/lib/amazon/marketplace-service';

export async function PUT(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    const success = await amazonMarketplaceService.updateProductInventory(productId, quantity);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Inventory updated for product ${productId}`,
        productId,
        quantity
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update inventory on Amazon' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Amazon inventory update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update inventory',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}