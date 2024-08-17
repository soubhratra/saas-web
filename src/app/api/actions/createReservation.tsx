'use server'

import { auth } from '@/auth'
import prisma from '../../lib/db'
import { getUserByEmail } from "@/app/api/auth/data";

type ReservationResult = 
  | { reservation: { id: string; startDate: Date; endDate: Date; timeSlot: string; createdAt: Date; updatedAt: Date; userId: string; bookedById: string; } }
  | { error: string };

export async function createReservation(formData: FormData): Promise<ReservationResult> {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);

  if (!user || !user.id) {
    return { error: "User not found or not authenticated" };
  }

  const userId = formData.get('userId') as string
  const startDate = new Date(formData.get('startDate') as string)
  const endDate = new Date(formData.get('endDate') as string)
  const timeSlot = formData.get('timeSlot') as string

  const existingBooking = await prisma.reservation.findFirst({
    where: {
      userId: userId,
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate }
        },
        {
          startDate: { gte: startDate, lte: endDate }
        },
        {
          endDate: { gte: startDate, lte: endDate }
        }
      ]
    }
  })
  if (existingBooking) {
    return { error: 'This time slot is already booked' };
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookedById: user.id, 
        startDate,
        endDate,
        timeSlot,
      },
    })

    return { reservation };
  } catch (error) {
    console.error('Error creating reservation:', error)
    return { error: "An error occurred while creating the reservation" };
  }
}