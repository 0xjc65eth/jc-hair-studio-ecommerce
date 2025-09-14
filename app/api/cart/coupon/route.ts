// Cart coupon API endpoints for JC Hair Studio's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '../../../../lib/services/cartService';
import { withOptionalAuth, withSecurityHeaders, withRateLimit, withValidation } from '../../../../lib/auth/middleware';
import { AuthenticatedRequest } from '../../../../lib/auth/middleware';
import { z } from 'zod';

// Validation schema
const applyCouponSchema = z.object({
  couponCode: z.string().min(1, 'Coupon code is required').max(50, 'Coupon code too long'),
});

type ApplyCouponData = z.infer<typeof applyCouponSchema>;

/**
 * POST /api/cart/coupon - Apply coupon to cart
 */
async function applyCouponHandler(request: AuthenticatedRequest, validatedData: ApplyCouponData) {
  try {
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

    const result = await CartService.applyCoupon(validatedData.couponCode, userId, sessionId);

    return NextResponse.json({
      success: true,
      data: result,
      message: result.message
    });

  } catch (error: any) {
    console.error('Apply coupon error:', error);

    // Handle specific coupon errors
    const couponErrors = [
      'not found',
      'not active',
      'not yet valid',
      'expired',
      'usage limit',
      'minimum order'
    ];

    if (couponErrors.some(errorType => error.message.toLowerCase().includes(errorType))) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: 'COUPON_ERROR'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to apply coupon',
        code: 'APPLY_COUPON_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware
const POST = withSecurityHeaders(
  withRateLimit(
    withOptionalAuth(
      withValidation(
        applyCouponHandler,
        (data) => {
          try {
            const parsed = applyCouponSchema.parse(data);
            return { success: true, data: parsed };
          } catch (error) {
            return { success: false, errors: error };
          }
        }
      )
    ),
    {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
      keyGenerator: (req) => {
        const userId = (req as any).user?.userId;
        const sessionId = req.headers.get('x-session-id');
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `cart-coupon:${userId || sessionId || ip}`;
      }
    }
  )
);

export { POST };