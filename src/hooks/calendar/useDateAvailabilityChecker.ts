
import { format, startOfDay, endOfDay } from "date-fns";
import { eachDayOfInterval, addDays } from "date-fns";
import { useEffect, useCallback } from "react";

const TOTAL_UNITS = 4;

interface Reservation {
  check_in: string;
  check_out: string;
  unit_id: string | null;
  status?: string;
}

export const useDateAvailabilityChecker = (reservations: Reservation[]) => {
  useEffect(() => {
    console.log('[useDateAvailabilityChecker] Initialized with', reservations.length, 'reservations');
  }, [reservations.length]);

  // Nuevo: Solo cuenta reservas confirmadas y con unit_id
  const isDateAvailable = useCallback((date: Date, requiredUnits = 1) => {
    const start = startOfDay(date);

    const overlappingReservations = reservations.filter(reservation => {
      if (reservation.status !== 'confirmed' || !reservation.unit_id) return false;
      const checkIn = new Date(reservation.check_in);
      const checkOut = new Date(reservation.check_out);
      // Ocupa la noche de 'start' si: checkIn <= dayStart && checkOut > dayStart
      return checkIn <= start && checkOut > start;
    });

    const reservedUnits = overlappingReservations.length;
    const availableUnits = TOTAL_UNITS - reservedUnits;
    const isAvailable = availableUnits >= requiredUnits;

    return {
      isAvailable,
      availableUnits,
      totalUnits: TOTAL_UNITS
    };
  }, [reservations]);

  // El rango es disponible SÓLO si todos los días cumplen con requiredUnits
  const isDateRangeAvailable = async (startDate: Date, endDate: Date, requiredUnits = 1) => {
    try {
      // Chequea por cada noche
      const days = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });

      let minAvailableUnits = TOTAL_UNITS;
      let allDaysAvailable = true;

      for (const day of days) {
        const { isAvailable, availableUnits } = isDateAvailable(day, requiredUnits);
        if (!isAvailable) {
          allDaysAvailable = false;
        }
        minAvailableUnits = Math.min(minAvailableUnits, availableUnits);
      }

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
