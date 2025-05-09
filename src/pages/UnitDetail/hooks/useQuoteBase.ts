
import { useState, useEffect } from "react";
import { Activity, ThemedPackage } from "@/types";
import { GlampingUnit } from "@/lib/supabase";

export interface QuoteState {
  startDate?: Date;
  endDate?: Date;
  guests: number;
  displayUnit: GlampingUnit | null;
  quote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  showQuote: boolean;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean) => void;
  availableDomos?: number;
  requiredDomos?: number;
  calculateQuote: (
    prices: any,
    startDate: Date,
    endDate: Date,
    guests: number,
    requiredDomos: number
  ) => any;
  setReservationTab: (tab: string) => void;
  reservationTab: string;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  activitiesTotal: number;
  packagesTotal: number;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
}

export const useQuoteBase = (state: QuoteState) => {
  // Función que distribuye equitativamente los huéspedes entre los domos
  const distributeGuestsEvenly = (totalGuests: number, numberOfDomos: number) => {
    // Calculamos la distribución base (cantidad mínima por domo)
    const baseDistribution = Math.floor(totalGuests / numberOfDomos);
    
    // Calculamos cuántos huéspedes quedan por distribuir
    let remaining = totalGuests - (baseDistribution * numberOfDomos);
    
    // Creamos el array de distribución
    const distribution = Array(numberOfDomos).fill(baseDistribution);
    
    // Distribuimos los huéspedes restantes uno por uno
    for (let i = 0; i < remaining; i++) {
      distribution[i]++;
    }
    
    // Creamos el objeto de distribución para cada domo
    return distribution.map((guests, index) => ({
      number: index + 1,
      guests
    }));
  };
  
  // Función para actualizar el total de la cotización considerando extras
  const getUpdatedQuoteTotal = () => {
    if (!state.quote) return 0;
    
    const baseQuoteTotal = state.quote.totalPrice;
    return baseQuoteTotal + state.activitiesTotal + state.packagesTotal;
  };

  // Efecto para mantener actualizado el total de actividades
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  useEffect(() => {
    const total = state.selectedActivities.reduce((sum, activity) => {
      return sum + activity.price;
    }, 0);
    setActivitiesTotal(total);
  }, [state.selectedActivities]);

  // Efecto para mantener actualizado el total de paquetes
  const [packagesTotal, setPackagesTotal] = useState(0);
  useEffect(() => {
    const total = state.selectedPackages.reduce((sum, pkg) => {
      return sum + pkg.price;
    }, 0);
    setPackagesTotal(total);
  }, [state.selectedPackages]);

  return {
    getUpdatedQuoteTotal,
    activitiesTotal,
    packagesTotal,
    distributeGuestsEvenly
  };
};
