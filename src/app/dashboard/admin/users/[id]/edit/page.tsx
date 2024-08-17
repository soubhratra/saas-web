import Link from 'next/link';
import prisma from '@/app/lib/db';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { editUser } from '@/app/api/actions/users';

export default async function UserEditPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      Subscription: true,
    },
  })

  const Subscriptions = await prisma.subscription.findMany()

  if (!user) {
    return (
      <>
        <header>
          <h1>User not found</h1>
        </header>
        <footer>
          <Link href="/users">Return to Users list</Link>
        </footer>
      </>
    )
  }

  return (
    <>
      <header className="mb-4">
        <h1 className='text-lg'>Edit User</h1>
      </header>
      <form action={editUser} className="px-2 max-w-xl">
        <h2 className='mb-2'>First name</h2>
        <div className='mb-2'>
          <Input
            type="text"
            placeholder="Given_name"
            name="given_name"
            className="mb-4"
            defaultValue={"" + user.given_name}
          />
        </div>
        <h2 className='mb-2'>Last name</h2>
        <div className='mb-2'>
          <Input
            type="text"
            placeholder="Family_name"
            name="family_name"
            className="mb-4"
            defaultValue={"" + user.family_name}
          />
        </div>
        <h2 className='mb-2'>Email</h2>
        <div className='mb-2'>
          <Input
            type="text"
            placeholder="Email"
            name="email"
            className="mb-4"
            defaultValue={"" + user.email}
            required
          />
        </div>
        <h2 className='mb-2'>Status</h2>
        <div className='mb-2'>
          <Input
            type="text"
            placeholder="Status"
            name="status"
            className="mb-4"
            defaultValue={"" + user.accountStatus}
          />
        </div>

        <input type="hidden" name="id" value={user.id} />

        <footer className="flex items-center justify-between mt-2">
          <Link href="/dashboard/admin/users" className="underline text-gray-500">
            Return to Users list
          </Link>

          <Button type="submit">Update</Button>
        </footer>
      </form>
    </>
  )
}
