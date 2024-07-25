import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById, updateUserEmailVerifiedById } from "./services/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./services/two-factor-confirmation";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactor: boolean;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  events: {
    linkAccount: async ({ user }) => {
      await updateUserEmailVerifiedById(user.id);
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== "credentials") {
        return true;
      }
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) {
        return false;
      }
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) {
          return false;
        }
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }
      if (session.user && token.isTwoFactor) {
        session.user.isTwoFactor = token.isTwoFactor as boolean;
      }

      return session;
    },
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      token.role = existingUser.role;
      token.isTwoFactor = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  ...authConfig,
});
