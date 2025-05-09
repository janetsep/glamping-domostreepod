
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
  guests?: number;
};

export const useAvailabilityCheck = (state: AvailabilityState) => {
  const checkDatesAvailability = async () => {
    // Solo verificamos disponibilidad si hay fechas y unidad seleccionadas
    if (state.startDate && state.endDate && state.displayUnit && !state.checkedAvailability) {
      const requiredDomos = state.requiredDomos || 1;
      
      try {
        // Suponer disponibilidad inicial
        let availableDomos = 4; // TOTAL_DOMOS de availabilityChecker.ts
        
        // Verificar disponibilidad general en lugar de por domo individual
        try {
          const { data, error } = await import('@/hooks/reservations/utils/availabilityChecker')
            .then(module => module.checkGeneralAvailability(state.startDate!, state.endDate!));
            
          if (!error) {
            availableDomos = data?.availableUnits || 4;
          }
        } catch (error) {
          console.error('Error al verificar disponibilidad general:', error);
          // En caso de error, asumimos disponibilidad completa
          availableDomos = 4;
        }
        
        console.log(`Domos requeridos: ${requiredDomos}, Domos disponibles: ${availableDomos}`);
        
        // Determinar si hay disponibilidad total, parcial o ninguna
        if (availableDomos >= requiredDomos) {
          // Hay disponibilidad completa
          state.setIsAvailable(true);
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          if (state.setAvailableDomos) {
            state.setAvailableDomos(availableDomos);
          }
          if (state.setAlternativeDates) {
            state.setAlternativeDates([]);
          }
          
          // Solo mostrar mensaje si el usuario ha seleccionado huéspedes
          if (state.guests && state.guests > 0) {
            toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios.`);
          }
        } 
        else if (availableDomos > 0) {
          // Hay disponibilidad parcial
          state.setIsAvailable(false);
          if (state.setPartialAvailability) {
            state.setPartialAvailability(true);
          }
          if (state.setAvailableDomos) {
            state.setAvailableDomos(availableDomos);
          }
          
          // Solo mostrar mensaje si el usuario ha seleccionado huéspedes
          if (state.guests && state.guests > 0) {
            toast.warning(`Solo tenemos disponibilidad para ${availableDomos} domos en las fechas seleccionadas.`, {
              duration: 6000
            });
            
            // Buscar fechas alternativas
            try {
              if (state.setAlternativeDates) {
                const alternatives = await findAlternativeDates(
                  state.startDate, 
                  state.endDate, 
                  requiredDomos
                );
                state.setAlternativeDates(alternatives);
                console.log("Fechas alternativas encontradas:", alternatives.length);
              }
            } catch (error) {
              console.error('Error al buscar fechas alternativas:', error);
              if (state.setAlternativeDates) {
                state.setAlternativeDates([]);
              }
            }
          }
        } 
        else {
          // No hay disponibilidad
          state.setIsAvailable(false);
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          if (state.setAvailableDomos) {
            state.setAvailableDomos(0);
          }
          
          // Solo mostrar mensaje y buscar alternativas si el usuario ha seleccionado huéspedes
          if (state.guests && state.guests > 0) {
            try {
              if (state.setAlternativeDates) {
                const alternatives = await findAlternativeDates(
                  state.startDate, 
                  state.endDate, 
                  requiredDomos
                );
                state.setAlternativeDates(alternatives);
                console.log("Fechas alternativas encontradas:", alternatives.length);
                
                if (alternatives.length > 0) {
                  toast.error(`No hay domos disponibles para las fechas seleccionadas. Encontramos ${alternatives.length} fechas alternativas.`, {
                    duration: 6000
                  });
                } else {
                  toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
                }
              }
            } catch (error) {
              console.error('Error al buscar fechas alternativas:', error);
              if (state.setAlternativeDates) {
                state.setAlternativeDates([]);
              }
              toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
            }
          }
        }
      } catch (error) {
        console.error('Error general en checkDatesAvailability:', error);
        
        // En caso de error general, asumimos disponibilidad para no bloquear la experiencia
        state.setIsAvailable(true);
        if (state.setPartialAvailability) {
          state.setPartialAvailability(false);
        }
        if (state.setAvailableDomos) {
          state.setAvailableDomos(requiredDomos);
        }
        if (state.setAlternativeDates) {
          state.setAlternativeDates([]);
        }
        
        // Solo mostrar mensaje si el usuario ya ha seleccionado huéspedes
        if (state.guests && state.guests > 0) {
          toast.warning('No pudimos verificar la disponibilidad exacta. Por favor, contacta con nosotros para confirmar tu reserva.', {
            duration: 6000
          });
        }
      } finally {
        state.setCheckedAvailability(true);
      }
    }
  };

  return {
    checkDatesAvailability,
  };
};
