import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");
        const adminEmail = process.env.ADMIN_EMAIL || "";
        const adminPassword = process.env.ADMIN_PASSWORD || "";
        if (!adminEmail || !adminPassword) return null;
        if (email === adminEmail && password === adminPassword) {
          return { id: "admin", email: adminEmail, name: "Admin" };
        }
        return null;
      }
    })
  ]
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
