// Cart merge API endpoint for JC Hair Studio's 62's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '../../../../lib/services/cartService';
import { withAuth, withSecurityHeaders, withRateLimit } from '../../../../lib/auth/middleware';
import { AuthenticatedRequest } from '../../../../lib/auth/middleware';

/**
 * POST /api/cart/merge - Merge guest cart with user cart on login
 */
async function mergeCartHandler(request: AuthenticatedRequest) {
  try {
    const userId = request.user?.userId;
    const sessionId = request.headers.get('x-session-id');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID is required to merge cart',
          code: 'SESSION_ID_REQUIRED'
        },
        { status: 400 }
      );
    }

    const mergedCart = await CartService.mergeCart(userId, sessionId);

    return NextResponse.json({
      success: true,
      data: mergedCart,
      message: 'Cart merged successfully'
    });

  } catch (error) {
    console.error('Merge cart error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to merge cart',
        code: 'MERGE_CART_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware - requires authentication
const POST = withSecurityHeaders(
  withRateLimit(
    withAuth(mergeCartHandler),
    {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
      keyGenerator: (req) => {
        const userId = (req as any).user?.userId;
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `cart-merge:${userId || ip}`;
      }
    }
  )
);

export { POST };