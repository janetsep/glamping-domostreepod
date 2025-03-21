
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { QuoteState } from "./useQuoteBase";
import { isExclusivityPackage, calculateExclusivityPackagePrice } from "@/hooks/reservations/utils/priceCalculator";

export const useQuoteCalculation = (state: QuoteState) => {
  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const requiredDomos = state.requiredDomos || 1;
    
    // Validar que haya al menos un adulto por domo requerido
    if (state.adults < requiredDomos) {
      toast.error(`Se necesitan ${requiredDomos} domos. Debe haber al menos ${requiredDomos} adultos (uno por domo).`);
      return;
    }
    
    // Validar que si hay 16 huéspedes, al menos 4 sean adultos
    if (state.guests === 16 && (state.adults || 0) < 4) {
      toast.error("Para 16 huéspedes, se requieren al menos 4 adultos (uno por domo).");
      return;
    }

    let quoteDetails = state.calculateQuote(
      state.displayUnit.prices,
      state.startDate,
      state.endDate,
      state.guests
    );

    // Si es el paquete de exclusividad total, manejar el cálculo de forma diferente
    if (isExclusivityPackage(state.displayUnit.id)) {
      const packageBasePrice = 450000; // Precio base del paquete de exclusividad
      const nights = Math.ceil((state.endDate.getTime() - state.startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const totalPrice = calculateExclusivityPackagePrice(packageBasePrice, nights);
      
      quoteDetails = {
        ...quoteDetails,
        basePrice: totalPrice,
        totalPrice: totalPrice,
        nights: nights,
        pricePerNight: totalPrice / nights,
        breakdown: [
          {
            description: `${nights} ${nights === 1 ? 'noche' : 'noches'} de exclusividad total`,
            amount: totalPrice
          }
        ],
        rateDescription: nights <= 2 ? "Paquete de exclusividad (2 noches)" : "Paquete de exclusividad con noches adicionales",
        isExclusivityPackage: true
      };
    } else {
      // Cálculo normal para otros paquetes
      quoteDetails.basePrice = quoteDetails.basePrice * requiredDomos;
      quoteDetails.totalPrice = quoteDetails.totalPrice * requiredDomos;
      quoteDetails.requiredDomos = requiredDomos;
    }
    
    if (state.selectedActivities.length > 0 || state.selectedPackages.length > 0) {
      const totalWithExtras = quoteDetails.totalPrice + state.activitiesTotal + state.packagesTotal;
      
      quoteDetails = {
        ...quoteDetails,
        totalPrice: totalWithExtras
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
