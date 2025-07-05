import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: String(user.id), email: user.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
