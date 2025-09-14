// User profile API endpoints for JC Hair Studio's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../lib/services/userService';
import { withAuth, withSecurityHeaders, withRateLimit, withValidation } from '../../../../lib/auth/middleware';
import { AuthenticatedRequest } from '../../../../lib/auth/middleware';
import { z } from 'zod';

// Validation schema
const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone format').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  newsletter: z.boolean().optional(),
  marketing: z.boolean().optional(),
  userType: z.enum(['RETAIL', 'PROFESSIONAL']).optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

/**
 * GET /api/user/profile - Get user profile
 */
async function getProfileHandler(request: AuthenticatedRequest) {
  try {
    const userId = request.user!.userId;
    
    const profile = await UserService.getUserProfile(userId);
    
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found',
          code: 'PROFILE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve profile',
        code: 'PROFILE_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile - Update user profile
 */
async function updateProfileHandler(request: AuthenticatedRequest, validatedData: UpdateProfileData) {
  try {
    const userId = request.user!.userId;
    
    const updatedProfile = await UserService.updateProfile(userId, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware
const GET = withSecurityHeaders(
  withRateLimit(
    withAuth(getProfileHandler),
    {
      maxRequests: 50,
      windowMs: 15 * 60 * 1000,
      keyGenerator: (req) => {
        const userId = (req as any).user?.userId;
        return `profile-get:${userId}`;
      }
    }
  )
);

const PUT = withSecurityHeaders(
  withRateLimit(
    withValidation(
      withAuth(updateProfileHandler),
      (data) => {
        try {
          const parsed = updateProfileSchema.parse(data);
          return { success: true, data: parsed };
        } catch (error) {
          return { success: false, errors: error };
        }
      }
    ),
    {
      maxRequests: 20,
      windowMs: 15 * 60 * 1000,
      keyGenerator: (req) => {
        const userId = (req as any).user?.userId;
        return `profile-update:${userId}`;
      }
    }
  )
);

export { GET, PUT };