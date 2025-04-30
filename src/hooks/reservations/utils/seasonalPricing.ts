
/**
 * Define precios base por temporada y cantidad de huéspedes por domo
 */

type SeasonType = 'high' | 'medium' | 'low';

export interface PriceByGuests {
  guests1: number; // Precio para 1 persona
  guests2: number; // Precio para 2 personas
  guests3: number; // Precio para 3 personas
  guests4: number; // Precio para 4 personas
}

export const seasonalPricing: Record<SeasonType, PriceByGuests> = {
  high: {
    guests1: 80000, 
    guests2: 130000,
    guests3: 145000,
    guests4: 160000
  },
  medium: {
    guests1: 70000,
    guests2: 115000,
    guests3: 130000,
    guests4: 145000
  },
  low: {
    guests1: 60000,
    guests2: 100000,
    guests3: 115000,
    guests4: 130000
  }
};

/**
 * Determina la temporada según la fecha
 * @param date Fecha a evaluar
 * @returns Tipo de temporada
 */
export const determineSeason = (date: Date): SeasonType => {
  const month = date.getMonth() + 1; // Los meses en JS van de 0-11
  
  if (month >= 6 && month <= 8) {
    return 'high'; // Temporada alta: junio a agosto
  } else if (month >= 3 && month <= 5) {
    return 'medium'; // Temporada media: marzo a mayo
  } else {
    return 'low'; // Temporada baja: septiembre a febrero
  }
};

/**
 * Obtiene el precio por noche según temporada y número de huéspedes
 */
export const getPriceByGuestsAndSeason = (date: Date, guestCount: number): number => {
  const season = determineSeason(date);
  const pricing = seasonalPricing[season];
  
  if (guestCount <= 0) return 0;
  if (guestCount === 1) return pricing.guests1;
  if (guestCount === 2) return pricing.guests2;
  if (guestCount === 3) return pricing.guests3;
  return pricing.guests4; // 4 o más huéspedes
};
