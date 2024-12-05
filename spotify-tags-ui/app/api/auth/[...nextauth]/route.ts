import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "password", type: "password" },
      },
      // eslint-disable-next-line
      async authorize(credentials, _): Promise<any> {
        if (credentials?.password ===process.env.PASSWORD) {
          return {
            name: 'admin',
            email: 'admin@example.com'
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/hmmm'
  },
  debug: true,
})
export { handler as GET, handler as POST }
