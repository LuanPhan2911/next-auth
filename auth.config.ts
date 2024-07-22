import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./services/user";
import bcrypt from "bcryptjs";
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = LoginSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          return null;
        }
        const { email, password } = validatedCredentials.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return null;
        }
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
