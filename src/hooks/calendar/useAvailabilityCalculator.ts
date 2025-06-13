
import { useState, useCallback } from 'react';
import { AvailabilityCalendarDay } from '@/types';
import { differenceInDays, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns';

const TOTAL_UNITS = 4; // Total number of domos available

interface Reservation {
  check_in: string;
  check_out: string;
  unit_id: string | null;
  status: string;
}

export const useAvailabilityCalculator = () => {
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAvailability = useCallback(async (
    startDate: Date,
    endDate: Date,
    selectedStartDate?: Date,
    selectedEndDate?: Date,
    reservations: Reservation[] = []
  ) => {
    setIsLoading(true);
    
    try {
      const days: AvailabilityCalendarDay[] = [];
      const totalDays = differenceInDays(endDate, startDate) + 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(startDate, i);
        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);
        
        // Find overlapping reservations for this specific day
        const overlappingReservations = reservations.filter(reservation => {
          const checkIn = new Date(reservation.check_in);
          const checkOut = new Date(reservation.check_out);
          return checkIn <= dayEnd && checkOut >= dayStart && reservation.status === 'confirmed';
        });

        // Count reserved units (only those with unit_id assigned)
        const reservedUnits = overlappingReservations.filter(r => r.unit_id !== null && r.unit_id !== undefined).length;
        const availableUnits = TOTAL_UNITS - reservedUnits;
        
        // A date is available if it has at least 1 available unit and it's not in the past
        const isAvailable = availableUnits > 0 && currentDate >= today;
        
        // Check if this date is selected
        const isSelected = selectedStartDate ? isSameDay(currentDate, selectedStartDate) : false;
        const isEndSelected = selectedEndDate ? isSameDay(currentDate, selectedEndDate) : false;
        
        // Check if this date is in the range between selected dates
        const isInRange = selectedStartDate && selectedEndDate ? 
          currentDate > selectedStartDate && currentDate < selectedEndDate : false;

        days.push({
          date: currentDate,
          isAvailable,
          isSelected: isSelected || isEndSelected,
          availableUnits,
          totalUnits: TOTAL_UNITS,
          isToday: isSameDay(currentDate, today),
          isInRange
        });
      }

      console.log('📅 [useAvailabilityCalculator] Días calculados:', {
        totalDias: days.length,
        diasDisponibles: days.filter(d => d.isAvailable).length,
        totalReservas: reservations.length
      });

      setAvailabilityDays(days);
    } catch (error) {
      console.error('Error calculating availability:', error);
      setAvailabilityDays([]);
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
