"use server";

import { db } from "@/lib/db";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/services/user";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {
    return {
      error: "Invalid field",
    };
  }
  const { email, password } = validatedValues.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return {
      success: "Success",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials!",
          };
        default:
          return {
            error: "Something went wrong!",
          };
      }
    }
    throw error;
  }
};
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedValues = RegisterSchema.safeParse(values);
  if (!validatedValues.success) {
    return {
      error: "Invalid fields",
    };
  }
  const { email, name, password } = validatedValues.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: "Email or password is invalid. Try another email or password",
    };
  }
  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  //TODO: send verification email
  return {
    success: "An account is created",
  };
};
export const logout = async () => {
  await signOut({
    redirectTo: "/auth/login",
  });
};
