"use client";

import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";

export const Social = () => {
  const onSignIn = (provider: "github" | "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="w-full flex items-center gap-x-2">
      <div className="flex items-center w-full gap-x-2">
        <Button
          size={"lg"}
          className="w-full"
          variant={"outline"}
          onClick={() => onSignIn("github")}
        >
          <FaGithub className="h-5 w-5" />
        </Button>
        <Button
          size={"lg"}
          className="w-full"
          variant={"outline"}
          onClick={() => onSignIn("google")}
        >
          <FcGoogle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
