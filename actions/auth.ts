"use server";

import { db } from "@/lib/db";
import {
  LoginSchema,
  RegisterSchema,
  ResetNewPasswordSchema,
  ResetPasswordSchema,
} from "@/schemas";
import { z } from "zod";
import { getUserByEmail } from "@/services/user";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateResetPasswordToken,
  generateVerificationToken,
} from "@/services/token";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail";
import { getVerificationTokenByToken } from "@/services/verification-token";
import { getResetPasswordTokenByToken } from "@/services/reset-password-token";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {
    return {
      error: "Invalid field",
    };
  }
  const { email, password } = validatedValues.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Invalid credentials!",
    };
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    return {
      success: "Please check your email to confirm email!",
    };
  }

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
            error: "Email or password incorrect!",
          };
        case "AuthorizedCallbackError":
          return {
            error: "Please check email verification!",
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

  const verificationToken = await generateVerificationToken(email);
  return {
    success: "Please check your email to confirm email!",
  };
};

export const logout = async () => {
  await signOut({
    redirectTo: "/auth/login",
  });
};
export const verifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return {
      error: "Token is not exist!",
    };
  }
  const hasExpired = new Date(existingToken.expiredAt) < new Date();
  if (hasExpired) {
    return {
      error: "Token has expired!",
    };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: "Email is invalid!",
    };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingUser.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return {
    success: "Email verified!",
  };
};
export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validatedValues = ResetPasswordSchema.safeParse(values);
  if (!validatedValues.success) {
    return {
      error: "Email is invalid!",
    };
  }
  const { email } = validatedValues.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      error: "Email is invalid!",
    };
  }
  const resetPasswordToken = await generateResetPasswordToken(email);
  if (resetPasswordToken.error) {
    return {
      error: resetPasswordToken.error,
    };
  }
  return {
    success: "Reset email sent!",
  };
};
export const resetNewPassword = async (
  values: z.infer<typeof ResetNewPasswordSchema>,
  token: string
) => {
  const validatedValues = ResetNewPasswordSchema.safeParse(values);
  if (!validatedValues.success) {
    return {
      error: "Password is invalid!",
    };
  }
  const existingToken = await getResetPasswordTokenByToken(token);
  if (!existingToken || existingToken.isUsed) {
    return {
      error: "Token is invalid!",
    };
  }
  const hasExpired = new Date(existingToken.expiredAt) < new Date();
  if (hasExpired) {
    return {
      error: "Token has expired!",
    };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: "Email is invalid!",
    };
  }
  const { password } = validatedValues.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await db.resetPasswordToken.update({
    where: {
      id: existingToken.id,
    },
    data: {
      isUsed: true,
    },
  });
  return {
    success: "Reset password success!",
  };
};
