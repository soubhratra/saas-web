import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/db';
import { sendEmail } from '@/app/components/emails/sendEmail';
import { auth } from "@/auth";
import { getUserByEmail } from '../auth/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  const email: string = session?.user?.email!;
  const user = await getUserByEmail(email);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { userId, startDate, endDate, time } = req.body;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookedById: user?.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        time,
      },
      include: {
        user: true,
        bookedBy: true,
      },
    });

    // Send confirmation emails
    // await sendEmail({
    //   to: reservation.user.email,
    //   subject: 'Reservation Confirmed',
    //   text: 'Your reservation with `${reservation.bookedBy.given_name} ${reservation.bookedBy.family_name}` has been confirmed for ${startDate} to ${endDate} at ${time}.,'
    // });

    // await sendEmail({
    //   to: reservation.bookedBy.email,
    //   subject: 'Reservation Confirmed',
    //   text: 'Your reservation with `${reservation.user.given_name} ${reservation.user.family_name}` has been confirmed for ${startDate} to ${endDate} at ${time}.,'
    // });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
}
