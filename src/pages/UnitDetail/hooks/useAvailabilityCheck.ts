
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
      
      let allAvailable = true;
      let availableCount = 0;
      
      // Verificar disponibilidad para cada domo requerido
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
      
      // Si hay algún domo disponible pero no todos los necesarios
      if (availableCount > 0 && availableCount < requiredDomos) {
        allAvailable = false;
        
        // Marcar como disponibilidad parcial
        if (state.setPartialAvailability) {
          state.setPartialAvailability(true);
        }
        
        // Guardar el número de domos disponibles
        if (state.setAvailableDomos) {
          state.setAvailableDomos(availableCount);
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
      } else {
        // O todos disponibles o ninguno disponible
        allAvailable = availableCount === requiredDomos;
        
        if (state.setPartialAvailability) {
          state.setPartialAvailability(false);
        }
        
        if (state.setAvailableDomos) {
          state.setAvailableDomos(availableCount);
        }
        
        if (allAvailable) {
          toast.success(`¡Disponibilidad confirmada! Hay ${availableCount} domos disponibles para tus fechas.`);
        } else {
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
      }
      
      state.setIsAvailable(allAvailable);
      state.setCheckedAvailability(true);
      
      // Debemos retornar explícitamente la cantidad de domos disponibles
      if (state.setAvailableDomos) {
        state.setAvailableDomos(availableCount);
      }
    }
  };

  return {
    checkDatesAvailability,
  };
};
