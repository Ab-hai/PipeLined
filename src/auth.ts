import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      // On sign in, persist the user id into the token
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      // Pass the id from the token into the session
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
});
