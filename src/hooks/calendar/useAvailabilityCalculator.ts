import { useState, useCallback } from 'react';
import { AvailabilityCalendarDay } from '@/types';
import { supabase } from '@/lib/supabase';
import { differenceInDays, addDays, isSameDay } from 'date-fns';

export const useAvailabilityCalculator = () => {
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAvailability = useCallback(async (
    startDate: Date,
    endDate: Date,
    selectedStartDate?: Date,
    selectedEndDate?: Date
  ) => {
    setIsLoading(true);
    
    try {
      const days: AvailabilityCalendarDay[] = [];
      const totalDays = differenceInDays(endDate, startDate) + 1;
      
      for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(startDate, i);
        const today = new Date();
        
        days.push({
          date: currentDate,
          isAvailable: Math.random() > 0.3, // Placeholder logic
          isSelected: selectedStartDate ? isSameDay(currentDate, selectedStartDate) : false,
          availableUnits: 4,
          totalUnits: 4,
          isToday: isSameDay(currentDate, today),
          isInRange: selectedStartDate && selectedEndDate ? 
            currentDate >= selectedStartDate && currentDate <= selectedEndDate : false
        });
      }

      setAvailabilityDays(days);
    } catch (error) {
      console.error('Error calculating availability:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    availabilityDays,
    isLoading,
    calculateAvailability
  };
};
