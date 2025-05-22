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

  // 🐛 DEBUG: Log del estado en cada render
  console.log('🔍 useUnitDetailController render con estado:', {
    guests: state.guests,
    availableDomos: state.availableDomos,
    requiredDomos: state.requiredDomos,
    setGuests: typeof state.setGuests
  });

  // CORRECCIÓN: Función específica para manejar cambios de huéspedes con debugging
  const handleGuestsChange = useCallback((newGuests: number) => {
    console.log('🔍 useUnitDetailController: handleGuestsChange llamado:', {
      currentGuests: state.guests,
      newGuests,
      typeof_newGuests: typeof newGuests
    });
    
    state.setGuests(newGuests);
    
    // 🐛 DEBUG: Verificar cambio después de un tick
    setTimeout(() => {
      console.log('🔍 useUnitDetailController: Estado después del cambio:', state.guests);
    }, 100);
  }, [state.setGuests, state.guests]);

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
      const guestsFromUrl = parseInt(guestsParam, 10);
      if (!isNaN(guestsFromUrl) && guestsFromUrl > 0) {
        state.setGuests(guestsFromUrl);
      }
    }
  }, [searchParams, state.setStartDate, state.setEndDate, state.setGuests]);

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

  // CORRECCIÓN: Return simplificado con acceso directo a las propiedades necesarias
  return {
    // Estado completo (para retrocompatibilidad)
    state,
    actions: extendedActions,
    
    // AÑADIDO: Acceso directo para el GuestSelector
    guests: state.guests,
    setGuests: handleGuestsChange,
    handleGuestsChange,
    availableDomos: state.availableDomos,
    requiredDomos: state.requiredDomos,
    maxGuests: 16,
    maxDomos: 4,
    
    // Otros valores útiles
    startDate: state.startDate,
    endDate: state.endDate,
    setStartDate: state.setStartDate,
    setEndDate: state.setEndDate,
    isAvailable: state.isAvailable,
    quote: state.quote,
    showQuote: state.showQuote,
    displayUnit: state.displayUnit
  };
};