
import { useCallback, useEffect, useState } from "react";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker";
import { toast } from "@/components/ui/use-toast";

interface UseDateSelectionProps {
  unitId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const useDateSelection = ({
  unitId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: UseDateSelectionProps) => {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [endDateCalendarMonth, setEndDateCalendarMonth] = useState<Date>(new Date());

  // Update the end date calendar month whenever the start date changes
  useEffect(() => {
    if (startDate) {
      setEndDateCalendarMonth(startDate);
    }
  }, [startDate]);

  // Debug open state
  useEffect(() => {
    console.log("Calendar open states - startOpen:", startCalendarOpen, "endOpen:", endCalendarOpen);
  }, [startCalendarOpen, endCalendarOpen]);

  // Check availability for a specific date
  const checkDateAvailability = useCallback(async (date: Date): Promise<boolean> => {
    try {
      console.log("Checking availability for date:", date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Simplify this check for now - assume all dates are available for testing
      // We'll implement the real check once the basic functionality works
      const result = await checkGeneralAvailability(date, dayEnd)
        .catch((err) => {
          console.error("Error checking availability:", err);
          return { isAvailable: true, availableUnits: 4, totalUnits: 4 };
        });
      
      console.log("Availability result:", result);
      return true; // For now, always return true to debug selection issues
    } catch (error) {
      console.error("Error checking date availability:", error);
      return true; // For debugging purposes
    }
  }, []);

  // Handle start date selection
  const handleStartDateSelect = useCallback(async (date: Date | undefined) => {
    console.log("Start date selected:", date);
    if (date) {
      // For debugging, assume all dates are available
      onStartDateChange(date);
      
      // If the end date is before the new start date, reset it
      if (endDate && endDate <= date) {
        onEndDateChange(undefined);
      }
      
      // Update the end date calendar month to match the start date month
      setEndDateCalendarMonth(date);
      
      // Automatically open end date calendar if end date is not selected
      if (!endDate) {
        setTimeout(() => {
          setStartCalendarOpen(false);
          setTimeout(() => setEndCalendarOpen(true), 100);
        }, 300);
      } else {
        setTimeout(() => setStartCalendarOpen(false), 300);
      }
    } else {
      onStartDateChange(undefined);
    }
  }, [endDate, onEndDateChange, onStartDateChange]);

  // Handle end date selection
  const handleEndDateSelect = useCallback(async (date: Date | undefined) => {
    console.log("End date selected:", date);
    if (date && startDate) {
      // For debugging, assume all dates in the range are available
      onEndDateChange(date);
      setTimeout(() => setEndCalendarOpen(false), 300);
    } else {
      onEndDateChange(undefined);
    }
  }, [onEndDateChange, startDate]);

  return {
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    endDateCalendarMonth,
    handleStartDateSelect,
    handleEndDateSelect
  };
};
