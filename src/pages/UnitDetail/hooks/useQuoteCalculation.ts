
import { QuoteState } from "./useQuoteBase";
import { toast } from "sonner";

export const useQuoteCalculation = (state: QuoteState) => {
  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    if (state.guests <= 0) {
      toast.error("Por favor selecciona al menos 1 huésped");
      return;
    }

    // Calcular domos requeridos
    const requiredDomos = state.requiredDomos || 1;
    
    // Verificar disponibilidad
    try {
      state.setIsAvailable(false); // Reset
      
      // Verificamos disponibilidad
      const isAvailable = await state.checkAvailability(
        state.displayUnit.id,
        state.startDate,
        state.endDate
      );
      
      // Si no hay disponibilidad, mostramos mensaje y no continuamos
      if (!isAvailable) {
        toast.error("Lo sentimos, no hay disponibilidad para las fechas seleccionadas.");
        state.setIsAvailable(false);
        return;
      }
      
      // Si hay disponibilidad, calculamos la cotización
      state.setIsAvailable(true);
      
      // Calculamos el precio total y la distribución de huéspedes
      if (state.displayUnit && state.displayUnit.prices) {
        // Obtenemos el precio base del domo
        const basePrice = state.displayUnit.prices.base_price || 0;
        
        // Calculamos la cotización
        const quote = state.calculateQuote(
          state.displayUnit.prices,
          state.startDate,
          state.endDate,
          state.guests,
          requiredDomos
        );
        
        // Al quote le agregamos las propiedades para actividades y paquetes
        const quoteWithExtras = {
          ...quote,
          basePrice,
          requiredDomos,
        };
        
        // Guardamos la cotización y mostramos el resumen
        state.setQuote(quoteWithExtras);
        state.setShowQuote(true);
        state.setReservationTab("summary");
      }
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      toast.error("Hubo un error al verificar la disponibilidad. Por favor, inténtelo de nuevo.");
    }
  };

  return { checkAvailabilityAndQuote };
};
