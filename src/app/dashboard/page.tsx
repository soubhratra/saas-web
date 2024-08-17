import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getUserByEmail } from "../api/auth/data";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  const name = user?.given_name + " " + user?.family_name;

  return (
    <div className="grid items-start gap-y-4">
      <div className="flex flex-col gap-y-4">
        <Card className="shadow-lg">
          <CardContent>
          <CardTitle className="mt-5">Hi, {name}</CardTitle> 
            <CardDescription className="mt-1">
              Welcome back
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-lg mb-10">
          <CardContent>
            <CardTitle className="mt-5 mb-3">Have a Question or Comment?</CardTitle>
            <p className="item-start text-lg">Please send your question on our <a href="mailto:" className='underline'>email</a>.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
