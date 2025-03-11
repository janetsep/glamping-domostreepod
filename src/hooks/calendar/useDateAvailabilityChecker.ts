
import { format } from "date-fns";
import { eachDayOfInterval, addDays } from "date-fns";

const TOTAL_UNITS = 4; // Total number of domos available

/**
 * Hook to check availability for specific dates and date ranges
 */
export const useDateAvailabilityChecker = (reservations: any[]) => {
  
  // Check if a single date is available
  const isDateAvailable = async (date: Date): Promise<boolean> => {
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
      
      // Calculate available units (total units - reserved units)
      const reservedUnits = reservationsOnDay.length;
      const availableUnits = Math.max(0, TOTAL_UNITS - reservedUnits);
      
      console.log(`Date ${format(date, 'yyyy-MM-dd')} availability: ${availableUnits > 0 ? 'Available' : 'Not available'} (${availableUnits} units)`);
      
      return availableUnits > 0;
    } catch (error) {
      console.error("Error checking date availability:", error);
      return false;
    }
  };

  // Check if a range of dates is available
  const isDateRangeAvailable = async (startDate: Date, endDate: Date): Promise<boolean> => {
    try {
      console.log(`Checking availability for date range: ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`);
      
      // Create an array of days between start and end date (including the start date, excluding the end date)
      const days = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });
      
      console.log(`Checking ${days.length} days in the range`);
      
      // Check availability for each day in the range
      for (const day of days) {
        const available = await isDateAvailable(day);
        if (!available) {
          console.log(`Date ${format(day, 'yyyy-MM-dd')} is not available in the range`);
          return false;
        }
      }
      
      console.log('All dates in the range are available');
      return true;
    } catch (error) {
      console.error("Error checking date range availability:", error);
      return false;
    }
  };

  return {
    isDateAvailable,
    isDateRangeAvailable
  };
};
