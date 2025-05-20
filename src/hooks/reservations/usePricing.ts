
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

// Base calculator hook
export const usePriceCalculator = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Función para calcular el precio según las fechas, número de invitados, etc.
  const calculatePrice = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    pets: number = 0
  ) => {
    try {
      setIsLoading(true);
      
      // Obtener las tarifas del domo
      const { data: unitData, error } = await supabase
        .from('glamping_units')
        .select('*')
        .eq('id', unitId)
        .single();
      
      if (error) throw error;
      
      // Cálculo de días
      const msPerDay = 24 * 60 * 60 * 1000;
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(diffTime / msPerDay);
      
      // Obtener la tarifa según la temporada
      const today = new Date();
      const month = today.getMonth() + 1; // Los meses en JS van de 0 a 11
      let season = 'low'; // Temporada baja por defecto (septiembre a febrero)
      
      if (month >= 6 && month <= 8) {
        season = 'high'; // Temporada alta (junio a agosto)
      } else if (month >= 3 && month <= 5) {
        season = 'medium'; // Temporada media (marzo a mayo)
      }
      
      const prices = unitData?.prices || {};
      const baseRate = prices[season] || 150000; // Precio base por noche
      
      // Determinar cantidad de domos necesarios
      const guestsPerDomo = 4;
      const requiredDomos = Math.ceil(guests / guestsPerDomo);
      
      // Calcular precio por noche y precio total
      const pricePerNight = baseRate * requiredDomos;
      const totalPrice = pricePerNight * nights;
      
      // Calcular precio de mascotas si las hay
      const petPrice = (unitData?.pet_price || 25000) * pets;
      
      // Desglose de precios
      const breakdown = [];
      
      // Distribuir huéspedes en domos
      const domoDistribution = [];
      let remainingGuests = guests;
      
      for (let i = 1; i <= requiredDomos; i++) {
        const domoGuests = Math.min(remainingGuests, guestsPerDomo);
        remainingGuests -= domoGuests;
        
        domoDistribution.push({
          number: i,
          guests: domoGuests
        });
        
        breakdown.push({
          description: `Domo ${i}`,
          amount: baseRate * nights,
          domoNumber: i,
          guests: domoGuests
        });
      }
      
      // Agregar mascotas al desglose si hay
      if (pets > 0) {
        breakdown.push({
          description: `Mascotas (${pets})`,
          amount: petPrice
        });
      }
      
      // Crear información de la cotización
      return {
        nights,
        pricePerNight,
        totalPrice: totalPrice + petPrice,
        breakdown,
        requiredDomos,
        domoDistribution,
        season,
        rateDescription: `Tarifa de temporada ${season === 'high' ? 'alta' : season === 'medium' ? 'media' : 'baja'}`
      };
    } catch (error) {
      console.error('Error calculating price:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { calculatePrice, isLoading };
};

// Create the usePricing hook that other files are importing
export const usePricing = () => {
  const { calculatePrice, isLoading } = usePriceCalculator();
  
  // Function to calculate a quote with the same interface as expected by importers
  const calculateQuote = async (unitId: string, checkIn: Date, checkOut: Date, guests: number, pets: number = 0) => {
    return await calculatePrice(unitId, checkIn, checkOut, guests, pets);
  };
  
  return { calculateQuote, calculatePrice, isLoading };
};

// For backward compatibility, we also export usePriceCalculator as calculatePrice
export { usePriceCalculator as calculatePrice };
