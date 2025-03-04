
import React, { forwardRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientInformationForm } from "./ClientInformationForm";
import { ReservationDetails } from "@/components/unit-detail/ReservationDetails";
import { ReservationHeader } from "@/components/unit-detail/ReservationHeader";
import { ReservationSuccess } from "@/components/unit-detail/ReservationSuccess";
import { useMutateReservationStatus, ClientInformation } from "@/hooks/reservations/useReservationUpdate";

interface ReservationConfirmationProps {
  startDate?: Date;
  endDate?: Date;
  guests?: number;
  quote: any;
  paymentDetails: any;
  onNewQuote: () => void;
  reservationId?: string | null;
}

export const ReservationConfirmation = forwardRef<HTMLDivElement, ReservationConfirmationProps>(
  ({ startDate, endDate, guests, quote, paymentDetails, onNewQuote, reservationId }, ref) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);
    const { saveClientInformation } = useMutateReservationStatus();

    const handleClientInfoSubmit = async (clientInfo: ClientInformation) => {
      if (!reservationId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró el ID de la reserva",
        });
        return;
      }

      setIsSubmitting(true);
      
      try {
        const success = await saveClientInformation(reservationId, clientInfo);
        
        if (success) {
          setClientInfoSubmitted(true);
          toast({
            title: "Información guardada",
            description: "¡Gracias! Hemos registrado tu información y te enviamos un correo con los detalles de tu reserva.",
          });
        } else {
          throw new Error("Error saving client information");
        }
      } catch (error) {
        console.error('Error guardando información del cliente:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar la información del cliente. Por favor, inténtalo de nuevo.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div ref={ref} className="space-y-6">
        <ReservationHeader />

        <ReservationDetails
          startDate={startDate}
          endDate={endDate}
          guests={guests}
          quote={quote}
          paymentDetails={paymentDetails}
        />

        {!clientInfoSubmitted ? (
          <ClientInformationForm 
            onSubmit={handleClientInfoSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ReservationSuccess onNewQuote={onNewQuote} />
        )}
      </div>
    );
  }
);

ReservationConfirmation.displayName = "ReservationConfirmation";
