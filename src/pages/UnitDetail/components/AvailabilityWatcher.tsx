
import { useEffect } from "react";
import { UnitDetailState } from "../hooks/useUnitDetailState";

interface AvailabilityWatcherProps {
  state: UnitDetailState;
  checkDatesAvailability: () => void;
}

export const AvailabilityWatcher = ({ 
  state, 
  checkDatesAvailability 
}: AvailabilityWatcherProps) => {
  // Check availability automatically when dates are selected
  useEffect(() => {
    if (state.startDate && state.endDate) {
      checkDatesAvailability();
    }
  }, [state.startDate, state.endDate, state.displayUnit, checkDatesAvailability]);

  // Reset verification state when dates change
  useEffect(() => {
    if (state.startDate || state.endDate) {
      state.setCheckedAvailability(false);
      state.setShowQuote(false);
      state.setQuote(null);
    }
  }, [state.startDate, state.endDate, state]);

  return null;
};
