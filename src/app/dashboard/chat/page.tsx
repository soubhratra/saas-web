import { cookies } from "next/headers";
import { ChatLayout } from "./chat-layout";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="flex h-[calc(80dvh)] flex-col items-center justify-center p-4 md:px-2 pt-2 gap-4">
      <div className="flex justify-between max-w-5xl w-full items-center">
        <Link href="#" className="text-4xl font-bold text-gradient">Chat</Link>
        <Link
          href="https://github.com/jakobhoeg/shadcn-chat"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-10 w-10"
          )}
        >
          {/* <GitHubLogoIcon className="w-7 h-7 text-muted-foreground" /> */}
        </Link>
      </div>

      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
      </div>

      <div className="flex justify-between max-w-5xl w-full items-start text-xs md:text-sm text-muted-foreground ">
      <p className="max-w-[150px] sm:max-w-lg"></p>
      <p className="max-w-[150px] sm:max-w-lg text-right"></p>
      </div>
    </main>
  );
}