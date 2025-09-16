// Recommendations API endpoint for JC Hair Studio's 62's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '../../../lib/services/recommendationService';
import { withOptionalAuth, withSecurityHeaders, withRateLimit } from '../../../lib/auth/middleware';
import { AuthenticatedRequest } from '../../../lib/auth/middleware';

async function recommendationsHandler(request: AuthenticatedRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const type = searchParams.get('type') || 'personalized';
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limit = Math.min(Number(searchParams.get('limit') || 8), 20);
    const excludeIds = searchParams.getAll('exclude');

    let recommendations = [];

    switch (type) {
      case 'personalized':
        if (request.user?.userId) {
          recommendations = await RecommendationService.getPersonalizedRecommendations(
            request.user.userId,
            { limit, excludeProductIds: excludeIds }
          );
        } else {
          // Fallback to popular products for non-authenticated users
          recommendations = await RecommendationService.getPopularProducts({
            limit,
            excludeProductIds: excludeIds
          });
        }
        break;

      case 'similar':
        if (!productId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Product ID is required for similar recommendations',
              code: 'MISSING_PRODUCT_ID'
            },
            { status: 400 }
          );
        }
        recommendations = await RecommendationService.getSimilarProducts(productId, {
          limit,
          excludeProductIds: excludeIds
        });
        break;

      case 'frequently_bought':
        if (!productId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Product ID is required for frequently bought recommendations',
              code: 'MISSING_PRODUCT_ID'
            },
            { status: 400 }
          );
        }
        recommendations = await RecommendationService.getFrequentlyBoughtTogether(productId, {
          limit,
          excludeProductIds: excludeIds
        });
        break;

      case 'category':
        if (!categoryId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Category ID is required for category recommendations',
              code: 'MISSING_CATEGORY_ID'
            },
            { status: 400 }
          );
        }
        recommendations = await RecommendationService.getRelatedByCategory(categoryId, {
          limit,
          excludeProductIds: excludeIds
        });
        break;

      case 'popular':
        recommendations = await RecommendationService.getPopularProducts({
          limit,
          excludeProductIds: excludeIds
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid recommendation type',
            code: 'INVALID_TYPE'
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        type,
        count: recommendations.length,
        metadata: {
          productId,
          categoryId,
          limit,
          userId: request.user?.userId || null
        }
      }
    });

  } catch (error) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'RECOMMENDATIONS_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware
const GET = withSecurityHeaders(
  withRateLimit(
    withOptionalAuth(recommendationsHandler),
    {
      maxRequests: 50,
      windowMs: 15 * 60 * 1000, // 15 minutes
      keyGenerator: (req) => {
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `recommendations:${ip}`;
      }
    }
  )
);

export { GET };