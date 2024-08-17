import prisma from '@/app/lib/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UsersListPage() {
  const users = await prisma.user.findMany();

  return (
    <>
      <header className="flex justify-between">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4">Admin</h2>
        {/* <Link href="/dashboard/admin/users/create">
          <Button className="font-medium">
            New User
          </Button>
        </Link> */}
      </header>
      <form className="px-2 mb-4">
        <Card className="w-full mb-10">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <Table className='mx-2 lg:mx-4 my-2 lg:mb-2 lg:my-4'>
            <TableHeader className="bg-gray-50">
              <TableRow className="bg-gray-200 ">
                <TableHead >
                  <div className="flex items-center justify-start">First name</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-start">Last name</div>          
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-start">Email</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-start">User Role</div>          
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-start"></div>          
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.given_name}</TableCell>
                  <TableCell>{user.family_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.userRole}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/admin/users/${user.id}/`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-medium"
                      >
                        Show
                      </Button>
                    </Link>
                  </TableCell>
                  {/* <TableCell> */}
                    {/* <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-medium"
                      >
                        Edit
                      </Button>
                    </Link> */}
                    {/* <form action={deleteUser} className="inline-block">
                      <input type="hidden" name="id" value={user.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="font-medium text-red-600 hover:bg-red-100 disabled:bg-red-100"
                      >
                        Delete
                      </Button>
                    </form> */}
                  {/* </TableCell> */}
                </TableRow>
                ))
              ) : (
                <TableRow >
                  <TableCell colSpan={4} className="text-center py-4">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </form>
    </>
  )
}
