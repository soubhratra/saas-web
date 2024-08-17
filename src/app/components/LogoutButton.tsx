'use client';
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DoorClosed } from "lucide-react";

export function LogoutButton() {
  return (
    <div>
      <Button
        type="button"
        className="flex h-[45px] w-[215px] grow items-center justify-between gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3"
        onClick={() => signOut()}>
        <div>Sign out</div>
        <DoorClosed className="w-6" />
      </Button>
    </div>
  );
}