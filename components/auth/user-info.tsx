"use client";

import { ExtendedUser } from "@/auth";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

interface UserInfoProps {
  label: string;
  user?: ExtendedUser;
}
export const UserInfo = ({ label, user }: UserInfoProps) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl text-center font-semibold">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm">ID</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-2 bg-slate-100 rounded-md">
            {user?.id}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm">Name</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-2 bg-slate-100 rounded-md">
            {user?.name}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm">Email</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-2 bg-slate-100 rounded-md">
            {user?.email}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm">Role</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-2 bg-slate-100 rounded-md">
            {user?.role}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm">Two factor authentication</p>

          <Badge variant={user?.isTwoFactor ? "success" : "destructive"}>
            {user?.isTwoFactor ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
