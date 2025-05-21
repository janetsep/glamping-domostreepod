import { format } from "date-fns";
import { eachDayOfInterval, addDays } from "date-fns";

const TOTAL_UNITS = 4; // Total number of domos available

/**
 * Hook to check availability for specific dates and date ranges
 */
export const useDateAvailabilityChecker = (reservations: any[]) => {
  
  // Check if a single date is available
  const isDateAvailable = async (date: Date, requiredUnits = 1): Promise<{isAvailable: boolean, availableUnits: number}> => {
    try {
      console.log(`Checking availability for single date: ${format(date, 'yyyy-MM-dd')}`);
      
      // Set the day to midnight for consistent comparison
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
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
      
      console.log(`Date ${format(date, 'yyyy-MM-dd')} availability check results:
        - Total reservations: ${reservationsOnDay.length}
        - Unique unit_ids: ${reservedWithUnitId}
        - Reservations without unit_id: ${reservationsWithoutUnitId}
        - Total reserved units: ${reservedUnits}
        - Available units: ${availableUnits}
        - Required units: ${requiredUnits}
        - Is available: ${availableUnits >= requiredUnits}`);
      
      return {
        isAvailable: availableUnits >= requiredUnits,
        availableUnits
      };
    } catch (error) {
      console.error("Error checking date availability:", error);
      return { isAvailable: false, availableUnits: 0 };
    }
  };

  // Check if a range of dates is available
  const isDateRangeAvailable = async (startDate: Date, endDate: Date, requiredUnits = 1): Promise<{isAvailable: boolean, availableUnits: number}> => {
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