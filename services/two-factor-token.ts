import { db } from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email: string) => {
  const twoFactorToken = await db.twoFactorToken.findFirst({
    where: {
      email,
    },
  });
  return twoFactorToken;
};
export const getTwoFactorTokenByToken = async (token: string) => {
  const twoFactorToken = await db.twoFactorToken.findUnique({
    where: {
      token,
    },
  });
  return twoFactorToken;
};
