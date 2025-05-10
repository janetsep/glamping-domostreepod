
import { useState } from 'react';
import { toast } from "sonner";

type ReservationCreationState = {
  displayUnit: any;
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos?: number;
  quote: any;
  selectedActivities: any[];
  selectedPackages: any[];
  createReservation: any;
  redirectToWebpay: any;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  availableDomos?: number;
};

export const useReservationCreation = (state: ReservationCreationState) => {
  const handleConfirmReservation = async () => {
    if (!state.displayUnit || !state.startDate || !state.endDate || !state.quote) return;

    try {
      // Verificamos si hay suficientes domos disponibles
      const requiredDomos = state.requiredDomos || 1;
      if (state.availableDomos !== undefined && requiredDomos > state.availableDomos) {
        toast.error(`Solo hay ${state.availableDomos} domos disponibles para las fechas seleccionadas. No es posible reservar ${requiredDomos} domos.`);
        return;
      }

      state.setIsProcessingPayment(true);
      
      const activityIds = state.selectedActivities.map(a => a.id);
      const packageIds = state.selectedPackages.map(p => p.id);
      
      const reservations = [];
      for (let i = 0; i < requiredDomos; i++) {
        const individualQuotePrice = state.quote.totalPrice / requiredDomos;
        
        const reservation = await state.createReservation(
          state.displayUnit.id,
          state.startDate,
          state.endDate,
          Math.ceil(state.guests / requiredDomos),
          individualQuotePrice,
          'webpay',
          i === 0 ? activityIds : [],
          i === 0 ? packageIds : []
        );
        
        if (reservation) {
          reservations.push(reservation);
        }
      }
      
      if (reservations.length > 0) {
        state.redirectToWebpay(reservations[0].id, state.quote.totalPrice);
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      toast.error("Ha ocurrido un error al procesar tu reserva. Por favor, intenta nuevamente.");
    } finally {
      state.setIsProcessingPayment(false);
    }
  };

  return {
    handleConfirmReservation
  };
};
