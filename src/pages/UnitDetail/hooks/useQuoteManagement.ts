
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

    try {
      const quoteDetails = calculateQuote(
        displayUnit.prices,
        startDate,
        endDate,
        guests,
        requiredDomos
      );
      
      console.log('🔍 [useQuoteManagement] Cotización generada:', quoteDetails);
      
      setQuote(quoteDetails);
      setShowQuote(true);
    } catch (error) {
      console.error('❌ [useQuoteManagement] Error generando cotización:', error);
    }
  };

  const confirmReservation = () => {
    console.log('🔍 [useQuoteManagement] confirmReservation - manteniendo estado de cotización para pago');
    // NO cambiar isReservationConfirmed aquí, eso se hará después del pago exitoso
  };

  return {
    showQuote,
    quote,
    setShowQuote,
    setQuote,
    generateQuote,
    confirmReservation
  };
};
