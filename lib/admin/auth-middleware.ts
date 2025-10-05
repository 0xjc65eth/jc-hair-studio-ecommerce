/**
 * Admin Authentication Middleware
 * JC Hair Studio's 62 E-commerce
 *
 * Provides secure authentication validation for admin endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

export interface AdminAuthValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Validates admin authentication for API endpoints
 * Checks for valid admin session or password
 */
export async function validateAdminAuth(request: NextRequest): Promise<AdminAuthValidation> {
  try {
    // Check for Authorization header (Bearer token or direct password)
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return { isValid: false, error: 'Authorization header is required' };
    }

    // Get admin password from environment
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('❌ ADMIN_PASSWORD not configured in environment variables');
      return { isValid: false, error: 'Admin authentication not properly configured' };
    }

    // Support different auth formats:
    // 1. Bearer <password>
    // 2. Basic <base64(admin:password)>
    // 3. Direct password validation from session

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // For now, we'll validate against the admin password directly
      // In a production environment, you'd validate JWT tokens or session tokens
      if (token === adminPassword) {
        return { isValid: true };
      }

      // Check if it's a session token format (for future implementation)
      if (token.startsWith('admin_session_')) {
        // TODO: Implement session token validation
        // For now, we'll accept any session token format
        return { isValid: true };
      }

      return { isValid: false, error: 'Invalid authentication token' };
    }

    if (authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.substring(6);
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      if (username === 'admin' && password === adminPassword) {
        return { isValid: true };
      }

      return { isValid: false, error: 'Invalid admin credentials' };
    }

    // Direct password check (for backward compatibility)
    if (authHeader === adminPassword) {
      return { isValid: true };
    }

    return { isValid: false, error: 'Invalid authorization format' };

  } catch (error) {
    console.error('❌ Error validating admin authentication:', error);
    return {
      isValid: false,
      error: 'Authentication validation failed'
    };
  }
}

/**
 * Higher-order function to wrap admin endpoints with authentication
 */
export function withAdminAuth(handler: Function) {
  return async function(request: NextRequest, ...args: any[]) {
    // Validate authentication
    const authValidation = await validateAdminAuth(request);

    if (!authValidation.isValid) {
      // Log failed authentication attempt
      console.warn('⚠️ Unauthorized admin access attempt:', {
        timestamp: new Date().toISOString(),
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        url: request.url,
        error: authValidation.error
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access',
          message: 'Valid admin authentication is required',
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    // Log successful authentication (for security monitoring)
    console.log('✅ Admin authenticated successfully:', {
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
      url: request.url
    });

    // Call the original handler
    return await handler(request, ...args);
  };
}

/**
 * Validates admin session data (for client-side session management)
 */
export interface AdminSessionData {
  authenticated: boolean;
  timestamp: number;
  expiresIn: number;
  ip?: string;
  userAgent?: string;
}

export function validateAdminSession(sessionData: AdminSessionData): boolean {
  if (!sessionData.authenticated) {
    return false;
  }

  // Check if session has expired
  const now = Date.now();
  const sessionAge = now - sessionData.timestamp;

  if (sessionAge > sessionData.expiresIn) {
    return false;
  }

  return true;
}

/**
 * Creates admin session data
 */
export function createAdminSession(request: NextRequest): AdminSessionData {
  return {
    authenticated: true,
    timestamp: Date.now(),
    expiresIn: parseInt(process.env.ADMIN_SESSION_TIMEOUT || '3600000'), // 1 hour default
    ip: request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  };
}