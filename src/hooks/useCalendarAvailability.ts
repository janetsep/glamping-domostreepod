
import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay
} from "date-fns";
import { AvailabilityCalendarDay } from "@/types";
import { checkUnitAvailability } from "./reservations/utils/availabilityChecker";

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
      
      // Get all days in the interval
      const daysInMonth = eachDayOfInterval({ start, end });
      
      // We'll check each day's availability against existing reservations
      const availabilityMap = await Promise.all(
        daysInMonth.map(async (day) => {
          // Check availability for this specific day (end date is same day for simplicity)
          // This isn't perfect for real availability but works for calendar display purposes
          // since we're just checking if the day falls within any reservation
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);
          
          // We invert the result because we want to know if the day is available (not reserved)
          const isAvailable = await checkUnitAvailability(unitId, day, dayEnd)
            .catch(() => false);  // Default to unavailable if there's an error
          
          return {
            date: day,
            isAvailable,
            isSelected: selectedDate ? isSameDay(day, selectedDate) : false
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

  return { calendarDays, isLoading };
};
