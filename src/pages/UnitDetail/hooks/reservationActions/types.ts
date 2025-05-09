
import { Activity, ThemedPackage } from "@/types";
import { GlampingUnit } from "@/lib/supabase";
import { RefObject } from "react";

/**
 * Base interface for reservation state
 */
export interface ReservationState {
  // Basic properties
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos?: number;
  displayUnit?: GlampingUnit;
  
  // State setters
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setGuests: (guests: number) => void;
  setRequiredDomos: (domos: number) => void;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  setIsAvailable: (available: boolean) => void;
  setReservationTab: (tab: string) => void;
  
  // Availability status
  isCheckedAvailability: boolean;
  setCheckedAvailability: (checked: boolean) => void;
  setIsPartialAvailability: (partial: boolean) => void;
  setActivitiesTotal: (total: number) => void;
  setPackagesTotal: (total: number) => void;
  
  // Extended properties needed by useReservationActions
  isAvailable: boolean | null;
  quote: any;
  showQuote: boolean;
  isPartialAvailability: boolean;
  availableDomos: number;
  setAvailableDomos: (available: number) => void;
  alternativeDates: {startDate: Date, endDate: Date}[];
  setAlternativeDates: (dates: {startDate: Date, endDate: Date}[]) => void;
  selectedActivities: Activity[];
  setSelectedActivities: (activities: Activity[]) => void;
  selectedPackages: ThemedPackage[];
  setSelectedPackages: (packages: ThemedPackage[]) => void;
  activitiesTotal: number;
  packagesTotal: number;
  isReservationConfirmed: boolean;
  setIsReservationConfirmed: (confirmed: boolean) => void;
  confirmationRef: RefObject<HTMLDivElement>;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (processing: boolean) => void;
  paymentDetails: any;
  setPaymentDetails: (details: any) => void;
  confirmedReservationId: string | null;
  setConfirmedReservationId: (id: string | null) => void;
  reservationTab: string;
}
