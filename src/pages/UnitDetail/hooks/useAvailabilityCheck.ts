import { toast } from "sonner";
import { findAlternativeDates } from "@/hooks/reservations/utils/availabilityChecker";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker/checkGeneralAvailability";

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
      
      console.log('🔍 useAvailabilityCheck: Verificando disponibilidad para:', {
        startDate: state.startDate.toISOString().split('T')[0],
        endDate: state.endDate.toISOString().split('T')[0],
        requiredDomos,
        unitId: state.displayUnit.id
      });
      
      try {
        // CORRECCIÓN: Usar checkGeneralAvailability en lugar del loop incorrecto
        const { isAvailable, availableUnits, error } = await checkGeneralAvailability(
          state.startDate,
          state.endDate,
          requiredDomos
        );

        console.log('🔍 useAvailabilityCheck: Resultado de checkGeneralAvailability:', {
          isAvailable,
          availableUnits,
          error
        });

        if (error) {
          console.error('❌ Error al verificar disponibilidad:', error);
          toast.error('Error al verificar disponibilidad. Por favor, inténtalo de nuevo.');
          return;
        }

        // Actualizar el estado con el número real de domos disponibles
        if (state.setAvailableDomos) {
          state.setAvailableDomos(availableUnits);
          console.log('🔍 useAvailabilityCheck: setAvailableDomos llamado con:', availableUnits);
        }

        // Verificar si hay disponibilidad parcial (algunos domos, pero no suficientes)
        if (availableUnits > 0 && availableUnits < requiredDomos) {
          // Disponibilidad parcial
          if (state.setPartialAvailability) {
            state.setPartialAvailability(true);
          }
          
          // Buscar fechas alternativas
          if (state.setAlternativeDates) {
            const alternatives = await findAlternativeDates(
              state.startDate, 
              state.endDate, 
              requiredDomos
            );
            state.setAlternativeDates(alternatives);
          }
          
          toast.warning(
            `Solo hay ${availableUnits} de 4 domos disponibles. Necesitas ${requiredDomos} para tu reserva.`, 
            { duration: 6000 }
          );
          
          state.setIsAvailable(false);
        } else {
          // O todos disponibles o ninguno disponible
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          
          if (isAvailable) {
            toast.success(`¡Disponibilidad confirmada! Hay ${availableUnits} domos disponibles para tus fechas.`);
            state.setIsAvailable(true);
          } else {
            // No hay domos disponibles
            if (state.setAlternativeDates) {
              const alternatives = await findAlternativeDates(
                state.startDate, 
                state.endDate, 
                requiredDomos
              );
              state.setAlternativeDates(alternatives);
              
              if (alternatives.length > 0) {
                toast.error(
                  `No hay domos disponibles para las fechas seleccionadas. Encontramos ${alternatives.length} fechas alternativas.`, 
                  { duration: 6000 }
                );
              } else {
                toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
              }
            }
            state.setIsAvailable(false);
          }
        }
        
        state.setCheckedAvailability(true);
        
        console.log('🔍 useAvailabilityCheck: Estado final actualizado:', {
          isAvailable,
          availableUnits,
          checkedAvailability: true
        });
        
      } catch (error) {
        console.error('❌ Error en useAvailabilityCheck:', error);
        toast.error('Error al verificar disponibilidad. Por favor, inténtalo de nuevo.');
        state.setIsAvailable(false);
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