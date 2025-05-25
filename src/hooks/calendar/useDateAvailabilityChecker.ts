import { format, startOfDay, endOfDay } from "date-fns";
import { eachDayOfInterval, addDays } from "date-fns";
import { useEffect, useCallback } from "react";

const TOTAL_UNITS = 4; // Total number of domos available

interface Reservation {
  check_in: string;
  check_out: string;
  unit_id: string | null;
}

/**
 * Hook to check availability for specific dates and date ranges
 */
export const useDateAvailabilityChecker = (reservations: Reservation[]) => {
  // Solo loggear el número total de reservas al inicializar
  useEffect(() => {
    console.log('📅 [useDateAvailabilityChecker] Inicializado con', reservations.length, 'reservas');
  }, [reservations.length]);

  const isDateAvailable = useCallback((date: Date, requiredUnits = 1) => {
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    const overlappingReservations = reservations.filter(reservation => {
      const checkIn = new Date(reservation.check_in);
      const checkOut = new Date(reservation.check_out);
      return checkIn <= end && checkOut >= start;
    });

    const reservedUnits = overlappingReservations.filter(r => r.unit_id).length;
    const availableUnits = TOTAL_UNITS - reservedUnits;
    const isAvailable = availableUnits >= requiredUnits;

    console.log('📅 [useDateAvailabilityChecker] Verificación de disponibilidad:', {
      fecha: date.toISOString().split('T')[0],
      disponible: isAvailable,
      unidadesDisponibles: availableUnits,
      unidadesRequeridas: requiredUnits,
      reservasSolapadas: overlappingReservations.length
    });

    return {
      isAvailable,
      availableUnits,
      totalUnits: TOTAL_UNITS
    };
  }, [reservations]);

  // Check if a range of dates is available
  const isDateRangeAvailable = async (startDate: Date, endDate: Date, requiredUnits = 1): Promise<{isAvailable: boolean, availableUnits: number}> => {
    console.log(`🔍 [useDateAvailabilityChecker] isDateRangeAvailable - INICIO`);
    console.log(`🔍 [useDateAvailabilityChecker] Parámetros recibidos:`, { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0], requiredUnits });
    try {
      console.log(`Checking availability for date range: ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`);
      
      // Create an array of days between start and end date (including the start date, excluding the end date)
      const days = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });
      
      console.log(`Checking ${days.length} days in the range`);
      
      // Check availability for each day in the range
      let minAvailableUnits = TOTAL_UNITS;
      let allDaysAvailable = true;
      
      for (const day of days) {
        const { isAvailable, availableUnits } = await isDateAvailable(day, requiredUnits);
        if (!isAvailable) {
          console.log(`Date ${format(day, 'yyyy-MM-dd')} is not available in the range (needs ${requiredUnits}, has ${availableUnits})`);
          allDaysAvailable = false;
        }
        // Track the minimum number of available units across all days
        minAvailableUnits = Math.min(minAvailableUnits, availableUnits);
      }
      
      console.log(`Range availability result: ${allDaysAvailable ? 'Available' : 'Not available'} (minimum ${minAvailableUnits} units available)`);
      
      return {
        isAvailable: allDaysAvailable,
        availableUnits: minAvailableUnits
      };
    } catch (error) {
      console.error("Error checking date range availability:", error);
      return { isAvailable: false, availableUnits: 0 };
    }
  };

  return {
    isDateAvailable,
    isDateRangeAvailable
  };
};