
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
  // Añadir la propiedad guests para controlar los mensajes
  guests?: number;
};

export const useAvailabilityCheck = (state: AvailabilityState) => {
  const checkDatesAvailability = async () => {
    if (state.startDate && state.endDate && state.displayUnit && !state.checkedAvailability) {
      const requiredDomos = state.requiredDomos || 1;
      
      try {
        let allAvailable = true;
        let availableCount = 0;
        
        // Verificar disponibilidad para cada domo requerido
        for (let i = 0; i < requiredDomos; i++) {
          try {
            const available = await state.checkAvailability(
              state.displayUnit.id,
              state.startDate,
              state.endDate
            );
            if (available) {
              availableCount++;
            }
          } catch (error) {
            console.error(`Error al verificar disponibilidad para domo ${i}:`, error);
            // En caso de error al verificar la disponibilidad, asumimos que el domo está disponible
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
          // Solo mostrar mensajes si el usuario ha seleccionado huéspedes
          if (state.guests && state.guests > 0) {
            try {
              if (state.setAlternativeDates) {
                const alternatives = await findAlternativeDates(
                  state.startDate, 
                  state.endDate, 
                  requiredDomos
                );
                state.setAlternativeDates(alternatives);
              }
            } catch (error) {
              console.error('Error al buscar fechas alternativas:', error);
              // Si falla la búsqueda de fechas alternativas, dejamos la lista vacía
              if (state.setAlternativeDates) {
                state.setAlternativeDates([]);
              }
            }
            
            // Solo mostrar mensaje si el usuario ya ha seleccionado huéspedes
            toast.warning(`Solo tenemos disponibilidad para ${availableCount} domos en las fechas seleccionadas.`, {
              duration: 6000
            });
          }
        } else {
          // O todos disponibles o ninguno disponible
          allAvailable = availableCount === requiredDomos;
          
          if (state.setPartialAvailability) {
            state.setPartialAvailability(false);
          }
          
          if (state.setAvailableDomos) {
            state.setAvailableDomos(availableCount);
          }
          
          // Solo mostrar mensajes si el usuario ha seleccionado huéspedes
          if (state.guests && state.guests > 0) {
            if (allAvailable) {
              toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios.`);
            } else {
              // Buscar fechas alternativas donde haya suficientes domos
              try {
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
        }
        
        state.setIsAvailable(allAvailable);
      } catch (error) {
        console.error('Error general en checkDatesAvailability:', error);
        // En caso de error general, asumimos que hay disponibilidad para no bloquear la experiencia del usuario
        state.setIsAvailable(true);
        if (state.setPartialAvailability) {
          state.setPartialAvailability(false);
        }
        if (state.setAvailableDomos) {
          state.setAvailableDomos(requiredDomos);
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
