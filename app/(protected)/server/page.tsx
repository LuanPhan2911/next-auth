import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/services/auth";

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo label="Server component" user={user} />;
};
export default ServerPage;
