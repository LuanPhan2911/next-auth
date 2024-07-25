"use client";

import { useForm } from "react-hook-form";
import { CardWrapper } from "./card-wrapper";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useEffect, useState, useTransition } from "react";
import { login } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const urlError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (urlError) {
      setError(() => {
        return urlError === "OAuthAccountNotLinked"
          ? "Email already in use with different provider"
          : "";
      });
    }
  }, [urlError]);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      try {
        const data = await login(values, callbackUrl);

        if (data?.error) {
          form.reset();
          setError(data.error);
        }
        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }
        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      } catch (error) {
        setError("Something went wrong!");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel={"Don't have accounts"}
      backButtonHref="/auth/register"
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-center font-semibold">
                    <FormLabel>Two Factor Code</FormLabel>
                  </div>
                  <FormControl>
                    <div className="w-full flex justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Button
                        size={"sm"}
                        variant={"link"}
                        asChild
                        className="font-semibold"
                      >
                        <Link href={"/auth/reset-password"}>
                          Forgot password?
                        </Link>
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            size={"lg"}
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
