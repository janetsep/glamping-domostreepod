
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { QuoteState } from "./useQuoteBase";

export const useQuoteCalculation = (state: QuoteState) => {
  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const requiredDomos = state.requiredDomos || 1;
    
    // Verificamos si hay suficientes domos disponibles
    if (state.availableDomos !== undefined && requiredDomos > state.availableDomos) {
      toast.error("No hay suficientes domos disponibles para las fechas seleccionadas");
      return;
    }
    
    // Distribución equitativa de huéspedes entre los domos
    const baseDistribution = Math.floor(state.guests / requiredDomos);
    const remaining = state.guests - (baseDistribution * requiredDomos);
    
    // Creamos el desglose de precios para cada domo
    const breakdown = [];
    let totalPrice = 0;
    
    for (let i = 0; i < requiredDomos; i++) {
      // Calculamos los huéspedes para este domo
      const domoGuests = i < remaining ? baseDistribution + 1 : baseDistribution;
      
      // Calculamos el precio para este domo
      const domoQuote = state.calculateQuote(
        state.displayUnit.prices,
        state.startDate,
        state.endDate,
        domoGuests,
        1 // Aquí es 1 porque estamos calculando el precio por domo individual
      );
      
      // Añadimos el desglose para este domo
      breakdown.push({
        description: `Domo ${i + 1}${domoGuests > 0 ? ': ' + domoGuests + (domoGuests === 1 ? ' persona' : ' personas') : ''}`,
        amount: domoQuote.basePrice,
        guests: domoGuests,
        domoNumber: i + 1
      });
      
      // Acumulamos el precio total
      totalPrice += domoQuote.basePrice;
    }
    
    // Creamos la distribución por domo para mostrar en el resumen
    const domoDistribution = Array(requiredDomos).fill(0).map((_, i) => ({
      number: i + 1,
      guests: i < remaining ? baseDistribution + 1 : baseDistribution
    }));
    
    // Construimos el objeto de cotización completo
    let quoteDetails = {
      nights: Math.ceil((state.endDate.getTime() - state.startDate.getTime()) / (1000 * 60 * 60 * 24)),
      basePrice: totalPrice,
      pricePerNight: totalPrice / Math.ceil((state.endDate.getTime() - state.startDate.getTime()) / (1000 * 60 * 60 * 24)),
      totalPrice: totalPrice,
      breakdown: breakdown,
      requiredDomos: requiredDomos,
      domoDistribution: domoDistribution
    };
    
    // Añadimos el precio de actividades y paquetes si están seleccionados
    if (state.selectedActivities.length > 0 || state.selectedPackages.length > 0) {
      quoteDetails = {
        ...quoteDetails,
        activitiesTotal: state.activitiesTotal,
        packagesTotal: state.packagesTotal,
        totalPrice: totalPrice + state.activitiesTotal + state.packagesTotal,
        selectedActivities: state.selectedActivities,
        selectedPackages: state.selectedPackages
      };
    }
    
    state.setQuote(quoteDetails);
    state.setShowQuote(true);
    state.setReservationTab("summary");
  };

  return {
    checkAvailabilityAndQuote
  };
};
