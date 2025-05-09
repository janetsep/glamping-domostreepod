
import { useAvailabilityCheck } from './useAvailabilityCheck';
import { useExtrasManagement } from './useExtrasManagement';
import { useReservationCreation } from './useReservationCreation';
import { ReservationState } from './types';
import { toast } from 'sonner';

/**
 * Main hook that combines all reservation actions
 */
export const useReservationActions = (state: ReservationState) => {
  // Compose all sub-hooks
  const { checkDatesAvailability } = useAvailabilityCheck(state);
  const { handleActivityToggle, handlePackageToggle, getUpdatedQuoteTotal } = useExtrasManagement(state);
  const { handleReservation, handleNewQuote, handleConfirmReservation } = useReservationCreation(state);

  return {
    checkDatesAvailability,
    handleReservation,
    handleNewQuote: state.setShowQuote ? (() => {
      state.setShowQuote(false);
      state.setQuote(null);
      state.setReservationTab('dates');
    }) : undefined,
    handleConfirmReservation,
    handleActivityToggle,
    handlePackageToggle,
    getUpdatedQuoteTotal
  };
};

// Re-export the types for easier imports
export type { ReservationState } from './types';
