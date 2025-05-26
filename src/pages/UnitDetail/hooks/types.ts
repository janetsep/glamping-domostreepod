import { Activity, ThemedPackage } from '@/types';
import { GlampingUnit } from '@/lib/supabase';

export interface ReservationResponse {
  id: string;
  reservationId: string;
  amount: number;
  is_package_unit?: boolean;
}

export interface ReservationState {
  displayUnit: GlampingUnit;
  startDate: Date;
  endDate: Date;
  guests: number;
  quote: {
    nights: number;
    basePrice: number;
    totalPrice: number;
    selectedActivities: Activity[];
    selectedPackages: ThemedPackage[];
  };
  requiredDomos: number;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  setIsProcessingPayment: (isProcessing: boolean) => void;
  createReservation: (
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string,
    activityIds: string[],
    packageIds: string[],
    requiredDomos?: number,
    availableUnitIds?: string[],
    clientInfo?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ) => Promise<ReservationResponse | null>;
  redirectToWebpay: (reservationId: string, amount: number) => void;
  refetchAvailability: () => void;
} 