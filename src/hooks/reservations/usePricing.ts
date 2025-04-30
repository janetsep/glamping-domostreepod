
import { useCallback } from 'react';
import { GlampingUnit } from '@/lib/supabase';

export const usePricing = () => {
  const calculateQuote = useCallback((
    unitPrices: GlampingUnit['prices'],
    checkIn: Date,
    checkOut: Date,
    guests: number,
    requiredDomos: number = 1
  ) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = unitPrices.base_price || 120000;
    let pricePerNight;
    
    // Aplicar ajustes de precios según duración de la estadía
    if (nights === 1) {
      // 1 noche: 10% más caro
      pricePerNight = basePrice * 1.1;
    } else if (nights >= 7) {
      // 7 o más noches: 20% de descuento
      pricePerNight = basePrice * 0.8;
    } else {
      // Entre 2 y 6 noches: precio base
      pricePerNight = basePrice;
    }
    
    // Precio base por noche por domo
    const totalNightsPrice = pricePerNight * nights * requiredDomos;
    
    // Preparar el desglose de precios
    const breakdown = [
      { 
        description: `${nights} ${nights === 1 ? 'noche' : 'noches'} x ${requiredDomos} ${requiredDomos === 1 ? 'domo' : 'domos'} x $${Math.round(pricePerNight).toLocaleString()}`,
        amount: totalNightsPrice 
      }
    ];
    
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
      pricePerNight: Math.round(pricePerNight),
      basePrice: Math.round(totalNightsPrice),
      totalPrice: Math.round(totalNightsPrice),
      breakdown,
      rateDescription,
      requiredDomos
    };
  }, []);

  return { calculateQuote };
};
