
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

  // Check availability for a specific date
  const checkDateAvailability = useCallback(async (date: Date): Promise<boolean> => {
    try {
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const result = await checkGeneralAvailability(date, dayEnd)
        .catch(() => ({ isAvailable: false, availableUnits: 0, totalUnits: 4 }));
      
      return result.isAvailable;
    } catch (error) {
      console.error("Error checking date availability:", error);
      return false;
    }
  }, []);

  // Handle start date selection
  const handleStartDateSelect = useCallback(async (date: Date | undefined) => {
    console.log("Start date selected:", date);
    if (date) {
      const isAvailable = await checkDateAvailability(date);
      if (isAvailable) {
        onStartDateChange(date);
        
        // If the end date is before the new start date, reset it
        if (endDate && endDate <= date) {
          onEndDateChange(undefined);
        }
        
        // Update the end date calendar month to match the start date month
        setEndDateCalendarMonth(date);
        
        // Let DatePickerPopover handle the closing
        if (!endDate) {
          setTimeout(() => setEndCalendarOpen(true), 300);
        }
      } else {
        // Date not available, show message
        toast({
          title: "Fecha no disponible",
          description: "No hay domos disponibles para esta fecha.",
          variant: "destructive"
        });
      }
    } else {
      onStartDateChange(undefined);
    }
  }, [checkDateAvailability, endDate, onEndDateChange, onStartDateChange]);

  // Handle end date selection
  const handleEndDateSelect = useCallback(async (date: Date | undefined) => {
    console.log("End date selected:", date);
    if (date && startDate) {
      // Check if all dates in the range are available
      const dateRange = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= date) {
        dateRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Check each date in the range
      let allDatesAvailable = true;
      for (const rangeDate of dateRange) {
        const available = await checkDateAvailability(rangeDate);
        if (!available) {
          allDatesAvailable = false;
          break;
        }
      }
      
      if (allDatesAvailable) {
        onEndDateChange(date);
        // Let DatePickerPopover handle closing
      } else {
        toast({
          title: "Rango no disponible",
          description: "Algunas fechas en el rango seleccionado no están disponibles.",
          variant: "destructive"
        });
      }
    } else {
      onEndDateChange(undefined);
    }
  }, [checkDateAvailability, onEndDateChange, startDate]);

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
