
import { useState, useCallback } from 'react';
import { AvailabilityCalendarDay } from '@/types';
import { differenceInDays, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns';

const TOTAL_UNITS = 4;

interface Reservation {
  check_in: string;
  check_out: string;
  unit_id: string | null;
  status: string;
}

export const useAvailabilityCalculator = () => {
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función corregida: cuenta TODOS los domos reservados (por unidad) cada día
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

        // ¡OJO! Contamos por cada domo ocupado esa noche
        // Solo reservas confirmadas y que efectivamente cruzan la noche de currentDate
        const overlappingReservations = reservations.filter(res => {
          if (res.status !== 'confirmed' || !res.unit_id) return false;
          // La reserva bloquea currentDate si entra antes o igual, y sale después (checkout mayor a start)
          const checkIn = new Date(res.check_in);
          const checkOut = new Date(res.check_out);
          return checkIn <= dayStart && checkOut > dayStart;
        });

        const reservedUnits = overlappingReservations.length;
        const availableUnits = TOTAL_UNITS - reservedUnits;

        const isAvailable = availableUnits > 0 && currentDate >= today;
        const isSelected = selectedStartDate ? isSameDay(currentDate, selectedStartDate) : false;
        const isEndSelected = selectedEndDate ? isSameDay(currentDate, selectedEndDate) : false;
        const isInRange = selectedStartDate && selectedEndDate
          ? currentDate > selectedStartDate && currentDate < selectedEndDate
          : false;

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
