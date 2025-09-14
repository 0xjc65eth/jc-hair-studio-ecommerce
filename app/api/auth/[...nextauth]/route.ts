import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-options'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: string
      isVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role: string
    isVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    isVerified: boolean
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }