import Link from 'next/link';
import prisma from '@/app/lib/db';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createUserInAdmin } from '@/app/api/actions/users';

export default async function UserCreatePage() {

  const Subscriptions = await prisma.subscription.findMany()

  return (
    <>
      <header className="mb-4">
        <h1>Create User</h1>
      </header>
      <form action={createUserInAdmin} className="px-2 max-w-xl">
        <div>
          <Input
            type="text"
            placeholder="First name"
            name="given_name"
            className="mb-2"
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Last name"
            name="family_name"
            className="mb-2"
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Email"
            name="email"
            className="mb-2"
            required
          />
        </div>
        <div>
          <Input type="text" placeholder="Status" name="status" className="mb-2" />
        </div>

        <footer className="flex items-center justify-between mt-2">
          <Link href="/users" className="underline text-gray-500">
            Return to Users list
          </Link>

          <Button type="submit">Create</Button>
        </footer>
      </form>
    </>
  )
}
