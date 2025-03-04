
import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  addDays,
  format
} from "date-fns";
import { AvailabilityCalendarDay } from "@/types";
import { checkGeneralAvailability } from "./reservations/utils/availabilityChecker";
import { supabase } from "@/lib/supabase";

export const useCalendarAvailability = (unitId: string, currentMonth: Date, selectedDate: Date | null) => {
  const [calendarDays, setCalendarDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);

  // Fetch reservations for the current month
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      try {
        console.log(`Fetching reservations from ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`);
        
        // Extend the date range a bit to capture reservations that might overlap with the month
        const extendedStart = new Date(start);
        extendedStart.setDate(extendedStart.getDate() - 7);
        
        const extendedEnd = new Date(end);
        extendedEnd.setDate(extendedEnd.getDate() + 7);
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'confirmed')
          .or(`check_in.lte.${extendedEnd.toISOString()},check_out.gte.${extendedStart.toISOString()}`);
        
        if (error) {
          console.error("Error fetching reservations:", error);
          return [];
        }
        
        console.log(`Found ${data?.length || 0} reservations for the selected month`);
        setReservations(data || []);
        return data;
      } catch (error) {
        console.error("Error in fetchReservations:", error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, [currentMonth]);

  // Generate calendar data with availability
  useEffect(() => {
    const loadCalendarData = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      setIsLoading(true);
      
      try {
        const availabilityData = await fetchAvailability(start, end);
        setCalendarDays(availabilityData);
      } catch (error) {
        console.error("Error loading calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCalendarData();
  }, [currentMonth, unitId, selectedDate, reservations]);

  const fetchAvailability = async (start: Date, end: Date) => {
    try {
      console.log(`Fetching availability for ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`);
      
      // Get all days in month
      const daysInMonth = eachDayOfInterval({ start, end });
      
      // Check availability for each day
      const availabilityMap = await Promise.all(
        daysInMonth.map(async (day) => {
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
          
          // Calculate available units (total units - reserved units)
          const TOTAL_UNITS = 4;
          const reservedUnits = reservationsOnDay.length;
          const availableUnits = Math.max(0, TOTAL_UNITS - reservedUnits);
          
          console.log(`Day ${format(day, 'yyyy-MM-dd')}: ${reservedUnits} reserved, ${availableUnits} available`);
          
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
      console.error("Error in fetchAvailability:", error);
      return [];
    }
  };

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
      const TOTAL_UNITS = 4;
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
    calendarDays, 
    isLoading,
    isDateAvailable,
    isDateRangeAvailable
  };
};
