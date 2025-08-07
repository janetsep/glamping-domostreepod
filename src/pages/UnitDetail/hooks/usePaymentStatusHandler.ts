
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
        try {
          console.log('🔍 [usePaymentStatusHandler] Procesando reserva confirmada:', reservationId);
          
          // Fetch the primary reservation first
          const { data: primaryReservation, error: primaryError } = await supabase
            .from('reservations')
            .select('*, reservation_code')
            .eq('id', reservationId)
            .single();
          
          if (primaryError) {
            console.error('❌ [usePaymentStatusHandler] Error obteniendo reserva principal:', primaryError);
            throw primaryError;
          }
          
          if (!primaryReservation?.reservation_code) {
            console.error('❌ [usePaymentStatusHandler] No se encontró código de reserva');
            throw new Error('No se encontró código de reserva');
          }

          console.log('📋 [usePaymentStatusHandler] Reserva principal:', {
            id: primaryReservation.id,
            codigo: primaryReservation.reservation_code,
            huespedes: primaryReservation.guests,
            precio: primaryReservation.total_price
          });
          
          // Get ALL reservations with the same reservation code
          const { data: allReservations, error: allError } = await supabase
            .from('reservations')
            .select('*')
            .eq('reservation_code', primaryReservation.reservation_code)
            .eq('status', 'confirmed')
            .order('unit_id');
          
          if (allError) {
            console.error('❌ [usePaymentStatusHandler] Error obteniendo todas las reservas:', allError);
            throw allError;
          }
          
          if (!allReservations || allReservations.length === 0) {
            console.error('❌ [usePaymentStatusHandler] No se encontraron reservas confirmadas');
            throw new Error('No se encontraron reservas confirmadas');
          }

          console.log('📊 [usePaymentStatusHandler] Todas las reservas encontradas:', {
            total: allReservations.length,
            reservas: allReservations.map(r => ({
              id: r.id,
              unitId: r.unit_id,
              huespedes: r.guests,
              precio: r.total_price
            }))
          });
          
          // Calculate totals from all reservations
          const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
          const totalPrice = allReservations.reduce((sum, res) => sum + res.total_price, 0);
          const requiredDomos = allReservations.length;
          
          console.log('📊 [usePaymentStatusHandler] Totales calculados:', {
            totalGuests,
            totalPrice,
            requiredDomos
          });
          
          // Set reservation details in state
          state.setIsReservationConfirmed(true);
          state.setConfirmedReservationId(reservationId);
          state.setPaymentDetails(primaryReservation.payment_details);
          
          // Set dates from primary reservation
          if (primaryReservation.check_in) {
            state.setStartDate(new Date(primaryReservation.check_in));
          }
          
          if (primaryReservation.check_out) {
            state.setEndDate(new Date(primaryReservation.check_out));
          }
          
          state.setGuests(totalGuests);
          
          // Calculate nights
          const checkInDate = new Date(primaryReservation.check_in);
          const checkOutDate = new Date(primaryReservation.check_out);
          const quoteDays = Math.round(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Create dome distribution for display
          const domoDistribution = allReservations.map((res, index) => ({
            number: index + 1,
            guests: res.guests,
            unitId: res.unit_id
          }));
          
          // Create breakdown for display showing each dome
          const breakdown = allReservations.map((res, index) => ({
            description: `Domo ${index + 1} (Unidad ${res.unit_id}): ${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}`,
            amount: res.total_price,
            guests: res.guests,
            domoNumber: index + 1
          }));
          
          // Calculate base price (excluding activities, packages, pets)
          const paymentDetailsAny = primaryReservation.payment_details as any;
          const activitiesTotal = primaryReservation.selected_activities?.length > 0 ? 
            (paymentDetailsAny?.reservation_data?.activities_total || 0) : 0;
            
          const packagesTotal = primaryReservation.selected_packages?.length > 0 ?
            (paymentDetailsAny?.reservation_data?.packages_total || 0) : 0;
            
          const totalPets = allReservations.reduce((sum, res) => sum + (res.pets || 0), 0);
          const petsPrice = totalPets * 25000; // Assuming pet price is 25000 per pet
          
          const basePrice = totalPrice - activitiesTotal - packagesTotal - petsPrice;
          
          state.setQuote({
            nights: quoteDays,
            basePrice: basePrice,
            totalPrice: totalPrice,
            requiredDomos: requiredDomos,
            domoDistribution: domoDistribution,
            breakdown: breakdown,
            pricePerNight: basePrice / quoteDays,
            activitiesTotal: activitiesTotal,
            packagesTotal: packagesTotal,
            petsPrice: petsPrice,
            pets: totalPets,
            selectedActivities: primaryReservation.selected_activities || [],
            selectedPackages: primaryReservation.selected_packages || []
          });
          
          console.log('✅ [usePaymentStatusHandler] Quote configurado con múltiples domos:', {
            nights: quoteDays,
            totalGuests,
            totalPrice,
            requiredDomos,
            domoDistribution,
            breakdown
          });
          
          toast({
            title: "Reserva confirmada",
            description: `Tu reserva ha sido confirmada exitosamente para ${requiredDomos} ${requiredDomos === 1 ? 'domo' : 'domos'} y ${totalGuests} ${totalGuests === 1 ? 'huésped' : 'huéspedes'}`,
          });
        } catch (error) {
          console.error("❌ [usePaymentStatusHandler] Error:", error);
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
