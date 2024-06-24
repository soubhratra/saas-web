// app/dashboard/appointment/availableUsers/UsersTable.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReservationModal from '@/components/ui/ReservationModel';

export default function UsersTable({ users }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  const handleBookClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = async (startDate, endDate, time) => {
    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser?.id,
          startDate,
          endDate,
          time,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        console.error('Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <>
      <Card className="w-full mb-10">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <Table className='mx-2 lg:mx-4 my-2 lg:mb-2 lg:my-4'>
          <TableHeader className="bg-gray-50">
            <TableRow className="bg-gray-200 ">
              <TableHead>
                <div className="flex items-center justify-start">First name</div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-start">Last name</div>          
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-start">Email</div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-start"></div>          
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {users.length > 0 ? (
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.given_name}</TableCell>
                <TableCell>{user.family_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium"
                    onClick={() => handleBookClick(user)}
                  >
                    Book
                  </Button>
                </TableCell>
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
      {selectedUser && (
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmReservation}
          userName={`${selectedUser.given_name} ${selectedUser.family_name}`}
        />
      )}
    </>
  );
}