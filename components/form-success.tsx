"use client";

import { CircleCheck } from "lucide-react";
interface FormSuccessProps {
  message?: string;
}
export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }
  return (
    <div
      className="w-full rounded-md bg-emerald-500/15 text-emerald-500 flex items-center
     gap-x-2 p-3"
    >
      <CircleCheck className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
};
