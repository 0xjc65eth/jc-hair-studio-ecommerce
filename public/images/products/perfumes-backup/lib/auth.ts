import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { User } from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
  // Remover PrismaAdapter - usar JWT strategy apenas
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send"
        }
      }
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read",
          response_type: "code",
          code_challenge_method: "S256",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await User.findOne({
          email: credentials.email
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }

      // Para Google OAuth, garantir que temos o MongoDB ID
      if (account?.provider === "google" && user?.email) {
        try {
          const mongoUser = await User.findOne({ email: user.email })
          if (mongoUser) {
            token.id = mongoUser._id.toString()
          }
        } catch (error) {
          console.error('Erro ao buscar usuário MongoDB no JWT:', error)
        }
      }

      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Criar ou atualizar usuário Google no MongoDB
        if (user.email && profile?.email_verified) {
          try {
            const mongoUser = await User.findOneAndUpdate(
              { email: user.email },
              {
                name: user.name || profile.name,
                image: profile.picture || user.image,
                emailVerified: new Date(),
                isVerified: true,
                googleId: account.providerAccountId,
              },
              { upsert: true, new: true }
            )
            // Atualizar o user.id com o MongoDB ObjectId
            if (mongoUser) {
              user.id = mongoUser._id.toString()
            }
          } catch (error) {
            console.error('Erro ao salvar usuário Google:', error)
          }
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirecionamentos inteligentes
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/conta`
    }
  },
}