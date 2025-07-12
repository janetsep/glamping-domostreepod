
import React, { forwardRef, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientInformationForm } from "./ClientInformationForm";
import { ReservationDetails } from "@/components/unit-detail/ReservationDetails";
import { ReservationHeader } from "@/components/unit-detail/ReservationHeader";
import { ReservationSuccess } from "@/components/unit-detail/ReservationSuccess";
import { useMutateReservationStatus, ClientInformation } from "@/hooks/reservations/useReservationUpdate";
import { supabase } from "@/lib/supabase";
import { formatReservationId } from "@/lib/utils";

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
    const [reservationCode, setReservationCode] = useState<string | null>(null);
    // Inicializar estado vacío sin usar localStorage para evitar conflictos
    const [clientInfo, setClientInfo] = useState<ClientInformation>({
      name: '',
      email: '',
      phone: ''
    });
    const { saveClientInformation } = useMutateReservationStatus();

    // Verificar si ya existe información del cliente para esta reserva específica
    useEffect(() => {
      const checkExistingClientInfo = async () => {
        if (reservationId) {
          try {
            const { data } = await supabase
              .from('reservations')
              .select('client_name, client_email, client_phone, reservation_code')
              .eq('id', reservationId)
              .single();
              
            if (data) {
              // Solo usar datos de la base de datos para esta reserva específica
              const updatedInfo = {
                name: data.client_name || '',
                email: data.client_email || '',
                phone: data.client_phone || ''
              };
              
              setClientInfo(updatedInfo);
              
              // Set reservation code if available
              if (data.reservation_code) {
                setReservationCode(data.reservation_code);
              }
              
              // If we have complete client info, mark as submitted
              if (data.client_name && data.client_email && data.client_phone) {
                console.log('Ya existe información completa del cliente para esta reserva:', data);
                setClientInfoSubmitted(true);
              } else {
                // Si no hay información completa, usar localStorage como fallback solo una vez
                const fallbackInfo = {
                  name: data.client_name || localStorage.getItem('client_name') || '',
                  email: data.client_email || localStorage.getItem('client_email') || '',
                  phone: data.client_phone || localStorage.getItem('client_phone') || ''
                };
                setClientInfo(fallbackInfo);
              }
            } else {
              // Si no hay datos en la base de datos, usar localStorage
              const fallbackInfo = {
                name: localStorage.getItem('client_name') || '',
                email: localStorage.getItem('client_email') || '',
                phone: localStorage.getItem('client_phone') || ''
              };
              setClientInfo(fallbackInfo);
            }
          } catch (error) {
            console.error('Error al verificar información del cliente:', error);
            // En caso de error, usar localStorage como fallback
            const fallbackInfo = {
              name: localStorage.getItem('client_name') || '',
              email: localStorage.getItem('client_email') || '',
              phone: localStorage.getItem('client_phone') || ''
            };
            setClientInfo(fallbackInfo);
          }
        }
      };
      
      checkExistingClientInfo();
    }, [reservationId]);

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
        
        // Store client info in localStorage for future payment process
        localStorage.setItem('client_name', clientInfo.name);
        localStorage.setItem('client_email', clientInfo.email);
        localStorage.setItem('client_phone', clientInfo.phone);
        
        // Guardar la información del cliente en la reserva
        const success = await saveClientInformation(reservationId, clientInfo);
        
        if (success) {
          setClientInfoSubmitted(true);
          toast({
            title: "Información guardada",
            description: "¡Gracias! Hemos registrado tus datos y los hemos asociado a tu reserva. Te hemos enviado un correo con los detalles.",
          });
          
          // Verificar que la información se haya guardado correctamente
          const { data } = await supabase
            .from('reservations')
            .select('client_name, client_email, client_phone, reservation_code')
            .eq('id', reservationId)
            .single();
            
          console.log('Información del cliente guardada en base de datos:', data);
          
          // Actualizar el código de reservación si está disponible
          if (data?.reservation_code) {
            setReservationCode(data.reservation_code);
          }
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

        {reservationId && (
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-center">
            <p className="text-blue-700 font-medium mb-1">Tu código de reserva es:</p>
            <p className="text-2xl font-bold text-blue-800">{reservationCode || formatReservationId(reservationId)}</p>
            <p className="text-sm text-blue-600 mt-1">Guarda este código para futuras consultas</p>
          </div>
        )}

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
                {paymentDetails ? 
                  "Tu pago ha sido procesado correctamente. Para completar tu reserva, confirma tus datos de contacto." :
                  "Para completar tu reserva, necesitamos tus datos de contacto."}
                Esta información quedará directamente asociada con tu reserva 
                para que podamos contactarte y enviarte las confirmaciones necesarias.
              </p>
            </div>
            <ClientInformationForm 
              onSubmit={handleClientInfoSubmit}
              isSubmitting={isSubmitting}
              initialValues={clientInfo}
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
