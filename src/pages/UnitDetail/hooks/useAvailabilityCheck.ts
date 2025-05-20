
import { toast } from "sonner";
import { findAlternativeDates } from "@/hooks/reservations/utils/availabilityChecker";

type AvailabilityState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  checkDetailedAvailability?: (unitId: string, checkIn: Date, checkOut: Date) => Promise<{
    isAvailable: boolean;
    availableUnits: number;
    totalUnits: number;
  }>;
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
        // Verificar disponibilidad detallada utilizando la función mejorada
        let availabilityDetails;
        
        if (state.checkDetailedAvailability) {
          // Usar la nueva función que devuelve información detallada
          availabilityDetails = await state.checkDetailedAvailability(
            state.displayUnit.id,
            state.startDate,
            state.endDate
          );
        } else {
          // Retrocompatibilidad con la función antigua
          const isAvailable = await state.checkAvailability(
            state.displayUnit.id,
            state.startDate,
            state.endDate
          );
          
          availabilityDetails = {
            isAvailable,
            availableUnits: isAvailable ? 4 : 0,
            totalUnits: 4
          };
        }
        
        // Extraer datos de disponibilidad
        const { isAvailable, availableUnits, totalUnits } = availabilityDetails;
        
        // Marcar disponibilidad parcial si corresponde
        const allAvailable = availableUnits >= requiredDomos;
        
        if (availableUnits > 0 && availableUnits < requiredDomos) {
          // Disponibilidad parcial (algunos domos disponibles pero no los suficientes)
          if (state.setPartialAvailability) {
            state.setPartialAvailability(true);
          }
          
          if (state.setAvailableDomos) {
            state.setAvailableDomos(availableUnits);
          }
          
          if (state.setAlternativeDates) {
            const alternatives = await findAlternativeDates(
              state.startDate, 
              state.endDate, 
              requiredDomos
            );
            state.setAlternativeDates(alternatives);
          }
          
          toast.warning(
            `Solo tenemos ${availableUnits} de ${totalUnits} domos disponibles para las fechas seleccionadas.`, 
            { duration: 6000 }
          );
        } else {
          // O todos disponibles o ninguno disponible
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          
          if (state.setAvailableDomos) {
            state.setAvailableDomos(availableUnits);
          }
          
          if (allAvailable) {
            toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios (${availableUnits} de ${totalUnits}).`);
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
                toast.error(`No hay domos disponibles (${availableUnits} de ${totalUnits}) para las fechas seleccionadas.`);
              }
            }
          }
        }
        
        state.setIsAvailable(allAvailable);
        state.setCheckedAvailability(true);
      } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        toast.error("Ocurrió un error al verificar la disponibilidad");
      }
    }
  };

  return {
    checkDatesAvailability,
  };
};
