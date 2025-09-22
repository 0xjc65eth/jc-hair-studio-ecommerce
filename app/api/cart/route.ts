import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CartService } from '@/lib/services/mongoCartService';
import { rateLimit } from '@/lib/utils/rate-limit';
import { z } from 'zod';
import logger from '@/lib/logger';

// Input validation schemas
const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(50, 'Quantity must be between 1 and 50'),
  customization: z.object({
    color: z.string().optional(),
    size: z.string().optional(),
    variant: z.string().optional(),
  }).optional(),
});

const UpdateCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().min(0).max(50),
  })),
});

/**
 * Cart Management API Endpoints
 *
 * Handles main cart CRUD operations:
 * - GET: Retrieve current cart with full summary
 * - POST: Add item to cart with validation
 * - PUT: Update multiple cart items
 * - DELETE: Clear entire cart
 */

// Get current cart with full summary
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'cart-get',
      limit: 60,
      window: 60000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Get session for user-based cart or use session ID for guest cart
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const sessionId = request.headers.get('x-session-id') || 'anonymous';

    // Get cart summary with all items and calculations
    const cartSummary = await CartService.getCartSummary(userId || sessionId);

    return NextResponse.json({
      success: true,
      data: cartSummary,
      metadata: {
        timestamp: new Date().toISOString(),
        userId: userId || null,
        sessionId: sessionId,
      }
    });

  } catch (error) {
    logger.error({ err: error }, 'Error getting cart');
    return NextResponse.json(
      { error: 'Failed to retrieve cart' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    // Rate limiting for cart additions
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'cart-add',
      limit: 30,
      window: 60000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many cart additions. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = AddToCartSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity, customization } = validationResult.data;

    // Get session for user-based cart or use session ID for guest cart
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const sessionId = request.headers.get('x-session-id') || 'anonymous';

    // Add item to cart with validation
    const result = await CartService.addToCart({
      userId: userId || null,
      sessionId: sessionId,
      productId,
      variantId,
      quantity,
      customization,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Return updated cart summary
    const updatedCart = await CartService.getCartSummary(userId || sessionId);

    return NextResponse.json({
      success: true,
      message: result.message,
      data: updatedCart,
      metadata: {
        itemAdded: {
          productId,
          variantId,
          quantity,
        },
        timestamp: new Date().toISOString(),
      }
    }, { status: 201 });

  } catch (error) {
    logger.error({ err: error }, 'Error adding to cart');
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// Update multiple cart items
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting for cart updates
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'cart-update',
      limit: 20,
      window: 60000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many cart updates. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateCartSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { items } = validationResult.data;

    // Get session for user-based cart or use session ID for guest cart
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const sessionId = request.headers.get('x-session-id') || 'anonymous';

    // Update cart items (remove items with quantity 0)
    const updatePromises = items.map(async (item) => {
      if (item.quantity === 0) {
        // Remove item from cart
        return CartService.removeFromCart(
          userId || sessionId,
          item.productId,
          item.variantId
        );
      } else {
        // Update item quantity
        return CartService.updateCartItemQuantity(
          userId || sessionId,
          item.productId,
          item.quantity,
          item.variantId
        );
      }
    });

    const updateResults = await Promise.all(updatePromises);
    const failedUpdates = updateResults.filter(result => !result.success);

    if (failedUpdates.length > 0) {
      return NextResponse.json(
        {
          error: 'Some items could not be updated',
          details: failedUpdates.map(result => result.message),
        },
        { status: 400 }
      );
    }

    // Return updated cart summary
    const updatedCart = await CartService.getCartSummary(userId || sessionId);

    return NextResponse.json({
      success: true,
      message: `${items.length} items updated successfully`,
      data: updatedCart,
      metadata: {
        updatedItems: items.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    logger.error({ err: error }, 'Error updating cart');
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting for cart clearing
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'cart-clear',
      limit: 10,
      window: 60000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Get session for user-based cart or use session ID for guest cart
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const sessionId = request.headers.get('x-session-id') || 'anonymous';

    // Clear the cart
    const result = await CartService.clearCart(userId || sessionId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        itemCount: 0,
        appliedCoupons: [],
        availableShipping: [],
      },
      metadata: {
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    logger.error({ err: error }, 'Error clearing cart');
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}