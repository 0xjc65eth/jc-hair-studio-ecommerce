// JWT Authentication utilities for JC Hair Studio's 62's 62 E-commerce
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Helper to validate secrets at runtime (not during build)
function validateSecrets() {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET environment variable is required but not set');
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  userType?: 'RETAIL' | 'PROFESSIONAL';
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate JWT access and refresh tokens
 */
export function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthTokens {
  validateSecrets();
  const accessToken = jwt.sign(payload, JWT_SECRET!, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'jc-hair-studio',
    audience: 'jc-hair-studio-users'
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    JWT_REFRESH_SECRET!, 
    { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'jc-hair-studio',
      audience: 'jc-hair-studio-users'
    }
  );

  // Get expiration time in seconds
  const decoded = jwt.decode(accessToken) as any;
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

  return {
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  validateSecrets();
  try {
    const decoded = jwt.verify(token, JWT_SECRET!, {
      issuer: 'jc-hair-studio',
      audience: 'jc-hair-studio-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  validateSecrets();
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET!, {
      issuer: 'jc-hair-studio',
      audience: 'jc-hair-studio-users'
    }) as { userId: string };
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Extract JWT token from request headers
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  validateSecrets();
  return jwt.sign(
    {
      sessionId: Math.random().toString(36).substring(2) + Date.now().toString(36),
      timestamp: Date.now()
    },
    JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  if (requiredRoles.includes('CUSTOMER') && userRole === 'CUSTOMER') {
    return true;
  }
  if (requiredRoles.includes('ADMIN') && ['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
    return true;
  }
  if (requiredRoles.includes('SUPER_ADMIN') && userRole === 'SUPER_ADMIN') {
    return true;
  }
  return false;
}

/**
 * Check if token is about to expire (within 5 minutes)
 */
export function isTokenNearExpiry(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Token expires in less than 5 minutes
    return timeUntilExpiry < 300;
  } catch {
    return true;
  }
}