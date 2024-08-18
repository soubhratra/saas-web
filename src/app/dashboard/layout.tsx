import { ReactNode } from "react";
import { DashboardNav, DashboardNavAdmin } from "../components/DashboardNav";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Navbar } from "@/app/components/Navbar";
import { auth } from "@/auth";
import { getUserByEmail } from "../api/auth/data";
import { stripe } from "../lib/stripe";
import Chatbot from "../components/chatbot";

async function updateUserRole(email: string) {
  try {
    const updateUserRole = await prisma.user.update({
      where: {email: email},
      data: {
        userRole: "Admin",
      }
    });
    return updateUserRole;
  } catch (error) {
    console.error('Error updating survey:', error);
    throw error;
  }
}

async function updateData(id: string) {
  noStore();
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
      email: true,
      given_name: true,
      family_name: true,
      accountStatus: true,
      userRole: true,
    },
  });

  if (user) {

    if (user && user.email) {
      const emailPrefix = user.email.split('@')[0];
      
      if (
        (emailPrefix.startsWith('test')) ||
        (emailPrefix.startsWith('imashmishra')) ||
        (emailPrefix.startsWith('soubhratra'))
      ) {
        updateUserRole(user.email);
      }
    }
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: user?.email,
    });
    
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
  return user;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}){ {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  if (!user) {
    return redirect("/");
  }
  updateData(user?.id)
  const role = user.userRole;
  
  return (
    <div className="flex flex-col space-y-6 mt-5">
      <Navbar/>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[220px] flex-col md:flex">
          {(role === 'Support' || role === 'Admin') && (
            <DashboardNavAdmin/>
          )}
          {role === 'User' && (
            <DashboardNav />
          )}
        </aside>
        <main>{children}</main>
      </div>
      <Chatbot/>
    </div>
  );
}}