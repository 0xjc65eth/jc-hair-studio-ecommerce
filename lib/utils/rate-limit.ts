import { NextRequest } from 'next/server';

// In-memory store for rate limiting (production should use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  request: NextRequest;
  identifier: string;
  limit: number;
  window: number; // Time window in milliseconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiting utility
 *
 * Features:
 * - IP-based rate limiting with custom identifiers
 * - Sliding window approach
 * - Automatic cleanup of expired entries
 * - Production-ready structure (easily adaptable to Redis)
 *
 * @param options - Rate limiting configuration
 * @returns Promise resolving to rate limit result
 */
export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { request, identifier, limit, window } = options;

  // Get client IP address
  const ip = request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown';

  // Create unique key for this IP + identifier combination
  const key = `${ip}:${identifier}`;
  const now = Date.now();
  const resetTime = now + window;

  // Get or create entry for this key
  let entry = rateLimitStore.get(key);

  // Clean up expired entries periodically (basic cleanup)
  if (Math.random() < 0.01) { // 1% chance to trigger cleanup
    cleanupExpiredEntries();
  }

  if (!entry || now > entry.resetTime) {
    // No entry exists or entry has expired - create new one
    entry = {
      count: 1,
      resetTime,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count and update entry
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`Rate limit cleanup: removed ${cleanedCount} expired entries`);
  }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  request: NextRequest,
  identifier: string
): Promise<{ count: number; resetTime: number } | null> {
  const ip = request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown';

  const key = `${ip}:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry || Date.now() > entry.resetTime) {
    return null;
  }

  return {
    count: entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific IP + identifier
 * Useful for admin operations or testing
 */
export function resetRateLimit(ip: string, identifier: string): boolean {
  const key = `${ip}:${identifier}`;
  return rateLimitStore.delete(key);
}

/**
 * Get rate limit store statistics
 */
export function getRateLimitStats(): {
  totalEntries: number;
  activeEntries: number;
  expiredEntries: number;
} {
  const now = Date.now();
  let activeEntries = 0;
  let expiredEntries = 0;

  for (const entry of rateLimitStore.values()) {
    if (now > entry.resetTime) {
      expiredEntries++;
    } else {
      activeEntries++;
    }
  }

  return {
    totalEntries: rateLimitStore.size,
    activeEntries,
    expiredEntries,
  };
}

export default rateLimit;