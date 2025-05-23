import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  format,
  startOfWeek,
  endOfWeek,
  addDays
} from "date-fns";
import { es } from 'date-fns/locale'; // Importar localización española
import { AvailabilityCalendarDay } from "@/types";

const TOTAL_UNITS = 4; // Total number of domos available

/**
 * Hook to calculate availability based on reservations
 */
export const useAvailabilityCalculator = (
  currentMonth: Date, 
  selectedDate: Date | null,
  reservations: any[]
) => {
  const [calendarDays, setCalendarDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Generate calendar data with availability
  useEffect(() => {
    const calculateAvailability = async () => {
      const month = new Date(currentMonth);
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      
      // Calcular el inicio de la semana (lunes) del primer día del mes
      const calendarStart = startOfWeek(start, { weekStartsOn: 1 });
      // Calcular el fin de la semana (domingo) del último día del mes
      const calendarEnd = endOfWeek(end, { weekStartsOn: 1 });
      
      setIsCalculating(true);
      
      try {
        const availabilityData = await generateAvailabilityData(calendarStart, calendarEnd);
        setCalendarDays(availabilityData);
      } catch (error) {
        console.error("Error calculating availability:", error);
      } finally {
        setIsCalculating(false);
      }
    };
    
    calculateAvailability();
  }, [currentMonth, selectedDate, reservations]);

  const generateAvailabilityData = async (start: Date, end: Date) => {
    try {
      console.log(`Generating availability data for ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`);
      
      // Get all days in the calendar view (incluye días del mes anterior y siguiente)
      const daysInCalendar = eachDayOfInterval({ start, end });
      
      // Check availability for each day
      const availabilityMap = await Promise.all(
        daysInCalendar.map(async (day) => {
          // Set the day to midnight for consistent comparison
          const dayStart = new Date(day);
          dayStart.setHours(0, 0, 0, 0);
          
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);
          
          // Count reservations that overlap with this day
          const reservationsOnDay = reservations.filter(reservation => {
            const checkIn = new Date(reservation.check_in);
            const checkOut = new Date(reservation.check_out);
            
            return (
              (checkIn <= dayEnd && checkOut >= dayStart)
            );
          });
          
          // CORRECCIÓN: Calcular correctamente las unidades reservadas
          // Calcular unidades reservadas por unit_id único
          const uniqueReservedUnits = new Set(reservationsOnDay
            .map(r => r.unit_id)
            .filter(Boolean)); // Filter out null/undefined unit_ids
          
          const reservedWithUnitId = uniqueReservedUnits.size;
          
          // Calcular reservas sin unit_id (cada una cuenta como una unidad separada)
          const reservationsWithoutUnitId = reservationsOnDay.filter(r => !r.unit_id).length;
          
          // Total de unidades reservadas (con máximo de TOTAL_UNITS)
          const reservedUnits = Math.min(TOTAL_UNITS, reservedWithUnitId + reservationsWithoutUnitId);
          const availableUnits = TOTAL_UNITS - reservedUnits;
          
          console.log(`Day ${format(day, 'yyyy-MM-dd')} (${format(day, 'EEEE', { locale: es })}): 
            - Total reservations: ${reservationsOnDay.length}
            - Unique unit_ids: ${reservedWithUnitId}
            - Reservations without unit_id: ${reservationsWithoutUnitId}
            - Total reserved units: ${reservedUnits}
            - Available units: ${availableUnits}`);
          
          return {
            date: day,
            isAvailable: availableUnits > 0,
            isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
            availableUnits,
            totalUnits: TOTAL_UNITS
          };
        })
      );
      
      return availabilityMap;
    } catch (error) {
      console.error("Error in generateAvailabilityData:", error);
      return [];
    }
  };

  return { 
    calendarDays, 
    isCalculating
  };
};