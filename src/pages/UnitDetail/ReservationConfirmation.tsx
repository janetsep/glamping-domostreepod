import React from "react";

interface ReservationConfirmationProps {
  reservationId: string;
}

export const ReservationConfirmation = ({
  reservationId
}: ReservationConfirmationProps) => {
  return (
    <div>
      <h2>¡Reserva confirmada!</h2>
      <p>Su número de reserva es: {reservationId}</p>
    </div>
  );
};
