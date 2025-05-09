
import { useEffect } from "react";
import { useUnitDetailState } from "./useUnitDetailState";
import { useReservationActions } from "./useReservationActions";
import { usePaymentStatusHandler } from "./usePaymentStatusHandler";

// Define the expected state shape
export interface ReservationState {
  // Basic properties
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos?: number;
  displayUnit?: any;
  
  // State setters
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setGuests: (guests: number) => void;
  setRequiredDomos: (domos: number) => void;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  setIsAvailable: (available: boolean) => void;
  setReservationTab: (tab: string) => void;
  
  // Additional state for management
  isCheckedAvailability: boolean;
  setCheckedAvailability: (checked: boolean) => void;
  setIsPartialAvailability: (partial: boolean) => void;
  setActivitiesTotal: (total: number) => void;
  setPackagesTotal: (total: number) => void;
  
  // All other state properties included in useUnitDetailState
  [key: string]: any;
}

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
      actions.checkDatesAvailability();
    }
  }, [state.startDate, state.endDate, state.displayUnit, actions]);

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
