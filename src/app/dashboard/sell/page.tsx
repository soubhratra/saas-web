import { Card } from "@/components/ui/card";
import { SellForm } from "@/app/components/Sellform";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserByEmail } from "@/app/api/auth/data";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeConnectedLinked: true,
    },
  });

  if (data?.stripeConnectedLinked === false) {
    return redirect("/dashboard/sell/billing");
  }

  return null;
}

export default async function SellRoute() {
  noStore();
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Unauthorized");
  }
  const data = await getData(user.id);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <Card>
        <SellForm />
      </Card>
    </section>
  );
}