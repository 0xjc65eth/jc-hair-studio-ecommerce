import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';

interface SystemHealthCheck {
  environment: {
    nodeEnv: string;
    nextAuthUrl: string;
    siteUrl: string;
    locale: string;
  };
  database: {
    status: 'connected' | 'disconnected' | 'error';
    url?: string;
    lastCheck: string;
    error?: string;
    responseTime?: number;
  };
  email: {
    configured: boolean;
    provider: string;
    testMode: boolean;
    lastTest?: string;
    recentAttempts: any[];
  };
  stripe: {
    configured: boolean;
    mode: 'test' | 'live';
    webhookConfigured: boolean;
    lastWebhook?: string;
  };
  apis: {
    health: 'healthy' | 'degraded' | 'down';
    endpoints: Array<{
      endpoint: string;
      status: 'online' | 'offline' | 'slow';
      responseTime?: number;
      lastCheck: string;
      error?: string;
    }>;
  };
}

async function checkDatabaseConnection(): Promise<{
  status: 'connected' | 'disconnected' | 'error';
  responseTime?: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    console.log('🔍 Checking database connection...');

    const db = await connectDB();

    // Try a simple operation to verify connection
    await db.admin().ping();

    const responseTime = Date.now() - startTime;
    console.log('✅ Database connection successful', { responseTime });

    return {
      status: 'connected',
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('❌ Database connection failed:', error);

    return {
      status: 'error',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

async function checkApiEndpoint(endpoint: string): Promise<{
  status: 'online' | 'offline' | 'slow';
  responseTime?: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}${endpoint}`;

    console.log(`🔍 Checking API endpoint: ${endpoint}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Debug-System-Check',
        'Accept': 'application/json'
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const status = responseTime > 2000 ? 'slow' : 'online';
      console.log(`✅ API endpoint ${endpoint} is ${status}`, { responseTime });
      return { status, responseTime };
    } else {
      console.warn(`⚠️ API endpoint ${endpoint} returned ${response.status}`, { responseTime });
      return {
        status: 'offline',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`❌ API endpoint ${endpoint} failed:`, error);

    return {
      status: 'offline',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting system health check...');

    const startTime = Date.now();

    // Check database connection
    const databaseStatus = await checkDatabaseConnection();

    // Check critical API endpoints
    const criticalEndpoints = [
      '/api/products',
      '/api/contact',
      '/api/points',
      '/api/search'
    ];

    const endpointChecks = await Promise.allSettled(
      criticalEndpoints.map(async (endpoint) => {
        const result = await checkApiEndpoint(endpoint);
        return {
          endpoint,
          ...result,
          lastCheck: new Date().toISOString()
        };
      })
    );

    const endpoints = endpointChecks.map((check, index) => {
      if (check.status === 'fulfilled') {
        return check.value;
      } else {
        return {
          endpoint: criticalEndpoints[index],
          status: 'offline' as const,
          error: check.reason?.message || 'Check failed',
          lastCheck: new Date().toISOString()
        };
      }
    });

    // Determine overall API health
    const onlineCount = endpoints.filter(e => e.status === 'online').length;
    const slowCount = endpoints.filter(e => e.status === 'slow').length;
    const offlineCount = endpoints.filter(e => e.status === 'offline').length;

    let apiHealth: 'healthy' | 'degraded' | 'down';
    if (offlineCount === 0 && slowCount === 0) {
      apiHealth = 'healthy';
    } else if (onlineCount > offlineCount) {
      apiHealth = 'degraded';
    } else {
      apiHealth = 'down';
    }

    // Build system status response
    const systemStatus: SystemHealthCheck = {
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'not-set',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'not-set',
        locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'pt'
      },
      database: {
        status: databaseStatus.status,
        url: process.env.MONGODB_URI ? 'configured' : 'not-configured',
        lastCheck: new Date().toISOString(),
        error: databaseStatus.error,
        responseTime: databaseStatus.responseTime
      },
      email: {
        configured: !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')),
        provider: process.env.SENDGRID_API_KEY ? 'SendGrid' : 'Not configured',
        testMode: process.env.SENDGRID_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production',
        recentAttempts: [] // This would be populated from email history in a real implementation
      },
      stripe: {
        configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
        mode: process.env.STRIPE_SECRET_KEY?.includes('sk_test') ? 'test' : 'live',
        webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET
      },
      apis: {
        health: apiHealth,
        endpoints
      }
    };

    const totalTime = Date.now() - startTime;

    console.log('✅ System health check completed', {
      totalTime,
      databaseStatus: databaseStatus.status,
      apiHealth,
      endpointsChecked: endpoints.length
    });

    return NextResponse.json({
      success: true,
      ...systemStatus,
      metadata: {
        checkDuration: totalTime,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || 'unknown'
      }
    });

  } catch (error) {
    console.error('❌ System health check failed:', error);

    return NextResponse.json({
      success: false,
      error: 'System health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}