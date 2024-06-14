import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/app/lib/db";
import { CreateStripeAccoutnLink, GetStripeDashboardLink } from "@/app/api/auth/actions";
import { SubmitSellFormbutton } from "@/app/components/Submitbuttons";
import { unstable_noStore as noStore } from "next/cache";
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

  return data;
}

export default async function BillingRoute() {
  noStore();
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);


  if (!user) {
    throw new Error("Unauthorized");
  }
  const data = await getData(user.id);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Find all your details regarding your payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.stripeConnectedLinked === false && (
            <form action={CreateStripeAccoutnLink}>
            <SubmitSellFormbutton title="Link your Accout to stripe" />
            </form>
          )}

          {data?.stripeConnectedLinked === true && (
            <form action={GetStripeDashboardLink}>
              <SubmitSellFormbutton title="View Dashboard" />
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}