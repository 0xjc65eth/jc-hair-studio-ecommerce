import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifies that the current session has admin privileges
 * @returns The session object if authorized, or an error response
 */
export async function requireAdminAuth() {
  const session = await getServerSession();

  if (!session) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    };
  }

  const userRole = (session.user as any)?.role;

  if (!userRole || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    };
  }

  return {
    authorized: true as const,
    session,
    user: session.user,
    role: userRole
  };
}

/**
 * Verifies that the current session has super admin privileges
 * @returns The session object if authorized, or an error response
 */
export async function requireSuperAdminAuth() {
  const session = await getServerSession();

  if (!session) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    };
  }

  const userRole = (session.user as any)?.role;

  if (userRole !== 'SUPER_ADMIN') {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Forbidden - Super admin access required' },
        { status: 403 }
      )
    };
  }

  return {
    authorized: true as const,
    session,
    user: session.user,
    role: userRole
  };
}

/**
 * Type guard to check if auth result is authorized
 */
export function isAuthorized<T extends { authorized: boolean }>(
  result: T
): result is T & { authorized: true } {
  return result.authorized;
}
