
import { toast } from "sonner";
import { findAlternativeDates } from "@/hooks/reservations/utils/availabilityChecker";

type AvailabilityState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
  setIsAvailable: (isAvailable: boolean) => void;
  setCheckedAvailability: (checked: boolean) => void;
  requiredDomos?: number;
  checkedAvailability: boolean;
  setPartialAvailability?: (isPartial: boolean) => void;
  setAvailableDomos?: (count: number) => void;
  setAlternativeDates?: (dates: {startDate: Date, endDate: Date}[]) => void;
};

export const useAvailabilityCheck = (state: AvailabilityState) => {
  const checkDatesAvailability = async () => {
    if (state.startDate && state.endDate && state.displayUnit && !state.checkedAvailability) {
      const requiredDomos = state.requiredDomos || 1;
      
      try {
        // Primero verificar la disponibilidad general para obtener cuántos domos están disponibles
        const { data: availability } = await state.displayUnit.checkGeneralAvailability(
          state.startDate,
          state.endDate
        );
        
        console.log("Disponibilidad general:", availability);
        
        // Si hay datos de disponibilidad, usar esos valores
        let availableCount = 0;
        if (availability && typeof availability.availableUnits === 'number') {
          availableCount = availability.availableUnits;
        } else {
          // Si no hay datos de disponibilidad, verificar manualmente para cada domo requerido
          for (let i = 0; i < requiredDomos; i++) {
            const available = await state.checkAvailability(
              state.displayUnit.id,
              state.startDate,
              state.endDate
            );
            if (available) {
              availableCount++;
            }
          }
        }
        
        // Guardar el número de domos disponibles
        if (state.setAvailableDomos) {
          state.setAvailableDomos(availableCount);
        }
        
        // Determinar si hay disponibilidad completa, parcial o ninguna
        const allAvailable = availableCount >= requiredDomos;
        const partialAvailable = availableCount > 0 && availableCount < requiredDomos;
        
        if (partialAvailable) {
          // Marcar como disponibilidad parcial
          if (state.setPartialAvailability) {
            state.setPartialAvailability(true);
          }
          
          // Buscar fechas alternativas donde haya suficientes domos
          if (state.setAlternativeDates) {
            const alternatives = await findAlternativeDates(
              state.startDate, 
              state.endDate, 
              requiredDomos
            );
            state.setAlternativeDates(alternatives);
          }
          
          toast.warning(`Solo hay ${availableCount} de ${requiredDomos} domos disponibles para las fechas seleccionadas.`, {
            duration: 6000
          });
        } else if (allAvailable) {
          // Disponibilidad completa
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          
          toast.success(`¡Disponibilidad confirmada! Hay ${availableCount} domos disponibles para tus fechas.`);
        } else {
          // Sin disponibilidad
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          
          // Buscar fechas alternativas donde haya suficientes domos
          if (state.setAlternativeDates) {
            const alternatives = await findAlternativeDates(
              state.startDate, 
              state.endDate, 
              requiredDomos
            );
            state.setAlternativeDates(alternatives);
            
            if (alternatives.length > 0) {
              toast.error(`No hay domos disponibles para las fechas seleccionadas. Encontramos ${alternatives.length} fechas alternativas.`, {
                duration: 6000
              });
            } else {
              toast.error(`No hay domos disponibles (0 de ${requiredDomos}) para las fechas seleccionadas.`);
            }
          }
        }
        
        state.setIsAvailable(allAvailable);
        state.setCheckedAvailability(true);
      } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        toast.error("Ocurrió un error al verificar la disponibilidad. Por favor, inténtalo de nuevo.");
        
        // Establecer valores por defecto en caso de error
        state.setIsAvailable(false);
        state.setCheckedAvailability(true);
        if (state.setAvailableDomos) {
          state.setAvailableDomos(0);
        }
      }
    }
  };

  return {
    checkDatesAvailability,
  };
};
