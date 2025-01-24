// for some wierd reasons, spotify does redirect to /api/auth/*/callback instead of /api/auth/callback
// thus this route is added
export { handler as GET, handler as POST } from "@/lib/nextauth/handler";
