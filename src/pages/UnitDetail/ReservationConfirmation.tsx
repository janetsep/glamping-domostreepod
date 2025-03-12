
import React, { forwardRef } from "react";

interface ReservationConfirmationProps {
  reservationId: string;
  startDate?: Date;
  endDate?: Date;
  guests?: number;
  quote?: any;
  paymentDetails?: any;
  onNewQuote?: () => void;
}

export const ReservationConfirmation = forwardRef<HTMLDivElement, ReservationConfirmationProps>(
  ({ reservationId, startDate, endDate, guests, quote, paymentDetails, onNewQuote }, ref) => {
    return (
      <div ref={ref}>
        <h2>¡Reserva confirmada!</h2>
        <p>Su número de reserva es: {reservationId}</p>
        
        {startDate && endDate && (
          <p>
            Fechas: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </p>
        )}
        
        {guests && <p>Huéspedes: {guests}</p>}
        
        {quote && (
          <div>
            <p>Total pagado: ${quote.totalPrice.toLocaleString()}</p>
          </div>
        )}
        
        {onNewQuote && (
          <button 
            onClick={onNewQuote}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Hacer otra reserva
          </button>
        )}
      </div>
    );
  }
);

// Add a display name to the component
ReservationConfirmation.displayName = "ReservationConfirmation";
