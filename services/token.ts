import { db } from "@/lib/db";
import { v4 } from "uuid";
import { getVerificationTokenByEmail } from "./verification-token";
import {
  sendResetPasswordEmail,
  sendTwoFactorToken,
  sendVerificationEmail,
} from "@/lib/mail";
import { getResetPasswordTokenByEmail } from "./reset-password-token";
import { randomInt } from "crypto";
import moment from "moment";
import { getTwoFactorTokenByEmail } from "./two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = randomInt(100_000, 1_000_000).toString();
  const expiredAt = moment().add(5, "minute").toDate();
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      expiredAt,
      token,
    },
  });
  sendTwoFactorToken(email, token);
  return twoFactorToken;
};
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
