import * as React from 'react';

interface ReservationConfirmEmailEmailTemplateProps{
    userGiven_name: string, 
    userFamily_name: string, 
    reservationTimeSlot: string, 
    reservationStartDate: string, 
    reservationEndDate: string,
}

export const ReservationConfirmEmailEmailTemplate: React.FC<Readonly<ReservationConfirmEmailEmailTemplateProps>> = ({userGiven_name, userFamily_name, reservationTimeSlot, reservationStartDate, reservationEndDate}) => (
    <div>
        <h2>Meeting Booked</h2>
        <p>
            Your reservation with ${userGiven_name} ${userFamily_name} from ${reservationStartDate} to ${reservationEndDate} at ${reservationTimeSlot} has been confirmed.
        </p>
    </div>
);