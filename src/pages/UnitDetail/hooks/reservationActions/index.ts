
import { ReservationState } from "../types";
import { useExtrasManagement } from "./useExtrasManagement";
import { useAvailabilityCheck } from "./useAvailabilityCheck";

// Simplified version to fix compatibility issues
export const useReservationActions = (state: ReservationState) => {
  const handleActivityToggle = (activity: any) => {
    // Simple implementation
    console.log("Activity toggled:", activity);
  };

  const handlePackageToggle = (packageItem: any) => {
    // Simple implementation
    console.log("Package toggled:", packageItem);
  };

  const checkDatesAvailability = async () => {
    // Simple implementation
    if (state.startDate && state.endDate) {
      const result = await state.checkAvailability(state.guests, state.startDate, state.endDate);
      state.setIsAvailable(result.isAvailable);
      state.setCheckedAvailability(true);
      return result;
    }
    return { isAvailable: false, availableDomes: 0, requiredDomos: 1 };
  };

  const handleReservation = async () => {
    if (!state.startDate || !state.endDate) {
      return;
    }
    await checkDatesAvailability();
  };

  const handleNewQuote = () => {
    state.setShowQuote(true);
  };

  const handleConfirmReservation = () => {
    state.setIsReservationConfirmed(true);
  };

  const getUpdatedQuoteTotal = () => {
    return state.activitiesTotal + state.packagesTotal;
  };

  return {
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    getUpdatedQuoteTotal
  };
};
