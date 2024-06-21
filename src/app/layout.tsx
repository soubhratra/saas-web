import type { Metadata } from "next";
import { Roboto } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from 'sonner';
import Chatbot from "./components/chatbot";
import { auth } from "@/auth";
import { getUserByEmail } from "@/app/api/auth/data";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

// const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "SaaS-Web",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${user?.colorScheme ?? "theme-default"}`}
      >
        <Chatbot/>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors closeButton position="top-center"/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}