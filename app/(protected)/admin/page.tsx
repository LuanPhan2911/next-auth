"use client";

import { FormSuccess } from "@/components/form-success";
import { RoleGate } from "@/components/role-gate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";

const AdminPage = () => {
  const user = useCurrentUser();
  return (
    <Card className="w-[600px]">
      <CardHeader>Admin Component</CardHeader>
      <CardContent>
        <RoleGate allowedRole={user?.role}>
          <FormSuccess message="You are allowed see this content" />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
