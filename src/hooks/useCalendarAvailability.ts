
import { useState } from "react";
import { useReservationsFetcher } from "./calendar/useReservationsFetcher";
import { useAvailabilityCalculator } from "./calendar/useAvailabilityCalculator";
import { useDateAvailabilityChecker } from "./calendar/useDateAvailabilityChecker";

export const useCalendarAvailability = (unitId: string, currentMonth: Date, selectedDate: Date | null) => {
  // Fetch reservations for the current month
  const { reservations, isLoading: isLoadingReservations } = useReservationsFetcher(currentMonth);
  
  // Calculate availability for the calendar view
  const { calendarDays, isCalculating } = useAvailabilityCalculator(currentMonth, selectedDate, reservations);
  
  // Create date checker functions
  const { isDateAvailable, isDateRangeAvailable } = useDateAvailabilityChecker(reservations);

  // Combine loading states
  const isLoading = isLoadingReservations || isCalculating;

  return { 
    calendarDays, 
    isLoading,
    isDateAvailable,
    isDateRangeAvailable
  };
};
