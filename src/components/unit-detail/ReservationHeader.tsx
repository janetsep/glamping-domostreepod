
import React from "react";

export const ReservationHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-display font-bold text-primary mb-2">
        ¡Reserva Confirmada!
      </h2>
      <p className="text-lg mb-4">
        Tu pago ha sido procesado con éxito
      </p>
    </div>
  );
};
