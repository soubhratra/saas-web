import Link from "next/link";
import { ThemeToggle } from "./Themetoggle";
import { Button } from "@/components/ui/button";
import { UserNav, UserNavAdmin } from "./UserNav";
import { auth } from "@/auth";
import { Bell } from "lucide-react";
import { getUserByEmail } from "../api/auth/data";
import { fetchNotifications } from "../dashboard/notification/page";

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
  const notifications = await fetchNotifications(user?.id);
  const hasUnreadNotifications = notifications.some((notification: any) => !notification.isRead);
  handleStartClick();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <div className="flex justify-center flex-grow mt-2 mb-3">
            <h2 className="text-2xl font-extrabold tracking-tighter ">
              SaaS Accelerator
            </h2>
          </div>
        </Link>
       
        <div className="flex items-center gap-x-5">
        <Link href="/dashboard/notification" className="relative">
            <Bell />
            {hasUnreadNotifications && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </Link>
          <ThemeToggle />
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
