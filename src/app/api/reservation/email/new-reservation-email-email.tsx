import * as React from 'react';

interface NewReservationEmailEmailTemplateProps{
    bookedByUserGiven_name: string, 
    bookedByUserFamily_name: string, 
    reservationTimeSlot: string, 
    reservationStartDate: string, 
    reservationEndDate: string,
}

export const NewReservationEmailEmailTemplate: React.FC<Readonly<NewReservationEmailEmailTemplateProps>> = ({bookedByUserGiven_name, bookedByUserFamily_name, reservationTimeSlot, reservationStartDate, reservationEndDate}) => (
    <div>
        <h2>Meeting Booked</h2>
        <p>
          You have a new reservation from <b>${bookedByUserGiven_name}</b> <b>${bookedByUserFamily_name}</b> from <b>${reservationStartDate}</b> to <b>${reservationEndDate}</b> at <b>${reservationTimeSlot}</b>.
        </p>
    </div>
);