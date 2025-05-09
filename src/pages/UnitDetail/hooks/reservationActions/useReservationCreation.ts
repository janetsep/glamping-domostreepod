
import { useCallback } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { ReservationState } from './types';

/**
 * Hook for reservation creation and confirmation
 */
export const useReservationCreation = (state: ReservationState) => {
  const { toast: uiToast } = useToast();

  const handleReservation = useCallback(async () => {
    if (!state.displayUnit?.id || !state.startDate || !state.endDate || !state.guests) {
      console.warn("Missing unit ID, start date, end date, or number of guests");
      return;
    }

    try {
      const startDateFormatted = format(state.startDate, 'yyyy-MM-dd');
      const endDateFormatted = format(state.endDate, 'yyyy-MM-dd');

      // Calcular la cotización localmente para no depender de una API
      const nights = Math.round((state.endDate.getTime() - state.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const basePrice = state.displayUnit.prices?.base_price || 100000;
      const weekendPrice = state.displayUnit.prices?.weekend_price || basePrice;
      const holidayPrice = state.displayUnit.prices?.holiday_price || basePrice;
      
      // Usamos un precio base simple para la demostración
      const totalPrice = basePrice * nights;
      
      // Creamos una cotización simple
      const quote = {
        nights,
        pricePerNight: basePrice,
        totalPrice,
        basePrice,
        breakdown: [
          {
            description: `${nights} noches x $${basePrice.toLocaleString()}`,
            amount: totalPrice,
            guests: state.guests,
            domoNumber: state.requiredDomos || 1
          }
        ],
        rateDescription: "Tarifa estándar",
        requiredDomos: state.requiredDomos || 1,
        domoDistribution: [
          {
            domoNumber: 1,
            guests: state.guests
          }
        ],
        season: "medium" as "high" | "low" | "medium"
      };

      // Set the quote in the state
      state.setQuote(quote);
      state.setShowQuote(true);
      state.setReservationTab('summary');
    } catch (error) {
      console.error("Error getting quote:", error);
      uiToast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al obtener la cotización. Por favor, inténtalo de nuevo.",
      });
    }
  }, [state, uiToast]);

  const handleNewQuote = useCallback(() => {
    state.setShowQuote(false);
    state.setQuote(null);
    state.setReservationTab('dates');
  }, [state]);

  const handleConfirmReservation = useCallback(() => {
    // Simulamos una confirmación exitosa
    toast.success("¡Reserva confirmada! Te redirigiremos al pago.", {
      duration: 3000
    });
    setTimeout(() => {
      state.setIsReservationConfirmed(true);
      state.setConfirmedReservationId("demo-reservation");
      state.setPaymentDetails({
        status: "success",
        amount: state.quote?.totalPrice || 0
      });
    }, 2000);
  }, [state]);

  return {
    handleReservation,
    handleNewQuote,
    handleConfirmReservation
  };
};
