
// Importing necessary types
import { Activity, ThemedPackage } from '@/types';

// Define the quote state structure
export interface QuoteState {
  showQuote: boolean;
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
}

// Basic quote state initialization
export const initialQuoteState: QuoteState = {
  showQuote: false,
  quote: null,
  selectedActivities: [],
  selectedPackages: [],
  activitiesTotal: 0,
  packagesTotal: 0,
  reservationTab: 'dates'
};
