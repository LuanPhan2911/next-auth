"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
  const user = useCurrentUser();
  return <div>{user?.email}</div>;
};

export default SettingsPage;
