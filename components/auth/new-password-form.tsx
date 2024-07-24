"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResetNewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { resetNewPassword } from "@/actions/auth";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const form = useForm<z.infer<typeof ResetNewPasswordSchema>>({
    resolver: zodResolver(ResetNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: z.infer<typeof ResetNewPasswordSchema>) => {
    if (!token) {
      setError("Token is missing");
      return;
    }
    startTransition(async () => {
      try {
        const { error, success } = await resetNewPassword(values, token);
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    type="password"
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
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
