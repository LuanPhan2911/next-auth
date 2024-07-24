"use client";

import { verifyToken } from "@/actions/auth";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export const VerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Token is missing");
      return;
    }

    try {
      const { error, success } = await verifyToken(token);
      setError(error);
      setSuccess(success);
    } catch (error) {
      setError("Something went wrong!");
    }
  }, [token]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Go to login"
      headerLabel="Confirm your verification"
    >
      <div className="flex justify-center w-full">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
