import {
  ResetPasswordTemplate,
  VerificationEmailTemplate,
} from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirm email",
    react: VerificationEmailTemplate({ confirmLink }),
  });
  if (error) {
    return {
      error: "Send verification fail!",
    };
  }
  return {
    success: "Please check your email to confirm your email to login!",
  };
};
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset password email",
    react: ResetPasswordTemplate({ confirmLink }),
  });
  if (error) {
    return {
      error: "Send reset password fail!",
    };
  }
  return {
    success: "Please check your email to confirm!",
  };
};
