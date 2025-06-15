
import { useState } from "react";
import { usePricing } from "@/hooks/reservations/usePricing";
import { GlampingUnit } from "@/lib/supabase";

export const useQuoteManagement = () => {
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const { calculateQuote } = usePricing();

  const generateQuote = (
    displayUnit: GlampingUnit | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
    guests: number,
    requiredDomos: number
  ) => {
    console.log('🔍 [useQuoteManagement] generateQuote llamado:', {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      guests,
      requiredDomos,
      displayUnit: !!displayUnit
    });

    if (!startDate || !endDate || !displayUnit) {
      console.error('❌ [useQuoteManagement] Faltan datos para generar cotización');
      return;
    }

    // Calcular el número correcto de domos basado en huéspedes
    const calculatedRequiredDomos = Math.ceil(guests / 4);
    const finalRequiredDomos = Math.max(calculatedRequiredDomos, 1);

    console.log('🔍 [useQuoteManagement] Calculando domos requeridos:', {
      huéspedes: guests,
      domosCalculados: calculatedRequiredDomos,
      domosFinales: finalRequiredDomos,
      domosParametro: requiredDomos
    });

    try {
      const quoteDetails = calculateQuote(
        displayUnit.prices,
        startDate,
        endDate,
        guests,
        finalRequiredDomos // Usar el cálculo correcto
      );
      
      console.log('🔍 [useQuoteManagement] Cotización generada:', quoteDetails);
      
      setQuote(quoteDetails);
      setShowQuote(true);
    } catch (error) {
      console.error('❌ [useQuoteManagement] Error generando cotización:', error);
    }
  };

  return {
    showQuote,
    quote,
    setShowQuote,
    setQuote,
    generateQuote
  };
};
