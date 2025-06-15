
import { format, startOfDay, endOfDay } from "date-fns";
import { eachDayOfInterval, addDays } from "date-fns";
import { useEffect, useCallback } from "react";
// Importar la función centralizada para asegurar consistencia
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker/checkGeneralAvailability";

const TOTAL_UNITS = 4;

interface Reservation {
  check_in: string;
  check_out: string;
  unit_id: string | null;
  status?: string;
}

export const useDateAvailabilityChecker = (reservations: Reservation[]) => {
  useEffect(() => {
    // Este log es para el pintado inicial del calendario
    console.log('[useDateAvailabilityChecker] Inicializado con', reservations.length, 'reservas para la vista del calendario.');
  }, [reservations.length]);

  // Esta función es para el pintado de días individuales. Usa los datos parciales del mes por rendimiento.
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

    // Se reduce el log para no saturar la consola en cada renderizado de día
    // console.log(`...`);

    return {
      isAvailable,
      availableUnits,
      totalUnits: TOTAL_UNITS
    };
  }, [reservations]);

  // IMPORTANTE: Esta función se usa al SELECCIONAR un rango de fechas.
  // Debe ser 100% precisa y consistente con el resto de la aplicación.
  // Por eso, delega la lógica a `checkGeneralAvailability`.
  const isDateRangeAvailable = async (startDate: Date, endDate: Date, requiredUnits = 1) => {
    try {
      console.log('🔍 [useDateAvailabilityChecker] Verificando rango con la función central `checkGeneralAvailability` para consistencia.');
      
      const result = await checkGeneralAvailability(startDate, endDate, requiredUnits);
      
      console.log('✅ [useDateAvailabilityChecker] Resultado del rango desde `checkGeneralAvailability`:', {
        disponible: result.isAvailable,
        unidadesDisponibles: result.availableUnits
      });

      return {
        isAvailable: result.isAvailable,
        availableUnits: result.availableUnits
      };
    } catch (error) {
      console.error("Error en isDateRangeAvailable al llamar a checkGeneralAvailability:", error);
      return { isAvailable: false, availableUnits: 0 };
    }
  };

  return {
    isDateAvailable,
    isDateRangeAvailable
  };
};
