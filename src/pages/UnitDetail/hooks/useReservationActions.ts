
// Import necessary hooks and utilities
import { useCallback } from 'react';
import { Activity, ThemedPackage } from '@/types';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

// Define the ReservationState interface to match useUnitDetailController
export interface ReservationState {
  // Basic properties
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos?: number;
  displayUnit?: any;
  
  // State setters
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setGuests: (guests: number) => void;
  setRequiredDomos: (domos: number) => void;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  setIsAvailable: (available: boolean) => void;
  setReservationTab: (tab: string) => void;
  
  // Additional state for management
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
  confirmationRef: React.RefObject<HTMLDivElement>;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (processing: boolean) => void;
  paymentDetails: any;
  setPaymentDetails: (details: any) => void;
  confirmedReservationId: string | null;
  setConfirmedReservationId: (id: string | null) => void;
  reservationTab: string;
}

// Define the useReservationActions hook
export const useReservationActions = (state: ReservationState) => {
  const { toast } = useToast();

  // Function to check the availability of the selected dates
  const checkDatesAvailability = useCallback(async () => {
    if (!state.displayUnit?.id || !state.startDate || !state.endDate) {
      console.warn("Missing unit ID, start date, or end date");
      return;
    }

    try {
      const startDateFormatted = format(state.startDate, 'yyyy-MM-dd');
      const endDateFormatted = format(state.endDate, 'yyyy-MM-dd');

      const { data: availability, error } = await supabase
        .from('unit_availability')
        .select('is_available, available_domos, alternative_dates')
        .eq('unit_id', state.displayUnit.id)
        .gte('date', startDateFormatted)
        .lt('date', endDateFormatted);

      if (error) {
        console.error("Error fetching availability:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo verificar la disponibilidad. Por favor, inténtalo de nuevo.",
        });
        return;
      }

      if (!availability || availability.length === 0) {
        state.setIsAvailable(false);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(0);
        state.setAlternativeDates([]);
        return;
      }

      // Check if all dates are available
      const allAvailable = availability.every(item => item.is_available);
      if (allAvailable) {
        state.setIsAvailable(true);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(state.displayUnit.domos);
        state.setAlternativeDates([]);
        return;
      }

      // Check for partial availability
      const partialAvailability = availability.find(item => item.available_domos !== state.displayUnit.domos);
      if (partialAvailability) {
        state.setIsAvailable(false);
        state.setIsPartialAvailability(true);
        state.setAvailableDomos(partialAvailability.available_domos);
        state.setAlternativeDates([]);
        return;
      }

      // Check for alternative dates
      const alternativeDates = availability[0].alternative_dates || [];
      if (alternativeDates.length > 0) {
        state.setIsAvailable(false);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(0);
        state.setAlternativeDates(alternativeDates);
        return;
      }

      // If none of the above conditions are met, set as unavailable
      state.setIsAvailable(false);
      state.setIsPartialAvailability(false);
      state.setAvailableDomos(0);
      state.setAlternativeDates([]);
    } catch (error) {
      console.error("Error checking availability:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al verificar la disponibilidad. Por favor, inténtalo de nuevo.",
      });
      state.setIsAvailable(false);
      state.setIsPartialAvailability(false);
      state.setAvailableDomos(0);
      state.setAlternativeDates([]);
    } finally {
      state.setCheckedAvailability(true);
    }
  }, [state]);

  // Function to handle the reservation
  const handleReservation = useCallback(async () => {
    if (!state.displayUnit?.id || !state.startDate || !state.endDate || !state.guests) {
      console.warn("Missing unit ID, start date, end date, or number of guests");
      return;
    }

    try {
      const startDateFormatted = format(state.startDate, 'yyyy-MM-dd');
      const endDateFormatted = format(state.endDate, 'yyyy-MM-dd');

      // Fetch the quote from the API
      const { data: quote, error } = await supabase
        .functions.invoke('get-quote', {
          body: {
            unitId: state.displayUnit.id,
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            guests: state.guests,
            requiredDomos: state.requiredDomos,
            selectedActivities: state.selectedActivities,
            selectedPackages: state.selectedPackages
          }
        });

      if (error) {
        console.error("Error fetching quote:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo obtener la cotización. Por favor, inténtalo de nuevo.",
        });
        return;
      }

      // Set the quote in the state
      state.setQuote(quote);
      state.setShowQuote(true);
      state.setReservationTab('summary');
    } catch (error) {
      console.error("Error getting quote:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al obtener la cotización. Por favor, inténtalo de nuevo.",
      });
    }
  }, [state, toast]);

  // Function to handle creating a new quote
  const handleNewQuote = useCallback(() => {
    state.setShowQuote(false);
    state.setQuote(null);
    state.setReservationTab('dates');
  }, [state]);

  // Function to handle confirming the reservation
  const handleConfirmReservation = useCallback(async () => {
    if (!state.quote?.totalPrice || !state.displayUnit?.id || !state.startDate || !state.endDate || !state.guests) {
      console.warn("Missing total price, unit ID, start date, end date, or number of guests");
      return;
    }

    state.setIsProcessingPayment(true);

    try {
      const startDateFormatted = format(state.startDate, 'yyyy-MM-dd');
      const endDateFormatted = format(state.endDate, 'yyyy-MM-dd');

      // Create a new reservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert([
          {
            unit_id: state.displayUnit.id,
            start_date: startDateFormatted,
            end_date: endDateFormatted,
            guests: state.guests,
            total_price: state.quote.totalPrice,
            status: 'pending',
            activities: state.selectedActivities.map(activity => activity.id),
            packages: state.selectedPackages.map(pkg => pkg.id),
            required_domos: state.requiredDomos,
            domo_distribution: state.quote.domoDistribution
          }
        ])
        .select()
        .single();

      if (reservationError) {
        console.error("Error creating reservation:", reservationError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo crear la reserva. Por favor, inténtalo de nuevo.",
        });
        state.setIsProcessingPayment(false);
        return;
      }

      // Store the reservation ID
      state.setConfirmedReservationId(reservation.id);

      // Create a Webpay transaction
      const { data: transactionData, error: transactionError } = await supabase
        .functions.invoke('create-webpay-transaction', {
          body: {
            reservationId: reservation.id,
            amount: state.quote.totalPrice,
            email: localStorage.getItem('client_email') || 'test@example.com',
          }
        });

      if (transactionError) {
        console.error("Error creating Webpay transaction:", transactionError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo crear la transacción de pago. Por favor, inténtalo de nuevo.",
        });
        state.setIsProcessingPayment(false);
        return;
      }

      // Set the payment details
      state.setPaymentDetails(transactionData);

      // Redirect to Webpay
      window.location.href = transactionData.url + '?token_ws=' + transactionData.token;
    } catch (error) {
      console.error("Error confirming reservation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al confirmar la reserva. Por favor, inténtalo de nuevo.",
      });
      state.setIsProcessingPayment(false);
    }
  }, [state, toast]);

  const handleActivityToggle = useCallback((activity: Activity) => {
    const isSelected = state.selectedActivities.some((a) => a.id === activity.id);

    let newActivities = [...state.selectedActivities];
    if (isSelected) {
      newActivities = newActivities.filter((a) => a.id !== activity.id);
    } else {
      newActivities = [...newActivities, activity];
    }

    state.setSelectedActivities(newActivities);

    // Calculate the new total
    const newTotal = newActivities.reduce((acc, a) => acc + a.price, 0);
    state.setActivitiesTotal(newTotal);
  }, [state]);

  const handlePackageToggle = useCallback((pkg: ThemedPackage) => {
    const isSelected = state.selectedPackages.some((p) => p.id === pkg.id);

    let newPackages = [...state.selectedPackages];
    if (isSelected) {
      newPackages = newPackages.filter((p) => p.id !== pkg.id);
    } else {
      newPackages = [...newPackages, pkg];
    }

    state.setSelectedPackages(newPackages);

    // Calculate the new total
    const newTotal = newPackages.reduce((acc, p) => acc + p.price, 0);
    state.setPackagesTotal(newTotal);
  }, [state]);

  const getUpdatedQuoteTotal = useCallback(() => {
    let baseTotal = state.quote?.totalPrice || 0;
    const activitiesTotal = state.activitiesTotal || 0;
    const packagesTotal = state.packagesTotal || 0;

    return baseTotal + activitiesTotal + packagesTotal;
  }, [state]);

  return {
    checkDatesAvailability,
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    handleActivityToggle,
    handlePackageToggle,
    getUpdatedQuoteTotal
  };
};
