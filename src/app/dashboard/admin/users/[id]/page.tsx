import Link from 'next/link';
import prisma from '@/app/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function UserPage({ params }: { params: { id: string } }) {
  
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    return (
      <>
        <header>
          <h1>User not found</h1>
        </header>
        <footer>
          <Link href="/dashboard/admin/users">Return to Users list</Link>
        </footer>
      </>
    )
  }

  return (
    <>      
      <Card className="rounded-lg shadow lg:w-[1045px] my-2">
        <CardHeader>
          <CardTitle>User</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-gray-700 mb-4 last:mb-0">
              <strong className="text-gray-900">First name:</strong>{' '}
              {user.given_name}
            </p>
            <p className="text-gray-700 mb-4 last:mb-0">
              <strong className="text-gray-900">Last name:</strong>{' '}
              {user.family_name}
            </p>
            <p className="text-gray-700 mb-4 last:mb-0">
              <strong className="text-gray-900">Email:</strong> {user.email}
            </p>
            <p className="text-gray-700 mb-4 last:mb-0">
              <strong className="text-gray-900">User Role:</strong> {user.userRole}
            </p>
          </CardContent>
      </Card>

      <footer className='mt-2 mb-4 lg:mb-8'>
        <Button className='lg:text-lg mt-4'>
          <Link href={`/dashboard/admin/users/`}>
            Return to Users list
          </Link>
        </Button>
      </footer>
    </>
  )
}