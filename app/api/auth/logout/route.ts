// Logout endpoint for JC Hair Studio's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSecurityHeaders } from '../../../../lib/auth/middleware';

async function logoutHandler(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear authentication cookies
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    });

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware - optional auth since user might already be logged out
const POST = withSecurityHeaders(withAuth(logoutHandler, { optional: true }));

export { POST };