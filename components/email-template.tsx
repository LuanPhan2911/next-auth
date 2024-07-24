import * as React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface VerificationEmailTemplateProps {
  confirmLink: string;
}
export const VerificationEmailTemplate: React.FC<
  Readonly<VerificationEmailTemplateProps>
> = ({ confirmLink }) => {
  return <a href={confirmLink}>Click here to confirm your email!</a>;
};
interface ResetPasswordTemplateProps {
  confirmLink: string;
}
export const ResetPasswordTemplate: React.FC<
  Readonly<ResetPasswordTemplateProps>
> = ({ confirmLink }) => {
  return <a href={confirmLink}>Click here to confirm your email!</a>;
};
