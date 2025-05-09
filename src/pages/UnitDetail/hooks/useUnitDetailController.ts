
import { useEffect } from "react";
import { useUnitDetailState } from "./useUnitDetailState";
import { useReservationActions, ReservationState } from "./useReservationActions";
import { usePaymentStatusHandler } from "./usePaymentStatusHandler";

export const useUnitDetailController = (
  unitId: string | undefined,
  searchParams: URLSearchParams
) => {
  // Use our custom hooks
  const state = useUnitDetailState(unitId) as ReservationState;
  const actions = useReservationActions(state);
  
  // Handle payment success and reservation confirmation from URL
  const { processPaymentStatus } = usePaymentStatusHandler(state, searchParams);

  // Process payment status when component loads
  useEffect(() => {
    processPaymentStatus();
  }, [processPaymentStatus]);

  // Check availability automatically when dates are selected
  useEffect(() => {
    if (state.startDate && state.endDate) {
      // Solo verificamos la disponibilidad después de que el usuario haya interactuado lo suficiente
      // como para haber seleccionado ambas fechas
      actions.checkDatesAvailability();
    }
  }, [state.startDate, state.endDate, state.displayUnit, state.guests, state.requiredDomos, actions]);

  // Reset verification state when dates change
  useEffect(() => {
    if (state.startDate || state.endDate) {
      state.setCheckedAvailability(false);
      state.setShowQuote(false);
      state.setQuote(null);
    }
  }, [state.startDate, state.endDate, state.setCheckedAvailability, state.setShowQuote, state.setQuote]);

  return {
    state,
    actions
  };
};
