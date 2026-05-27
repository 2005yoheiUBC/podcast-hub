import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'dev-placeholder-secret'

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

export const authOptions: NextAuthOptions = {
  providers: googleConfigured
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],
  callbacks: {
    session({ session, token }) {
      if (session.user) session.user.id = token.sub!
      return session
    },
  },
}
