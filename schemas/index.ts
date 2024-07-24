import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
export const ResetNewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minlength of password is 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minlength of confirm password is 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password mismatch!",
    path: ["confirmPassword"],
  });
export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password is minlength is 6 characters",
  }),
});
