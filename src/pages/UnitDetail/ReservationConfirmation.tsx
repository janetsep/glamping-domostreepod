
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";

interface ReservationConfirmationProps {
  startDate?: Date;
  endDate?: Date;
  guests: number;
  quote: any;
  paymentDetails: any;
  onNewQuote: () => void;
}

export const ReservationConfirmation = forwardRef<HTMLDivElement, ReservationConfirmationProps>(
  ({ startDate, endDate, guests, quote, paymentDetails, onNewQuote }, ref) => {
    return (
      <div ref={ref} className="text-center p-8 space-y-4">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-display font-bold">¡Reserva confirmada!</h2>
        <p>
          Gracias por tu reserva en Domos TreePod. Hemos enviado los detalles a tu correo electrónico.
        </p>
        <div className="text-sm text-muted-foreground mt-4 space-y-2">
          <p>Fechas reservadas:</p>
          <p>Entrada: {startDate?.toLocaleDateString()}</p>
          <p>Salida: {endDate?.toLocaleDateString()}</p>
          <p>Huéspedes: {guests}</p>
          <p className="font-semibold mt-2">Total: ${quote?.totalPrice.toLocaleString()}</p>
          
          {paymentDetails && (
            <div className="mt-4 pt-4 border-t text-left">
              <p className="font-semibold mb-2">Detalles del pago:</p>
              <p>Método: WebPay Plus</p>
              <p>Tarjeta: {paymentDetails.card_detail?.card_number}</p>
              <p>Código de autorización: {paymentDetails.authorization_code}</p>
              <p>Estado: {paymentDetails.status}</p>
            </div>
          )}
        </div>
        <Button className="mt-6" onClick={onNewQuote}>
          Hacer nueva reserva
        </Button>
      </div>
    );
  }
);

ReservationConfirmation.displayName = "ReservationConfirmation";
