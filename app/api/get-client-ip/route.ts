import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to get client IP address
 * Supports various proxy configurations and deployment environments
 * Used for fraud prevention and order tracking
 */
export async function GET(request: NextRequest) {
  try {
    // Get client IP from various possible headers (supporting different proxy setups)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = request.headers.get('x-client-ip');
    const forwardedFor = request.headers.get('x-forwarded-for');

    // Determine the most reliable IP address
    let ip = 'Unknown';

    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, take the first one
      ip = forwarded.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp;
    } else if (clientIp) {
      ip = clientIp;
    } else if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else {
      // Fallback to connection remote address
      ip = request.ip || 'Unknown';
    }

    // Additional security information
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const acceptLanguage = request.headers.get('accept-language') || 'Unknown';
    const referer = request.headers.get('referer') || 'direct';

    console.log('🌐 Client IP Request:', {
      ip,
      userAgent: userAgent.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: {
        ip,
        userAgent,
        acceptLanguage,
        referer,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error getting client IP:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to get client IP',
      data: {
        ip: 'Unknown',
        userAgent: 'Unknown',
        acceptLanguage: 'Unknown',
        referer: 'Unknown',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

/**
 * POST method to get client IP with additional context
 * Accepts optional context data for enhanced tracking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = request.headers.get('x-client-ip');

    let ip = 'Unknown';
    if (forwarded) {
      ip = forwarded.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp;
    } else if (clientIp) {
      ip = clientIp;
    } else {
      ip = request.ip || 'Unknown';
    }

    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const acceptLanguage = request.headers.get('accept-language') || 'Unknown';
    const referer = request.headers.get('referer') || 'direct';

    const response = {
      success: true,
      data: {
        ip,
        userAgent,
        acceptLanguage,
        referer,
        timestamp: new Date().toISOString(),
        context: body.context || null
      }
    };

    console.log('🌐 Enhanced Client IP Request:', {
      ip,
      userAgent: userAgent.substring(0, 50) + '...',
      context: body.context,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error in POST client IP:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to process client IP request'
    }, { status: 500 });
  }
}