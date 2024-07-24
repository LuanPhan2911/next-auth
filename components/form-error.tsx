"use client";

import { TriangleAlert } from "lucide-react";
interface FormErrorProps {
  message?: string;
}
export const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }
  return (
    <div
      className="w-full rounded-md bg-destructive/15 text-destructive flex items-center
     gap-x-2 p-3 justify-center"
    >
      <TriangleAlert className="h-5 w-5" />
      <p className="text-sm">{message}</p>
    </div>
  );
};
