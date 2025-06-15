
import React from 'react';
import { formatReservationId } from '@/lib/utils';

interface ReservationCodeDisplayProps {
  reservationId: string;
  reservationCode?: string;
}

export const ReservationCodeDisplay: React.FC<ReservationCodeDisplayProps> = ({
  reservationId,
  reservationCode
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-md mb-4 text-center">
      <p className="text-blue-700 font-medium mb-1">Tu código de reserva es:</p>
      <p className="text-2xl font-bold text-blue-800">
        {reservationCode || formatReservationId(reservationId)}
      </p>
      <p className="text-sm text-blue-600 mt-1">Guarda este código para futuras consultas</p>
    </div>
  );
};
