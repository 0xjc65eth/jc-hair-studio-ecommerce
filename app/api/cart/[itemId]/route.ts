// Individual cart item API endpoints for JC Hair Studio's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '../../../../lib/services/cartService';
import { withOptionalAuth, withSecurityHeaders, withRateLimit, withValidation } from '../../../../lib/auth/middleware';
import { AuthenticatedRequest } from '../../../../lib/auth/middleware';
import { z } from 'zod';

// Validation schema
const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(50, 'Maximum quantity is 50'),
});

type UpdateCartItemData = z.infer<typeof updateCartItemSchema>;

/**
 * PUT /api/cart/[itemId] - Update cart item quantity
 */
async function updateCartItemHandler(
  request: AuthenticatedRequest, 
  validatedData: UpdateCartItemData,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const { quantity } = validatedData;
    
    const userId = request.user?.userId;
    const sessionId = request.headers.get('x-session-id') || undefined;

    if (!userId && !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID required for guest users',
          code: 'SESSION_REQUIRED'
        },
        { status: 400 }
      );
    }

    const updatedItem = await CartService.updateCartItem(itemId, quantity, userId, sessionId);

    if (!updatedItem) {
      // Item was removed (quantity = 0)
      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
        data: null
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Cart item updated successfully'
    });

  } catch (error: any) {
    console.error('Update cart item error:', error);

    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    if (error.message.includes('items available')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: 'STOCK_ERROR'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart item',
        code: 'UPDATE_CART_ITEM_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/[itemId] - Remove item from cart
 */
async function removeCartItemHandler(
  request: AuthenticatedRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    
    const userId = request.user?.userId;
    const sessionId = request.headers.get('x-session-id') || undefined;

    if (!userId && !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID required for guest users',
          code: 'SESSION_REQUIRED'
        },
        { status: 400 }
      );
    }

    await CartService.removeFromCart(itemId, userId, sessionId);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error: any) {
    console.error('Remove cart item error:', error);

    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove cart item',
        code: 'REMOVE_CART_ITEM_ERROR'
      },
      { status: 500 }
    );
  }
}

// Create handlers with proper parameter handling
function createPUTHandler() {
  return async (request: NextRequest, context: { params: Promise<{ itemId: string }> }) => {
    const params = await context.params;
    const validationMiddleware = withValidation(
      async (req: NextRequest, data: UpdateCartItemData) => {
        return updateCartItemHandler(req as AuthenticatedRequest, data, { params });
      },
      (data) => {
        try {
          const parsed = updateCartItemSchema.parse(data);
          return { success: true, data: parsed };
        } catch (error) {
          return { success: false, errors: error };
        }
      }
    );

    const authMiddleware = withOptionalAuth(validationMiddleware);
    const rateLimitMiddleware = withRateLimit(authMiddleware, {
      maxRequests: 30,
      windowMs: 15 * 60 * 1000,
      keyGenerator: (req) => {
        const userId = (req as any).user?.userId;
        const sessionId = req.headers.get('x-session-id');
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `cart-update:${userId || sessionId || ip}`;
      }
    });
    const securityMiddleware = withSecurityHeaders(rateLimitMiddleware);

    return securityMiddleware(request);
  };
}

function createDELETEHandler() {
  return async (request: NextRequest, context: { params: Promise<{ itemId: string }> }) => {
    const params = await context.params;
    const handler = async (req: AuthenticatedRequest) => {
      return removeCartItemHandler(req, { params });
    };

    const authMiddleware = withOptionalAuth(handler);
    const rateLimitMiddleware = withRateLimit(authMiddleware, {
      maxRequests: 30,
      windowMs: 15 * 60 * 1000,
      keyGenerator: (req) => {
        const userId = (req as any).user?.userId;
        const sessionId = req.headers.get('x-session-id');
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `cart-remove:${userId || sessionId || ip}`;
      }
    });
    const securityMiddleware = withSecurityHeaders(rateLimitMiddleware);

    return securityMiddleware(request);
  };
}

export const PUT = createPUTHandler();
export const DELETE = createDELETEHandler();