
import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  addDays
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
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'confirmed')
          .or(`check_in.lte.${end.toISOString()},check_out.gte.${start.toISOString()}`);
        
        if (error) {
          console.error("Error fetching reservations:", error);
          return [];
        }
        
        setReservations(data || []);
        return data;
      } catch (error) {
        console.error("Error in fetchReservations:", error);
        return [];
      }
    };
    
    fetchReservations();
  }, [currentMonth]);

  // Generate calendar data with availability
  useEffect(() => {
    const loadCalendarData = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const availabilityData = await fetchAvailability(start, end);
      setCalendarDays(availabilityData);
    };
    
    loadCalendarData();
  }, [currentMonth, unitId, selectedDate, reservations]);

  const fetchAvailability = async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      
      // Get all days in month
      const daysInMonth = eachDayOfInterval({ start, end });
      
      // Check availability for each day
      const availabilityMap = await Promise.all(
        daysInMonth.map(async (day) => {
          // Check availability for this specific day
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);
          
          // Use the checkGeneralAvailability function
          const { isAvailable, availableUnits, totalUnits } = await checkGeneralAvailability(day, dayEnd)
            .catch(() => ({ isAvailable: false, availableUnits: 0, totalUnits: 4 }));  // Default in case of error
          
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
      console.error("Error in fetchAvailability:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const isDateAvailable = async (date: Date): Promise<boolean> => {
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
  };

  // Check if a range of dates is available
  const isDateRangeAvailable = async (startDate: Date, endDate: Date): Promise<boolean> => {
    try {
      // Create an array of days between start and end date
      const days = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });
      
      // Check availability for each day in the range
      for (const day of days) {
        const available = await isDateAvailable(day);
        if (!available) {
          return false;
        }
      }
      
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
