
export interface ReservationState {
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
  selectedActivities: any[];
  selectedPackages: any[];
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  refetchAvailability?: () => void;
}
