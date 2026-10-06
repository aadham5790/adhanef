import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.userId as string,
          name: token.name as string,
          email: token.email as string
        };
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login"
  },
  session: { strategy: "jwt" }
});