
import { useCallback } from 'react';
import { GlampingUnit } from '@/lib/supabase';

export const usePricing = () => {
  const calculateQuote = useCallback((
    unitPrices: GlampingUnit['prices'],
    checkIn: Date,
    checkOut: Date,
    guests: number
  ) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = unitPrices.base_price || 120000;
    let totalNightsPrice;
    
    // Aplicar ajustes de precios según duración de la estadía
    if (nights === 1) {
      // 1 noche: 10% más caro
      totalNightsPrice = basePrice * 1.1;
    } else if (nights >= 7) {
      // 7 o más noches: 20% de descuento
      totalNightsPrice = basePrice * 0.8;
    } else {
      // Entre 2 y 6 noches: precio base
      totalNightsPrice = basePrice;
    }
    
    // Multiplicar por el número de noches
    totalNightsPrice = totalNightsPrice * nights;
    
    // Precio por persona adicional más allá de 2
    const extraGuestPrice = (guests > 2) ? (guests - 2) * (basePrice * 0.15) * nights : 0;
    
    // Sumar precios
    const finalPrice = totalNightsPrice + extraGuestPrice;
    
    // Preparar el desglose de precios
    const breakdown = [
      { 
        description: `${nights} ${nights === 1 ? 'noche' : 'noches'} x $${Math.round(totalNightsPrice / nights).toLocaleString()}`,
        amount: totalNightsPrice 
      }
    ];
    
    // Agregar cargo por huéspedes adicionales si aplica
    if (extraGuestPrice > 0) {
      breakdown.push({
        description: `${guests - 2} ${guests - 2 === 1 ? 'huésped adicional' : 'huéspedes adicionales'}`,
        amount: extraGuestPrice
      });
    }
    
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
      pricePerNight: Math.round(totalNightsPrice / nights),
      basePrice: basePrice * nights,
      totalPrice: Math.round(finalPrice),
      breakdown,
      rateDescription
    };
  }, []);

  return { calculateQuote };
};
