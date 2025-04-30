
import { useCallback } from 'react';
import { GlampingUnit } from '@/lib/supabase';
import { getPriceByGuestsAndSeason, determineSeason } from './utils/seasonalPricing';

export const usePricing = () => {
  const calculateQuote = useCallback((
    unitPrices: GlampingUnit['prices'],
    checkIn: Date,
    checkOut: Date,
    guests: number,
    requiredDomos: number = 1
  ) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const season = determineSeason(checkIn);
    let totalNightsPrice = 0;
    let breakdown = [];
    
    // Generar distribución de huéspedes por domo
    const domoDistribution = generateDomoDistribution(guests, requiredDomos);
    
    // Calcular precio por cada domo según distribución de huéspedes
    for (const domo of domoDistribution) {
      const priceForThisDomo = getPriceByGuestsAndSeason(checkIn, domo.guests);
      
      // Aplicar ajustes de precios según duración de la estadía
      let adjustedPrice = priceForThisDomo;
      if (nights === 1) {
        // 1 noche: 10% más caro
        adjustedPrice = priceForThisDomo * 1.1;
      } else if (nights >= 7) {
        // 7 o más noches: 20% de descuento
        adjustedPrice = priceForThisDomo * 0.8;
      }
      
      // Multiplicar por el número de noches
      const domoTotalPrice = adjustedPrice * nights;
      totalNightsPrice += domoTotalPrice;
      
      breakdown.push({
        description: `Domo ${domo.number}: ${domo.guests} ${domo.guests === 1 ? 'persona' : 'personas'} x ${nights} ${nights === 1 ? 'noche' : 'noches'} x $${Math.round(adjustedPrice).toLocaleString()}`,
        amount: domoTotalPrice,
        guests: domo.guests,
        domoNumber: domo.number
      });
    }
    
    // Agregar línea resumen al principio del desglose
    breakdown.unshift({
      description: `${nights} ${nights === 1 ? 'noche' : 'noches'} x ${requiredDomos} ${requiredDomos === 1 ? 'domo' : 'domos'}`,
      amount: totalNightsPrice,
      guests: guests,
      domoNumber: 0
    });
    
    // Aplicar mensajes descriptivos según duración
    let rateDescription = "";
    if (nights === 1) {
      rateDescription = "Tarifa para 1 noche (+10%)";
    } else if (nights >= 7) {
      rateDescription = "Tarifa semanal (20% descuento)";
    } else {
      rateDescription = "Tarifa estándar";
    }
    
    return {
      nights,
      pricePerNight: totalNightsPrice / nights,
      basePrice: Math.round(totalNightsPrice),
      totalPrice: Math.round(totalNightsPrice),
      breakdown,
      rateDescription,
      requiredDomos,
      domoDistribution,
      season
    };
  }, []);

  return { calculateQuote };
};

/**
 * Distribuye los huéspedes entre los domos
 */
const generateDomoDistribution = (guests: number, requiredDomos: number) => {
  // Si solo hay un domo, todos los huéspedes van ahí
  if (requiredDomos === 1) {
    return [{ number: 1, guests: guests }];
  }

  // Si hay múltiples domos, distribuimos los huéspedes
  const distribution = [];
  let remainingGuests = guests;
  const maxGuestsPerDomo = 4;

  for (let i = 1; i <= requiredDomos; i++) {
    const domoGuests = Math.min(remainingGuests, maxGuestsPerDomo);
    distribution.push({ number: i, guests: domoGuests });
    remainingGuests -= domoGuests;
    
    if (remainingGuests <= 0) break;
  }

  return distribution;
};
