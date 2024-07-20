"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}
export const LoginButton = ({ children, asChild, mode }: LoginButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/auth/login");
  };
  if (mode === "modal") {
    return <div>TODO: MODAL</div>;
  }
  return <span onClick={handleClick}>{children}</span>;
};
