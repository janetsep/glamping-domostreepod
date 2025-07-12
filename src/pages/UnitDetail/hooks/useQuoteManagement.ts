
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
      displayUnit: !!displayUnit,
      unitId: displayUnit?.id
    });

    if (!startDate || !endDate || !displayUnit) {
      console.error('❌ [useQuoteManagement] Faltan datos para generar cotización');
      return;
    }

    // Detectar si es un paquete de celebración
    const isCelebrationPackage = displayUnit.id && (
      displayUnit.id.includes('package') || 
      displayUnit.id === 'mujeres-relax-package' ||
      displayUnit.id === 'cumpleanos-package' ||
      displayUnit.id === 'aniversario-package' ||
      displayUnit.id === 'familia-package'
    );

    if (isCelebrationPackage) {
      // Para paquetes de celebración: precio fijo por domo, no por persona
      console.log('🎉 [useQuoteManagement] Paquete de celebración detectado');
      
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const basePrice = displayUnit.prices?.base_price || 0;
      
      const quoteDetails = {
        unitPrice: basePrice,
        totalPrice: basePrice, // Precio fijo por domo
        checkIn: startDate,
        checkOut: endDate,
        nights,
        guests,
        requiredDomos: 1, // Los paquetes de celebración son por domo
        breakdown: {
          basePrice: basePrice,
          nights: nights,
          unitPrice: basePrice,
          totalPrice: basePrice
        },
        isCelebrationPackage: true
      };
      
      console.log('🔍 [useQuoteManagement] Cotización de paquete generada:', quoteDetails);
      setQuote(quoteDetails);
      setShowQuote(true);
      return;
    }

    // Lógica normal para unidades regulares
    const calculatedRequiredDomos = Math.ceil(guests / 4);
    const finalRequiredDomos = Math.max(calculatedRequiredDomos, 1);

    console.log('🔍 [useQuoteManagement] Calculando domos requeridos para unidad regular:', {
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
        finalRequiredDomos
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
