
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { QuoteState } from "./useQuoteBase";
import { usePricing } from "@/hooks/reservations/usePricing";

export const useQuoteCalculation = (state: QuoteState) => {
  const { calculateQuote } = usePricing();

  const checkAvailabilityAndQuote = async () => {
    console.log('🔍 [useQuoteCalculation] Iniciando cálculo de cotización:', {
      startDate: state.startDate?.toISOString(),
      endDate: state.endDate?.toISOString(),
      guests: state.guests,
      requiredDomos: state.requiredDomos,
      displayUnit: !!state.displayUnit
    });

    if (!state.startDate || !state.endDate || !state.displayUnit) {
      console.error('❌ [useQuoteCalculation] Faltan datos requeridos para cotización');
      return;
    }

    // Calcular el número correcto de domos requeridos basado en huéspedes
    const calculatedRequiredDomos = Math.ceil(state.guests / 4);
    const finalRequiredDomos = Math.max(calculatedRequiredDomos, 1);

    console.log('🔍 [useQuoteCalculation] Cálculo de domos requeridos:', {
      huéspedes: state.guests,
      domosCalculados: calculatedRequiredDomos,
      domosFinales: finalRequiredDomos,
      domosDisponibles: state.availableDomos
    });

    // Verificar que tengamos suficientes domos disponibles
    if (state.availableDomos && state.availableDomos < finalRequiredDomos) {
      console.error('❌ [useQuoteCalculation] No hay suficientes domos disponibles:', {
        requeridos: finalRequiredDomos,
        disponibles: state.availableDomos
      });
      toast.error(`No hay suficientes domos disponibles. Se necesitan ${finalRequiredDomos} domos, pero solo hay ${state.availableDomos} disponibles.`);
      return;
    }

    try {
      let quoteDetails = calculateQuote(
        state.displayUnit.prices,
        state.startDate,
        state.endDate,
        state.guests,
        finalRequiredDomos // Usar el número correcto de domos
      );
      
      console.log('🔍 [useQuoteCalculation] Cotización base calculada:', quoteDetails);
      
      // Agregar los domos requeridos al detalle de la cotización
      quoteDetails.requiredDomos = finalRequiredDomos;
      
      // Agregar extras si están seleccionados
      if (state.selectedActivities.length > 0 || state.selectedPackages.length > 0) {
        const totalWithExtras = quoteDetails.totalPrice + state.activitiesTotal + state.packagesTotal;
        
        quoteDetails = {
          ...quoteDetails,
          totalPrice: totalWithExtras
        };
        
        console.log('🔍 [useQuoteCalculation] Cotización con extras:', {
          basePrice: quoteDetails.totalPrice - state.activitiesTotal - state.packagesTotal,
          activitiesTotal: state.activitiesTotal,
          packagesTotal: state.packagesTotal,
          finalTotal: totalWithExtras
        });
      }
      
      console.log('🔍 [useQuoteCalculation] Cotización final:', quoteDetails);
      
      state.setQuote(quoteDetails);
      state.setShowQuote(true);
      state.setReservationTab("summary");
      
      console.log('✅ [useQuoteCalculation] Cotización establecida correctamente');
    } catch (error) {
      console.error('❌ [useQuoteCalculation] Error al calcular cotización:', error);
      toast.error("Error al calcular la cotización. Por favor intenta nuevamente.");
    }
  };

  return {
    checkAvailabilityAndQuote
  };
};
