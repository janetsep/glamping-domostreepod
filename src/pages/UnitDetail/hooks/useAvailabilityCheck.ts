
import { useEffect } from "react";
import { UnitDetailState } from "./useUnitDetailState";
import { useReservations } from "@/hooks/reservations";
import { findAlternativeDates } from "@/hooks/reservations/utils/availabilityChecker";

export const useAvailabilityCheck = (state: UnitDetailState) => {
  const { checkGeneralAvailability } = useReservations();

  const checkDatesAvailability = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;
    
    try {
      const requiredDomos = state.requiredDomos || 1;
      
      // Verificar disponibilidad general para las fechas seleccionadas
      const availabilityResult = await checkGeneralAvailability(state.startDate, state.endDate);
      
      // Actualizar el estado según la disponibilidad
      const isFullyAvailable = availabilityResult.availableUnits >= requiredDomos;
      const isPartiallyAvailable = availabilityResult.availableUnits > 0 && availabilityResult.availableUnits < requiredDomos;
      
      state.setIsAvailable(isFullyAvailable);
      state.setPartialAvailability(isPartiallyAvailable);
      state.setAvailableDomos(availabilityResult.availableUnits);
      state.setCheckedAvailability(true);
      
      // Si no hay disponibilidad completa, buscar fechas alternativas
      if (!isFullyAvailable) {
        const alternatives = await findAlternativeDates(state.startDate, state.endDate, requiredDomos);
        state.setAlternativeDates(alternatives);
      } else {
        state.setAlternativeDates([]);
      }
      
      return isFullyAvailable;
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      state.setIsAvailable(false);
      state.setCheckedAvailability(true);
      return false;
    }
  };

  return {
    checkDatesAvailability
  };
};
