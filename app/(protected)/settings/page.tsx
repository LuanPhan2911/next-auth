import { logout } from "@/actions/auth";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirect: true,
            redirectTo: "/auth/login",
          });
        }}
      >
        <Button>Signout</Button>
      </form>
    </div>
  );
};

export default SettingsPage;
