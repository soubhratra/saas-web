// import prisma from '@/app/lib/db';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { Card, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// export default async function UsersListPage() {
//   const users = await prisma.user.findMany();

//   return (
//     <>
//       <header className="flex justify-between">
//         <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4">Book Meeting</h2>
//       </header>
//       <form className="px-2 mb-4">
//         <Card className="w-full mb-10">
//           <CardHeader>
//             <CardTitle>All Users</CardTitle>
//           </CardHeader>
//           <Table className='mx-2 lg:mx-4 my-2 lg:mb-2 lg:my-4'>
//             <TableHeader className="bg-gray-50">
//               <TableRow className="bg-gray-200 ">
//                 <TableHead >
//                   <div className="flex items-center justify-start">First name</div>
//                 </TableHead>
//                 <TableHead>
//                   <div className="flex items-center justify-start">Last name</div>          
//                 </TableHead>
//                 <TableHead>
//                   <div className="flex items-center justify-start">Email</div>
//                 </TableHead>
//                 <TableHead>
//                   <div className="flex items-center justify-start"></div>          
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell>{user.given_name}</TableCell>
//                   <TableCell>{user.family_name}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>
//                     <Link href={`/dashboard/appointment/availableUsers/${user.id}/`}>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="font-medium"
//                       >
//                         Book
//                       </Button>
//                     </Link>
//                   </TableCell>
//                 </TableRow>
//                 ))
//               ) : (
//                 <TableRow >
//                   <TableCell colSpan={4} className="text-center py-4">No users found</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </Card>
//       </form>
//     </>
//   )
// }

import getUsersWithListings from '@/app/lib/data';
import UsersTable from './UsersTable';

export default async function UsersListPage() {
  const users = await getUsersWithListings();

  return (
    <>
      <header className="flex justify-between">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4">Book Meeting</h2>
      </header>
      <UsersTable users={users} />
    </>
  );
}