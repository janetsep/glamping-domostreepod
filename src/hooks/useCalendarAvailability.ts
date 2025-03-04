
import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay
} from "date-fns";
import { AvailabilityCalendarDay } from "@/types";
import { checkGeneralAvailability } from "./reservations/utils/availabilityChecker";

export const useCalendarAvailability = (unitId: string, currentMonth: Date, selectedDate: Date | null) => {
  const [calendarDays, setCalendarDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalendarData = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const availabilityData = await fetchAvailability(start, end);
      setCalendarDays(availabilityData);
    };
    
    loadCalendarData();
  }, [currentMonth, unitId, selectedDate]);

  const fetchAvailability = async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      
      // Obtenemos todos los días del mes
      const daysInMonth = eachDayOfInterval({ start, end });
      
      // Verificamos la disponibilidad para cada día
      const availabilityMap = await Promise.all(
        daysInMonth.map(async (day) => {
          // Verificamos disponibilidad para este día específico
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);
          
          // Usamos la nueva función que verifica la disponibilidad general
          const { isAvailable, availableUnits, totalUnits } = await checkGeneralAvailability(day, dayEnd)
            .catch(() => ({ isAvailable: false, availableUnits: 0, totalUnits: 4 }));  // Valor por defecto en caso de error
          
          return {
            date: day,
            isAvailable,
            isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
            availableUnits,
            totalUnits
          };
        })
      );
      
      return availabilityMap;
    } catch (error) {
      console.error("Error en fetchAvailability:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { calendarDays, isLoading };
};
