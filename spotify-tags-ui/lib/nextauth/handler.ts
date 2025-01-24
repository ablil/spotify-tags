import { credentialsProvider, spotifyProvider } from "@/lib/nextauth/providers";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

type CustomAuthProperties = { accessToken?: string };
export type ExtendedSession = Session & CustomAuthProperties;
export type ExtendedJWT = JWT & CustomAuthProperties;

export const handler = NextAuth({
  providers: [spotifyProvider, credentialsProvider],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session(data) {
      const newSession: ExtendedSession = { ...data.session, accessToken: (data.token as ExtendedJWT).accessToken };
      return newSession;
    },
    async jwt({ token, account }) {
      const extendedToken: ExtendedJWT = { ...token, accessToken: account?.access_token };
      return extendedToken;
    },
  },
  debug: true,
});
