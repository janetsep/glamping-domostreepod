
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { UnitDetailState } from "../hooks/useUnitDetailState";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface PaymentSuccessHandlerProps {
  state: UnitDetailState;
}

export const PaymentSuccessHandler = ({ state }: PaymentSuccessHandlerProps) => {
  const [searchParams] = useSearchParams();

  // Handle payment success and reservation confirmation from URL
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const reservationId = searchParams.get('reservationId');
    
    if (paymentStatus === 'success' && reservationId) {
      // First check if we haven't already processed this reservation
      if (!state.isReservationConfirmed) {
        // Fetch reservation details
        const fetchReservationDetails = async () => {
          try {
            const { data: reservation, error } = await supabase
              .from('reservations')
              .select('*, payment_details')
              .eq('id', reservationId)
              .single();
            
            if (error) throw error;
            
            if (reservation) {
              // Set reservation details in state
              state.setIsReservationConfirmed(true);
              state.setConfirmedReservationId(reservationId);
              state.setPaymentDetails(reservation.payment_details);
              
              // Set dates
              if (reservation.check_in) {
                state.setStartDate(new Date(reservation.check_in));
              }
              
              if (reservation.check_out) {
                state.setEndDate(new Date(reservation.check_out));
              }
              
              state.setGuests(reservation.guests);
              
              // Create a quote object
              const quoteDays = Math.round(
                (new Date(reservation.check_out).getTime() - new Date(reservation.check_in).getTime()) / 
                (1000 * 60 * 60 * 24)
              );
              
              state.setQuote({
                nights: quoteDays,
                basePrice: reservation.total_price,
                totalPrice: reservation.total_price,
                selectedActivities: [],
                selectedPackages: []
              });
              
              toast({
                title: "Reserva confirmada",
                description: "Tu reserva ha sido confirmada exitosamente",
              });
            }
          } catch (error) {
            console.error("Error fetching reservation details:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "No se pudieron cargar los detalles de la reserva",
            });
          }
        };
        
        fetchReservationDetails();
      }
    } else if (paymentStatus === 'failed') {
      toast({
        variant: "destructive",
        title: "Pago no completado",
        description: "El pago no se completó correctamente. Por favor, intenta de nuevo.",
      });
    }
  }, [searchParams, state]);

  return null;
};
