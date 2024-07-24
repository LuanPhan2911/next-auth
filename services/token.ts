import { db } from "@/lib/db";
import { v4 } from "uuid";
import { getVerificationTokenByEmail } from "./verification-token";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/mail";
import { getResetPasswordTokenByEmail } from "./reset-password-token";
import moment from "moment";

export const generateVerificationToken = async (email: string) => {
  const token = v4();
  const expiredAt = new Date(new Date().getTime() + 3600 * 1000);

  const existingVerificationToken = await getVerificationTokenByEmail(email);
  if (existingVerificationToken) {
    await db.verificationToken.delete({
      where: {
        id: existingVerificationToken.id,
      },
    });
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      expiredAt,
      token,
    },
  });
  sendVerificationEmail(email, token);

  return verificationToken;
};
export const generateResetPasswordToken = async (email: string) => {
  const token = v4();
  const expiredAt = new Date(new Date().getTime() + 3600 * 1000);

  let existingResetPasswordToken = await getResetPasswordTokenByEmail(email);
  if (existingResetPasswordToken) {
    const hasTokenInDay = moment().isSame(
      existingResetPasswordToken.createdAt,
      "day"
    );

    if (!hasTokenInDay) {
      await db.resetPasswordToken.delete({
        where: {
          id: existingResetPasswordToken.id,
        },
      });

      existingResetPasswordToken = null;
    }
  }

  if (existingResetPasswordToken) {
    const hasMaximumReset = existingResetPasswordToken.count >= 5;

    if (hasMaximumReset) {
      return {
        error: "Maximum reset password in day is 5 times!",
      };
    }
  }
  if (existingResetPasswordToken) {
    await db.resetPasswordToken.update({
      where: {
        id: existingResetPasswordToken.id,
      },
      data: {
        token,
        expiredAt,
        count: {
          increment: 1,
        },
        isUsed: false,
      },
    });
  } else {
    await db.resetPasswordToken.create({
      data: {
        email,
        expiredAt,
        token,
      },
    });
  }

  sendResetPasswordEmail(email, token);

  return {
    data: token,
  };
};
