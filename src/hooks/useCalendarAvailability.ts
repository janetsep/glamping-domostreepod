
import { useState, useCallback, useEffect } from "react";
import { useReservationsFetcher } from "./calendar/useReservationsFetcher";
import { useAvailabilityCalculator } from "./calendar/useAvailabilityCalculator";
import { useDateAvailabilityChecker } from "./calendar/useDateAvailabilityChecker";

export const useCalendarAvailability = (unitId: string, currentMonth: Date, selectedDate: Date | null) => {
  // Solo loggear cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      console.log('📅 [useCalendarAvailability] Fecha seleccionada:', {
        fecha: selectedDate.toISOString().split('T')[0],
        mes: currentMonth.toISOString().split('T')[0]
      });
    }
  }, [selectedDate, currentMonth]);
  
  // Obtener reservas y la función refetch del fetcher
  const { reservations, isLoading: isLoadingReservations, refetch } = useReservationsFetcher(currentMonth);
  
  // Calculate availability for the calendar view - fix the function call
  const { availabilityDays, isLoading: isCalculating } = useAvailabilityCalculator();
  
  // Create date checker functions
  const { isDateAvailable: originalIsDateAvailable, isDateRangeAvailable } = useDateAvailabilityChecker(reservations);

  // Calculate availability based on current month and selected date
  useEffect(() => {
    if (reservations) {
      availabilityDays.calculateAvailability(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
        selectedDate,
        selectedDate
      );
    }
  }, [currentMonth, selectedDate, reservations]);

  // Wrap isDateAvailable to use the same logic as the calendar
  const isDateAvailable = useCallback(async (date: Date, requiredUnits = 1) => {
    const day = availabilityDays.find(d => 
      d.date.getFullYear() === date.getFullYear() &&
      d.date.getMonth() === date.getMonth() &&
      d.date.getDate() === date.getDate()
    );

    if (day) {
      console.log('📅 [useCalendarAvailability] Verificación de disponibilidad:', {
        fecha: date.toISOString().split('T')[0],
        disponible: day.availableUnits >= requiredUnits,
        unidadesDisponibles: day.availableUnits,
        unidadesRequeridas: requiredUnits
      });
      return {
        isAvailable: day.availableUnits >= requiredUnits,
        availableUnits: day.availableUnits
      };
    }

    return originalIsDateAvailable(date, requiredUnits);
  }, [availabilityDays, originalIsDateAvailable]);

  // Combine loading states
  const isLoading = isLoadingReservations || isCalculating;

  return { 
    calendarDays: availabilityDays, 
    isLoading,
    isDateAvailable,
    isDateRangeAvailable,
    refetch
  };
};
