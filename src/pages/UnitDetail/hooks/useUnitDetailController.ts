
// Agregamos importaciones necesarias
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUnitDetailState } from "./useUnitDetailState";
import { useReservationActions } from "./useReservationActions";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker/checkGeneralAvailability";

export const useUnitDetailController = (unitId: string | undefined, searchParams: URLSearchParams) => {
  // Usar el estado principal
  const state = useUnitDetailState(unitId);
  
  // Usar las acciones
  const actions = useReservationActions(state);

  // Extraer parámetros de URL si existen
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');

    if (checkIn) {
      state.setStartDate(new Date(checkIn));
    }
    if (checkOut) {
      state.setEndDate(new Date(checkOut));
    }
    if (guestsParam) {
      state.setGuests(parseInt(guestsParam, 10));
    }
  }, [searchParams]);

  // Función adicional para validar disponibilidad antes de una reserva
  const handleReservation = async () => {
    // Validar antes de continuar
    if (!state.startDate || !state.endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }
    
    // Verificamos si hay suficientes domos disponibles
    if (state.availableDomos !== undefined && state.requiredDomos !== undefined) {
      if (state.requiredDomos > state.availableDomos) {
        toast.error(`Solo hay ${state.availableDomos} de 4 domos disponibles. Necesitas ${state.requiredDomos} para tu reserva.`);
        return;
      }
    }
    
    // Continuar con la reserva
    actions.handleReservation();
  };

  // Función para confirmar la reserva con validación adicional
  const handleConfirmReservation = async () => {
    if (!state.startDate || !state.endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }
    
    // CORRECCIÓN: Volver a validar disponibilidad antes de confirmar
    if (state.requiredDomos !== undefined) {
      const { isAvailable, availableUnits } = await checkGeneralAvailability(
        state.startDate,
        state.endDate,
        state.requiredDomos
      );
      
      if (!isAvailable) {
        toast.error(`No hay suficiente disponibilidad. Solo hay ${availableUnits} de 4 domos disponibles.`);
        return;
      }
    }
    
    // Continuar con la confirmación
    actions.handleConfirmReservation();
  };

  // Sobreescribir las acciones con nuestra lógica personalizada
  const extendedActions = {
    ...actions,
    handleReservation,
    handleConfirmReservation
  };

  return {
    state,
    actions: extendedActions
  };
};
