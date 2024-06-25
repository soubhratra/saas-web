import { NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { sendEmail } from '@/app/components/emails/sendEmail';
import { NewReservationEmailEmailTemplate } from './email/new-reservation-email-email';
import { ReservationConfirmEmailEmailTemplate } from './email/reservation-confirm-email-email';


async function sendReservationEmails(reservation: any) {
  console.log("in sendReservationEmails");
  
  const { user, bookedByUser } = reservation;
  const userGiven_name = user.given_name
  const userFamily_name = user.family_name
  const bookedByUserGiven_name = bookedByUser.given_name
  const bookedByUserFamily_name = bookedByUser.family_name
  const reservationTimeSlot = reservation.timeSlot
  const reservationStartDate = reservation.startDate
  const reservationEndDate = reservation.endDate

  await sendEmail({
    from: 'Veye <support@veye.co>',
    to: [user.email],
    subject: 'New Reservation',
    react: NewReservationEmailEmailTemplate({bookedByUserGiven_name, bookedByUserFamily_name, reservationTimeSlot, reservationStartDate, reservationEndDate}),
    // html: `<p>You have a new reservation from ${bookedByUser.given_name} ${bookedByUser.family_name} from ${reservation.startDate} to ${reservation.endDate} at ${reservation.timeSlot}.</p>`
  });

  
  await sendEmail({
    from: 'Veye <support@veye.co>',
    to: [bookedByUser.email],
    subject: 'Reservation Confirmation',
    react: ReservationConfirmEmailEmailTemplate({userGiven_name, userFamily_name, reservationTimeSlot, reservationStartDate, reservationEndDate}),
    // html: `<p>Your reservation with ${user.given_name} ${user.family_name} from ${reservation.startDate} to ${reservation.endDate} at ${reservation.timeSlot} has been confirmed.</p>`
  });
}

export async function POST(request: Request) {
  try {
    const { userId, bookedById, startDate, endDate, timeSlot } = await request.json();

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookedById,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timeSlot,
      },
      include: {
        user: true,
        bookedByUser: true,
      },
    });

    await sendReservationEmails(reservation);
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
