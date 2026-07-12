import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt", // ✅ explicit (แม้ default อยู่แล้ว)
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null; // ⚠️  ไม่ throw — user enumeration protection
        }
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return null; // ⚠️  ไม่ throw — user enumeration protection
        }
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          return null; // ⚠️  ไม่ throw — user enumeration protection
        }
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
});
