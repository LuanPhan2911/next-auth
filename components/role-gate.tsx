import { UserRole } from "@prisma/client";
import { FormError } from "./form-error";

interface RoleGateProps {
  allowedRole?: UserRole;
  children: React.ReactNode;
}
export const RoleGate = ({ allowedRole, children }: RoleGateProps) => {
  if (!allowedRole) {
    return null;
  }
  if (allowedRole !== UserRole.ADMIN) {
    return <FormError message="You are not permission to see this content" />;
  }
  return children;
};
