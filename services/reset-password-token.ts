import { db } from "@/lib/db";

export const getResetPasswordTokenByEmail = async (email: string) => {
  const resetPasswordToken = await db.resetPasswordToken.findFirst({
    where: {
      email,
    },
  });
  return resetPasswordToken;
};
export const getResetPasswordTokenByToken = async (token: string) => {
  const resetPasswordToken = await db.resetPasswordToken.findUnique({
    where: {
      token,
    },
  });
  return resetPasswordToken;
};
