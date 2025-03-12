
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker";

interface UseDateSelectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const useDateSelection = ({
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange
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
      
      const { isAvailable } = await checkGeneralAvailability(date, dayEnd)
        .catch(() => ({ isAvailable: false, availableUnits: 0, totalUnits: 4 }));
      
      return isAvailable;
    } catch (error) {
      console.error("Error checking date availability:", error);
      return false;
    }
  }, []);

  // Handle start date selection
  const handleStartDateSelect = async (date: Date | undefined) => {
    if (date) {
      const isAvailable = await checkDateAvailability(date);
      if (isAvailable) {
        onStartDateChange(date);
        
        // If the end date is before or equal to the new start date, reset it
        if (endDate && endDate <= date) {
          onEndDateChange(undefined);
        }
        
        setEndDateCalendarMonth(date);
        setStartCalendarOpen(false);
        
        if (!endDate) {
          setTimeout(() => setEndCalendarOpen(true), 300);
        }
      } else {
        toast({
          title: "Fecha no disponible",
          description: "No hay domos disponibles para esta fecha.",
          variant: "destructive"
        });
      }
    } else {
      onStartDateChange(undefined);
    }
  };

  // Handle end date selection
  const handleEndDateSelect = async (date: Date | undefined) => {
    if (date && startDate) {
      // Now allowing same day selection for one-night stays
      if (date < startDate) {
        toast({
          title: "Fecha inválida",
          description: "La fecha de salida debe ser igual o posterior a la fecha de entrada.",
          variant: "destructive"
        });
        return;
      }

      // Check availability
      const isAvailable = await checkDateAvailability(startDate);
      
      if (isAvailable) {
        onEndDateChange(date);
        setEndCalendarOpen(false);
      } else {
        toast({
          title: "Fecha no disponible",
          description: "La fecha seleccionada no está disponible.",
          variant: "destructive"
        });
      }
    } else {
      onEndDateChange(undefined);
    }
  };

  return {
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    endDateCalendarMonth,
    handleStartDateSelect,
    handleEndDateSelect,
  };
};
