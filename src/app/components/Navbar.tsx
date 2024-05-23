import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav, UserNavAdmin } from "./UserNav";
import { auth } from "@/auth";
import { getUserByEmail } from "../api/auth/data";

const handleStartClick = () => {
  if (typeof window !== "undefined") {
    if (localStorage.length) {
      localStorage.clear(); // Clear local storage
    }
  }
};

export async function Navbar() {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  const role = user?.userRole;
  handleStartClick();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <div className="flex justify-center flex-grow mt-2 mb-3">
          </div>
        </Link>

        <div className="flex items-center gap-x-5">
          {await auth() ? (
            ((role === 'Support' || role === 'Admin')) ? (
              <UserNavAdmin
                email={user?.email as string}
                givenName={user?.given_name as string}
                familyName={user?.family_name as string}
              />
            ) : (
              <UserNav
                email={user?.email as string}
                givenName={user?.given_name as string}
                familyName={user?.family_name as string}
              />
            )
          ) : (
            <div className="flex items-center gap-x-5">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
