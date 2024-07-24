"use client";

import { useState, useTransition } from "react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas";
import { z } from "zod";
import { resetPassword } from "@/actions/auth";

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(async () => {
      try {
        const { error, success } = await resetPassword(values);
        setError(error);
        setSuccess(success);
      } catch (error) {}
    });
  };
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Go to login"
      headerLabel="Reset password"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="doe@gmail.example.com"
                    {...field}
                    type="email"
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            size={"lg"}
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Send reset password email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
