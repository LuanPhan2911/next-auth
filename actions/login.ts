"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (validatedValues.error) {
    throw new Error("Invalid Email");
  }
  return {
    success: "Sent email",
  };
};
