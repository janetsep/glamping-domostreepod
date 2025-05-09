
import { useCallback } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { findAlternativeDates } from '@/hooks/reservations/utils/availability';
import { ReservationState } from './types';

/**
 * Hook for checking date availability
 */
export const useAvailabilityCheck = (state: ReservationState) => {
  /**
   * Check the availability of selected dates and update state accordingly
   */
  const checkDatesAvailability = useCallback(async () => {
    if (!state.displayUnit?.id || !state.startDate || !state.endDate) {
      console.warn("Missing unit ID, start date, or end date");
      return;
    }

    try {
      console.log(`Verificando disponibilidad para ${state.requiredDomos || 1} domos del ${format(state.startDate, 'yyyy-MM-dd')} al ${format(state.endDate, 'yyyy-MM-dd')}`);
      
      const startDateFormatted = format(state.startDate, 'yyyy-MM-dd');
      const endDateFormatted = format(state.endDate, 'yyyy-MM-dd');

      // En lugar de consultar la tabla unit_availability, consultamos directamente la tabla reservations
      const { data: overlappingReservations, error } = await supabase
        .from('reservations')
        .select('id, unit_id, check_in, check_out')
        .eq('status', 'confirmed')
        .or(`check_in.lte.${new Date(endDateFormatted).toISOString()},check_out.gte.${new Date(startDateFormatted).toISOString()}`);

      if (error) {
        console.error("Error fetching reservations:", error);
        
        // Solo mostrar el mensaje si el usuario ha seleccionado huéspedes
        if (state.guests && state.guests > 0) {
          toast.error("No se pudo verificar la disponibilidad. Por favor, inténtalo de nuevo.", {
            duration: 6000
          });
        }
        
        state.setIsAvailable(true); // Asumimos disponibilidad en caso de error para no bloquear
        state.setCheckedAvailability(true);
        return;
      }

      if (!overlappingReservations || overlappingReservations.length === 0) {
        // No hay reservas en ese rango, hay disponibilidad completa
        console.log("No hay reservas en el rango seleccionado, disponibilidad completa");
        state.setIsAvailable(true);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(4); // Asumimos que hay 4 domos en total disponibles
        state.setAlternativeDates([]);
        state.setCheckedAvailability(true);
        
        // Solo mostrar el mensaje de disponibilidad si el usuario ya ha seleccionado huéspedes
        if (state.guests > 0 && state.requiredDomos && state.requiredDomos > 0) {
          toast.success(`Tenemos disponibilidad para los ${state.requiredDomos} domos necesarios.`);
        }
        return;
      }

      // Verificamos cuántos domos están ocupados en el rango de fechas
      const uniqueReservedUnits = new Set(overlappingReservations.map(r => r.unit_id));
      const reservedCount = uniqueReservedUnits.size;
      const availableDomos = Math.max(0, 4 - reservedCount); // Asumimos que hay 4 domos en total
      const requiredDomos = state.requiredDomos || 1;

      console.log(`Domos reservados: ${reservedCount}, Disponibles: ${availableDomos}, Requeridos: ${requiredDomos}`);
      
      if (availableDomos >= requiredDomos) {
        // Hay suficientes domos disponibles
        state.setIsAvailable(true);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(availableDomos);
        state.setAlternativeDates([]);
        
        // Solo mostrar el mensaje de disponibilidad si el usuario ya ha seleccionado huéspedes
        if (state.guests > 0 && requiredDomos > 0) {
          toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios.`);
        }
      } else if (availableDomos > 0) {
        // Hay disponibilidad parcial
        state.setIsAvailable(false);
        state.setIsPartialAvailability(true);
        state.setAvailableDomos(availableDomos);
        state.setAlternativeDates([]);
        
        // Solo mostrar el mensaje de disponibilidad parcial si el usuario ya ha seleccionado huéspedes
        if (state.guests > 0 && requiredDomos > 0) {
          toast.warning(`Solo tenemos disponibilidad para ${availableDomos} domos en las fechas seleccionadas.`, {
            duration: 6000
          });
        }
      } else {
        // No hay disponibilidad
        state.setIsAvailable(false);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(0);
        
        // Solo buscar fechas alternativas si el usuario ya ha seleccionado huéspedes
        if (state.guests > 0 && requiredDomos > 0) {
          // Intentamos buscar fechas alternativas
          try {
            const alternativeDates = await findAlternativeDates(state.startDate, state.endDate, requiredDomos);
            
            state.setAlternativeDates(alternativeDates);
            console.log(`Se encontraron ${alternativeDates.length} fechas alternativas`);
            
            if (alternativeDates.length > 0) {
              toast.error(`No hay domos disponibles para las fechas seleccionadas. Encontramos ${alternativeDates.length} fechas alternativas.`, {
                duration: 6000
              });
            } else {
              toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
            }
          } catch (error) {
            console.error("Error buscando fechas alternativas:", error);
            state.setAlternativeDates([]);
            toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
          }
        } else {
          // Si el usuario aún no ha seleccionado huéspedes, simplemente actualizamos el estado sin mostrar mensajes
          state.setAlternativeDates([]);
        }
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      
      // Solo mostrar mensaje si el usuario ya ha seleccionado huéspedes
      if (state.guests > 0 && state.requiredDomos && state.requiredDomos > 0) {
        toast.error("Ocurrió un error al verificar la disponibilidad. Por favor, inténtalo de nuevo.", {
          duration: 6000
        });
      }
      
      // Asumimos disponibilidad en caso de error para no bloquear la experiencia del usuario
      state.setIsAvailable(true); 
      state.setIsPartialAvailability(false);
      state.setAvailableDomos(state.requiredDomos || 1);
      state.setAlternativeDates([]);
    } finally {
      state.setCheckedAvailability(true);
    }
  }, [state]);

  return { checkDatesAvailability };
};
