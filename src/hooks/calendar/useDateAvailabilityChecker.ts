
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

  // CRÍTICO: Usar exactamente la misma lógica que checkGeneralAvailability
  const isDateAvailable = useCallback((date: Date, requiredUnits = 1) => {
    const start = startOfDay(date);
    const end = addDays(start, 1); // Para verificar ocupación de esa noche específica

    // Solo contar reservas CONFIRMADAS y con unit_id asignado que se superponen con esta noche
    const overlappingReservations = reservations.filter(reservation => {
      if (reservation.status !== 'confirmed' || !reservation.unit_id) return false;
      
      const checkIn = new Date(reservation.check_in);
      const checkOut = new Date(reservation.check_out);
      
      // Una reserva ocupa esta noche si: checkIn < end && checkOut > start
      return checkIn < end && checkOut > start;
    });

    const reservedUnits = overlappingReservations.length;
    const availableUnits = TOTAL_UNITS - reservedUnits;
    const isAvailable = availableUnits >= requiredUnits;

    console.log(`📅 [useDateAvailabilityChecker] Fecha ${date.toISOString().split('T')[0]}:`, {
      reservasSuperpuestas: overlappingReservations.length,
      disponibles: availableUnits,
      requeridos: requiredUnits,
      disponible: isAvailable
    });

    return {
      isAvailable,
      availableUnits,
      totalUnits: TOTAL_UNITS
    };
  }, [reservations]);

  // El rango es disponible SÓLO si todos los días cumplen con requiredUnits
  const isDateRangeAvailable = async (startDate: Date, endDate: Date, requiredUnits = 1) => {
    try {
      // IMPORTANTE: Para rangos, verificar cada noche individual
      const days = eachDayOfInterval({ start: startDate, end: addDays(endDate, -1) });

      let minAvailableUnits = TOTAL_UNITS;
      let allDaysAvailable = true;

      console.log('🔍 [useDateAvailabilityChecker] Verificando rango:', {
        inicio: startDate.toISOString().split('T')[0],
        fin: endDate.toISOString().split('T')[0],
        noches: days.length,
        requiredUnits
      });

      for (const day of days) {
        const { isAvailable, availableUnits } = isDateAvailable(day, requiredUnits);
        if (!isAvailable) {
          allDaysAvailable = false;
        }
        minAvailableUnits = Math.min(minAvailableUnits, availableUnits);
      }

      console.log('✅ [useDateAvailabilityChecker] Resultado del rango:', {
        todasLasNochesDisponibles: allDaysAvailable,
        minimoDomos: minAvailableUnits
      });

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
