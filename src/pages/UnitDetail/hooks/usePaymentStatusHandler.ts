
import { useCallback } from "react";
import { URLSearchParams } from "url";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const usePaymentStatusHandler = (state: any, searchParams: URLSearchParams) => {
  const processPaymentStatus = useCallback(async () => {
    const paymentStatus = searchParams.get('payment');
    const reservationId = searchParams.get('reservationId');
    
    if (paymentStatus === 'success' && reservationId) {
      // First check if we haven't already processed this reservation
      if (!state.isReservationConfirmed) {
        // Fetch all reservations with the same reservation_code
        try {
          const { data: primaryReservation, error: primaryError } = await supabase
            .from('reservations')
            .select('*, payment_details, reservation_code')
            .eq('id', reservationId)
            .single();
          
          if (primaryError) throw primaryError;
          
          if (primaryReservation && primaryReservation.reservation_code) {
            // Get all reservations with the same code
            const { data: allReservations, error: allError } = await supabase
              .from('reservations')
              .select('*')
              .eq('reservation_code', primaryReservation.reservation_code);
            
            if (allError) throw allError;
            
            if (allReservations) {
              // Calculate total values from all reservations
              const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
              const totalPrice = allReservations.reduce((sum, res) => sum + res.total_price, 0);
              const requiredDomos = allReservations.length;
              
              // Set reservation details in state
              state.setIsReservationConfirmed(true);
              state.setConfirmedReservationId(reservationId);
              state.setPaymentDetails(primaryReservation.payment_details);
              
              // Set dates
              if (primaryReservation.check_in) {
                state.setStartDate(new Date(primaryReservation.check_in));
              }
              
              if (primaryReservation.check_out) {
                state.setEndDate(new Date(primaryReservation.check_out));
              }
              
              state.setGuests(totalGuests);
              
              // Create a quote object with correct dome distribution
              const quoteDays = Math.round(
                (new Date(primaryReservation.check_out).getTime() - new Date(primaryReservation.check_in).getTime()) / 
                (1000 * 60 * 60 * 24)
              );
              
              // Calculate price per night per dome
              const pricePerNightPerDome = totalPrice / quoteDays / requiredDomos;
              
              // Create dome distribution for display
              const domoDistribution = allReservations.map((res, index) => ({
                number: index + 1,
                guests: res.guests,
                unitId: res.unit_id
              }));
              
              // Create breakdown for display
              const breakdown = allReservations.map((res, index) => ({
                description: `Domo ${index + 1}: ${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}`,
                amount: res.total_price,
                guests: res.guests,
                domoNumber: index + 1
              }));
              
              state.setQuote({
                nights: quoteDays,
                basePrice: totalPrice,
                totalPrice: totalPrice,
                requiredDomos: requiredDomos,
                domoDistribution: domoDistribution,
                breakdown: breakdown,
                pricePerNight: pricePerNightPerDome,
                selectedActivities: primaryReservation.selected_activities || [],
                selectedPackages: primaryReservation.selected_packages || []
              });
              
              console.log('🔍 [usePaymentStatusHandler] Quote con múltiples domos:', {
                totalGuests,
                totalPrice,
                requiredDomos,
                domoDistribution,
                breakdown
              });
              
              toast({
                title: "Reserva confirmada",
                description: `Tu reserva ha sido confirmada exitosamente para ${requiredDomos} domos`,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching reservation details:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar los detalles de la reserva",
          });
        }
      }
    } else if (paymentStatus === 'failed') {
      toast({
        variant: "destructive",
        title: "Pago no completado",
        description: "El pago no se completó correctamente. Por favor, intenta de nuevo.",
      });
    }
  }, [searchParams, state]);

  return { processPaymentStatus };
};
