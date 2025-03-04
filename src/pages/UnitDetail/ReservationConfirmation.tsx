
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
        console.log(`Asociando cliente a la reserva ${reservationId}:`, clientInfo);
        const success = await saveClientInformation(reservationId, clientInfo);
        
        if (success) {
          setClientInfoSubmitted(true);
          toast({
            title: "Información guardada",
            description: "¡Gracias! Hemos registrado tus datos y los hemos asociado a tu reserva. Te hemos enviado un correo con los detalles.",
          });
        } else {
          throw new Error("Error al guardar información del cliente");
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
          <>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm">
                Para completar tu reserva y establecer la relación cliente-reserva, 
                necesitamos que nos proporciones tus datos de contacto.
                Esta información quedará asociada directamente con tu reserva.
              </p>
            </div>
            <ClientInformationForm 
              onSubmit={handleClientInfoSubmit}
              isSubmitting={isSubmitting}
            />
          </>
        ) : (
          <ReservationSuccess onNewQuote={onNewQuote} />
        )}
      </div>
    );
  }
);

ReservationConfirmation.displayName = "ReservationConfirmation";
