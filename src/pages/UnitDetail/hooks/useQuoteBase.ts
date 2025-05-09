
// Importing necessary types
import { Activity, ThemedPackage } from '@/types';
import { GlampingUnit } from '@/lib/supabase';

// Define the quote state structure
export interface QuoteState {
  showQuote: boolean;
  setShowQuote: (show: boolean) => void;
  quote: {
    nights: number;
    pricePerNight: number;
    totalPrice: number;
    basePrice?: number;
    breakdown: {
      description: string;
      amount: number;
      guests?: number;
      domoNumber?: number;
    }[];
    rateDescription?: string;
    requiredDomos?: number;
    domoDistribution?: {
      domoNumber: number;
      guests: number;
    }[];
    season?: 'high' | 'low' | 'medium';
  } | null;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  
  // Added properties needed by useQuoteCalculation
  startDate?: Date;
  endDate?: Date;
  guests: number;
  displayUnit?: GlampingUnit;
  requiredDomos?: number;
  setQuote: (quote: any) => void;
  setIsAvailable: (available: boolean) => void;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
  calculateQuote: (prices: any, checkIn: Date, checkOut: Date, guests: number, requiredDomos: number) => any;
}

// Basic quote state initialization
export const initialQuoteState: Partial<QuoteState> = {
  showQuote: false,
  quote: null,
  selectedActivities: [],
  selectedPackages: [],
  activitiesTotal: 0,
  packagesTotal: 0,
  reservationTab: 'dates',
  guests: 1
};

// Add the useQuoteBase function that's imported in useQuoteManagement
export const useQuoteBase = (state: QuoteState) => {
  const getUpdatedQuoteTotal = () => {
    if (!state.quote) return 0;
    
    // Calculate total price based on base price plus extras
    const basePrice = state.quote.basePrice || state.quote.totalPrice;
    const extrasTotal = state.activitiesTotal + state.packagesTotal;
    return basePrice + extrasTotal;
  };
  
  return {
    getUpdatedQuoteTotal
  };
};
