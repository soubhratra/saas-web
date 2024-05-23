import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/app/lib/db";
import { SubmitButton } from "@/app/components/Submitbuttons";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { getUserByEmail } from "@/app/api/auth/data";

export default async function SettingPage() {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);

  async function postData(formData: FormData) {
    "use server";

    const givenName = formData.get("firstName") as string;
    const familyName = formData.get("lastName") as string;

    noStore();

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        given_name: givenName ?? undefined,
        family_name: familyName ?? undefined,
      },
    });

    revalidatePath("/", "layout");
  }

  return (
    <div className="grid items-start gap-8 mb-4 md:mb-6 lg:mb-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-0.5">
          <h1 className="text-3xl font-semibold md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile settings</p>
        </div>
      </div>

      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  defaultValue={user?.given_name ?? undefined}
                />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  defaultValue={user?.family_name ?? undefined}
                />
              </div>
              <div className="space-y-1">
                <Label>Your Email</Label>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  disabled
                  defaultValue={user?.email as string}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
