
import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";

export interface ReservationState {
  displayUnit: GlampingUnit | null;
  startDate?: Date;
  endDate?: Date;
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
  
  // Setters
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
  
  // Functions
  checkAvailability: (guests: number, startDate: Date, endDate: Date, forceRefresh?: boolean) => Promise<{ isAvailable: boolean; availableDomes: number; requiredDomos: number; error?: string }>;
  calculateQuote: any;
  createReservation: any;
  redirectToWebpay: any;
  refetchAvailability?: () => void;
}
