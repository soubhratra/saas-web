'use client';
import ReservationModal from '@/components/ui/reservationModel';
import {Loader } from "lucide-react"
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
interface User {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  userRole: string;
  accountStatus: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Error fetching users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleBook = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) return <div className='flex items-center justify-center h-screen '><Loader className="animate-spin"/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Table>
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.given_name} {user.family_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.userRole}</TableCell>
              <TableCell>{user.accountStatus}</TableCell>
              <TableCell>
                <Button 
                  onClick={() => handleBook(user)}
                  variant="outline">
                  Book
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    {selectedUser && (
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    )}
  </>
  );
}