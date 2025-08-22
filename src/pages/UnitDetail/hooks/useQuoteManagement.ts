
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
      displayUnit.id === 'aniversarios-package' ||
      displayUnit.id === 'fiesta-familiar-package' ||
      displayUnit.id === 'fiestas-patrias-package' ||
      displayUnit.id === 'navidad-package' ||
      displayUnit.id === 'ano-nuevo-package' ||
      displayUnit.id === '4'
    );

    // Obtener precio base del paquete
    const getPackagePrice = (packageId: string) => {
      switch (packageId) {
        case 'mujeres-relax-package': return 520000;
        case 'cumpleanos-package': return 580000;
        case 'aniversarios-package': return 650000;
        case 'fiesta-familiar-package': return 550000;
        case 'fiestas-patrias-package': return 580000;
        case 'navidad-package': return 650000;
        case 'ano-nuevo-package': return 680000;
        case '4': return 450000; // Exclusividad total
        default: return 520000;
      }
    };

    if (isCelebrationPackage) {
      // Para paquetes de celebración: precio fijo por domo, multiplicado por número de domos
      console.log('🎉 [useQuoteManagement] Paquete de celebración detectado');
      
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const basePrice = getPackagePrice(displayUnit.id);
      
      // Determinar duración del paquete (por defecto 2 días/noches)
      const packageDuration = 2;
      
      // Calcular días extras si los hay
      const extraNights = Math.max(0, nights - packageDuration);
      const extraNightPrice = 80000; // Precio por noche extra (solo desayuno)
      const extraNightsTotal = extraNights * extraNightPrice * requiredDomos;
      
      const totalPrice = (basePrice * requiredDomos) + extraNightsTotal;
      
      // Crear breakdown detallado
      const breakdown = [
        {
          description: `${packageDuration} noches - Paquete ${displayUnit.name}`,
          amount: basePrice * requiredDomos,
          nights: packageDuration,
          domoNumber: requiredDomos,
          guests: requiredDomos * 4 // Estimado
        }
      ];
      
      // Agregar línea de días extras si aplica
      if (extraNights > 0) {
        breakdown.push({
          description: `${extraNights} ${extraNights === 1 ? 'noche extra' : 'noches extras'} (solo desayuno)`,
          amount: extraNightsTotal,
          nights: extraNights,
          domoNumber: requiredDomos,
          guests: 0
        });
      }
      
      const quoteDetails = {
        unitPrice: basePrice,
        totalPrice: totalPrice,
        pricePerNight: Math.round(totalPrice / nights),
        checkIn: startDate,
        checkOut: endDate,
        nights,
        guests,
        requiredDomos: requiredDomos,
        breakdown: breakdown,
        rateDescription: extraNights > 0 ? 
          `Incluye ${packageDuration} noches del paquete completo + ${extraNights} ${extraNights === 1 ? 'noche extra' : 'noches extras'} con desayuno` :
          `${packageDuration} noches - Experiencia completa`,
        extraNights: extraNights,
        packageDuration: packageDuration,
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
