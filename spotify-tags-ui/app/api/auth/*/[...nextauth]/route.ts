import { credentialsProvider, spotifyProvider } from "@/lib/nextauth";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [spotifyProvider, credentialsProvider],
  pages: {
    signIn: "/signin",
  },
  debug: true,
});
export { handler as GET, handler as POST };
