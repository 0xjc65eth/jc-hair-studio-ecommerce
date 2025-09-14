// Authentication middleware for JC Hair Studio's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromRequest, hasRole, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Authentication middleware - verifies JWT token
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: {
    roles?: string[];
    optional?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const token = extractTokenFromRequest(request);
      
      if (!token) {
        if (options.optional) {
          // Continue without authentication for optional endpoints
          return handler(request as AuthenticatedRequest);
        }
        
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      
      if (!payload) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN'
          },
          { status: 401 }
        );
      }

      // Check role permissions
      if (options.roles && !hasRole(payload.role, options.roles)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_PERMISSIONS'
          },
          { status: 403 }
        );
      }

      // Add user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = payload;

      return handler(authenticatedRequest);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication error',
          code: 'AUTH_ERROR'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Admin-only middleware
 */
export function withAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(handler, { roles: ['ADMIN'] });
}

/**
 * Super admin-only middleware
 */
export function withSuperAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(handler, { roles: ['SUPER_ADMIN'] });
}

/**
 * Customer authentication middleware (optional for some endpoints)
 */
export function withOptionalAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(handler, { optional: true });
}

/**
 * Rate limiting middleware
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (req: NextRequest) => string;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const key = options.keyGenerator 
      ? options.keyGenerator(request)
      : request.ip || 'default';
    
    const now = Date.now();
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs
      });
      return handler(request);
    }
    
    if (record.count >= options.maxRequests) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
          }
        }
      );
    }
    
    record.count++;
    return handler(request);
  };
}

/**
 * CORS middleware
 */
export function withCORS(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    origin?: string | string[];
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request);
    
    // Set CORS headers
    const origin = request.headers.get('origin');
    const allowedOrigins = Array.isArray(options.origin) ? options.origin : [options.origin || '*'];
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set(
      'Access-Control-Allow-Methods',
      (options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).join(', ')
    );
    
    response.headers.set(
      'Access-Control-Allow-Headers',
      (options.headers || ['Content-Type', 'Authorization', 'X-Requested-With']).join(', ')
    );
    
    if (options.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  };
}

/**
 * Input validation middleware
 */
export function withValidation<T>(
  handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>,
  validator: (data: any) => { success: boolean; data?: T; errors?: any }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      let data: any;
      
      if (request.method === 'GET') {
        // Convert search params to object
        data = Object.fromEntries(request.nextUrl.searchParams.entries());
      } else {
        data = await request.json();
      }
      
      const validation = validator(data);
      
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.errors
          },
          { status: 400 }
        );
      }
      
      return handler(request, validation.data!);
    } catch (error) {
      console.error('Validation middleware error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }
  };
}

/**
 * Security headers middleware
 */
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request);
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
    
    return response;
  };
}

/**
 * Combine multiple middlewares
 */
export function compose(...middlewares: Array<(handler: any) => any>) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}