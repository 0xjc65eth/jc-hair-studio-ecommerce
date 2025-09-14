import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// Middleware to protect admin routes
export const protectAdmin = (handler: any) => {
  return async (req: any, ...args: any[]) => {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(req, ...args)
  }
}