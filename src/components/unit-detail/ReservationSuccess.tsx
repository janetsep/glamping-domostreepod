
import React from "react";
import { Button } from "@/components/ui/button";

interface ReservationSuccessProps {
  onNewQuote: () => void;
}

export const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ onNewQuote }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-green-600 mb-4">
        ¡Gracias por completar tu información! Hemos enviado los detalles de tu reserva a tu correo electrónico.
      </p>
      <Button onClick={onNewQuote} variant="outline">
        Realizar otra reserva
      </Button>
    </div>
  );
};
