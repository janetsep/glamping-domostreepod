
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker";

interface UseDateSelectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  requiredDomos?: number;
}

export const useDateSelection = ({
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  requiredDomos = 1
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
  const checkDateAvailability = useCallback(async (date: Date): Promise<{isAvailable: boolean, availableDomos: number}> => {
    try {
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { isAvailable, availableUnits } = await checkGeneralAvailability(date, dayEnd)
        .catch(() => ({ isAvailable: false, availableUnits: 0, totalUnits: 4 }));
      
      return {
        isAvailable,
        availableDomos: availableUnits
      };
    } catch (error) {
      console.error("Error checking date availability:", error);
      return {
        isAvailable: false,
        availableDomos: 0
      };
    }
  }, []);

  // Handle start date selection
  const handleStartDateSelect = async (date: Date | undefined) => {
    if (date) {
      const { isAvailable, availableDomos } = await checkDateAvailability(date);
      
      if (isAvailable) {
        // Check if there are enough domos available
        if (availableDomos < requiredDomos) {
          toast({
            title: "Domos insuficientes",
            description: `Se necesitan ${requiredDomos} domos para la cantidad de huéspedes seleccionada, pero solo hay ${availableDomos} disponibles.`,
            variant: "destructive"
          });
          // We still allow selection but warn the user
        }
        
        onStartDateChange(date);
        
        // If the end date is before the new start date, reset it
        if (endDate && endDate <= date) {
          onEndDateChange(undefined);
        }
        
        // Update the end date calendar month to match the start date month
        setEndDateCalendarMonth(date);
        
        // Close the start calendar and open the end calendar if no end date is selected
        setStartCalendarOpen(false);
        if (!endDate) {
          setTimeout(() => setEndCalendarOpen(true), 300); // Open end calendar after a short delay
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
  };

  // Handle end date selection
  const handleEndDateSelect = async (date: Date | undefined) => {
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
      let minAvailableDomos = Infinity;
      
      for (const rangeDate of dateRange) {
        const { isAvailable, availableDomos } = await checkDateAvailability(rangeDate);
        if (!isAvailable) {
          allDatesAvailable = false;
          break;
        }
        minAvailableDomos = Math.min(minAvailableDomos, availableDomos);
      }
      
      if (allDatesAvailable) {
        // Check if there are enough domos available for all dates in range
        if (minAvailableDomos < requiredDomos) {
          toast({
            title: "Domos insuficientes",
            description: `Se necesitan ${requiredDomos} domos para la cantidad de huéspedes seleccionada, pero solo hay ${minAvailableDomos} disponibles en algún día del rango seleccionado.`,
            variant: "destructive"
          });
          // We still allow selection but warn the user
        }
        
        onEndDateChange(date);
        setEndCalendarOpen(false);
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
