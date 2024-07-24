import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  return await db.twoFactorConfirmation.findUnique({
    where: {
      userId,
    },
  });
};
