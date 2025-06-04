
import { Activity, ThemedPackage, AvailabilityResult } from "@/types";

export interface ReservationState {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  adults: number;
  children: number;
  requiredDomos: number;
  isAvailable: boolean | null;
  availableDomos: number;
  isPartialAvailability: boolean;
  alternativeDates: { startDate: Date; endDate: Date }[];
  showQuote: boolean;
  quote: any;
  isProcessingPayment: boolean;
  isReservationConfirmed: boolean;
  confirmedReservationId: string | null;
  paymentDetails: any;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  checkedAvailability: boolean;
  
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setGuests: (guests: number) => void;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setIsAvailable: (available: boolean | null) => void;
  setShowQuote: (show: boolean) => void;
  setQuote: (quote: any) => void;
  setIsProcessingPayment: (processing: boolean) => void;
  setIsReservationConfirmed: (confirmed: boolean) => void;
  setSelectedActivities: (activities: Activity[]) => void;
  setSelectedPackages: (packages: ThemedPackage[]) => void;
  setReservationTab: (tab: string) => void;
  setCheckedAvailability: (checked: boolean) => void;
  
  checkAvailability: (guests: number, startDate: Date, endDate: Date, forceRefresh?: boolean) => Promise<AvailabilityResult>;
  calculateQuote: any;
  createReservation: any;
  redirectToWebpay: any;
  refetchAvailability?: () => void;
  
  // Funciones requeridas
  getCurrentStep: () => number;
  confirmationRef: any;
  generateQuote: () => void;
  confirmReservation: () => void;
}

export interface AvailabilityState {
  checkAvailability: (guests: number, startDate: Date, endDate: Date, forceRefresh?: boolean) => Promise<AvailabilityResult>;
  setIsAvailable: (available: boolean | null) => void;
  setCheckedAvailability: (checked: boolean) => void;
}
