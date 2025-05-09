// Import necessary hooks and utilities
import { useCallback } from 'react';
import { Activity, ThemedPackage } from '@/types';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { toast } from "sonner";

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
  const { toast: uiToast } = useToast();

  // Function to check the availability of the selected dates
  const checkDatesAvailability = useCallback(async () => {
    if (!state.displayUnit?.id || !state.startDate || !state.endDate) {
      console.warn("Missing unit ID, start date, or end date");
      return;
    }

    try {
      const startDateFormatted = format(state.startDate, 'yyyy-MM-dd');
      const endDateFormatted = format(state.endDate, 'yyyy-MM-dd');

      // En lugar de consultar la tabla unit_availability, consultamos directamente la tabla reservations
      const { data: overlappingReservations, error } = await supabase
        .from('reservations')
        .select('id, unit_id, check_in, check_out')
        .eq('status', 'confirmed')
        .or(`check_in.lte.${new Date(endDateFormatted).toISOString()},check_out.gte.${new Date(startDateFormatted).toISOString()}`);

      if (error) {
        console.error("Error fetching reservations:", error);
        toast.error("No se pudo verificar la disponibilidad. Por favor, inténtalo de nuevo.", {
          duration: 6000
        });
        state.setIsAvailable(true); // Asumimos disponibilidad en caso de error para no bloquear
        state.setCheckedAvailability(true);
        return;
      }

      if (!overlappingReservations || overlappingReservations.length === 0) {
        // No hay reservas en ese rango, hay disponibilidad completa
        state.setIsAvailable(true);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(state.displayUnit.domos || 4);
        state.setAlternativeDates([]);
        state.setCheckedAvailability(true);
        return;
      }

      // Verificamos cuántos domos están ocupados en el rango de fechas
      const uniqueReservedUnits = new Set(overlappingReservations.map(r => r.unit_id));
      const reservedCount = uniqueReservedUnits.size;
      const availableDomos = Math.max(0, (state.displayUnit.domos || 4) - reservedCount);
      const requiredDomos = state.requiredDomos || 1;

      if (availableDomos >= requiredDomos) {
        // Hay suficientes domos disponibles
        state.setIsAvailable(true);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(availableDomos);
        state.setAlternativeDates([]);
        toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios.`);
      } else if (availableDomos > 0) {
        // Hay disponibilidad parcial
        state.setIsAvailable(false);
        state.setIsPartialAvailability(true);
        state.setAvailableDomos(availableDomos);
        state.setAlternativeDates([]);
        toast.warning(`Solo tenemos disponibilidad para ${availableDomos} domos en las fechas seleccionadas.`, {
          duration: 6000
        });
      } else {
        // No hay disponibilidad
        state.setIsAvailable(false);
        state.setIsPartialAvailability(false);
        state.setAvailableDomos(0);
        
        // Intentamos buscar fechas alternativas
        try {
          const alternativeDates = await import('@/hooks/reservations/utils/availabilityChecker')
            .then(module => module.findAlternativeDates(state.startDate!, state.endDate!, requiredDomos));
          
          state.setAlternativeDates(alternativeDates);
          
          if (alternativeDates.length > 0) {
            toast.error(`No hay domos disponibles para las fechas seleccionadas. Encontramos ${alternativeDates.length} fechas alternativas.`, {
              duration: 6000
            });
          } else {
            toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
          }
        } catch (error) {
          console.error("Error buscando fechas alternativas:", error);
          state.setAlternativeDates([]);
          toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
        }
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Ocurrió un error al verificar la disponibilidad. Por favor, inténtalo de nuevo.", {
        duration: 6000
      });
      // Asumimos disponibilidad en caso de error para no bloquear la experiencia del usuario
      state.setIsAvailable(true); 
      state.setIsPartialAvailability(false);
      state.setAvailableDomos(state.requiredDomos || 1);
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

      // Calcular la cotización localmente para no depender de una API
      const nights = Math.round((state.endDate.getTime() - state.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const basePrice = state.displayUnit.prices?.base_price || 100000;
      const weekendPrice = state.displayUnit.prices?.weekend_price || basePrice;
      const holidayPrice = state.displayUnit.prices?.holiday_price || basePrice;
      
      // Usamos un precio base simple para la demostración
      const totalPrice = basePrice * nights;
      
      // Creamos una cotización simple
      const quote = {
        nights,
        pricePerNight: basePrice,
        totalPrice,
        basePrice,
        breakdown: [
          {
            description: `${nights} noches x $${basePrice.toLocaleString()}`,
            amount: totalPrice,
            guests: state.guests,
            domoNumber: state.requiredDomos || 1
          }
        ],
        rateDescription: "Tarifa estándar",
        requiredDomos: state.requiredDomos || 1,
        domoDistribution: [
          {
            domoNumber: 1,
            guests: state.guests
          }
        ],
        season: "medium" as "high" | "low" | "medium"
      };

      // Set the quote in the state
      state.setQuote(quote);
      state.setShowQuote(true);
      state.setReservationTab('summary');
    } catch (error) {
      console.error("Error getting quote:", error);
      uiToast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al obtener la cotización. Por favor, inténtalo de nuevo.",
      });
    }
  }, [state, uiToast]);

  // Function to handle creating a new quote
  const handleNewQuote = useCallback(() => {
    state.setShowQuote(false);
    state.setQuote(null);
    state.setReservationTab('dates');
  }, [state]);

  // Function to handle confirming the reservation
  const handleConfirmReservation = useCallback(() => {
    // Simulamos una confirmación exitosa
    toast.success("¡Reserva confirmada! Te redirigiremos al pago.", {
      duration: 3000
    });
    setTimeout(() => {
      state.setIsReservationConfirmed(true);
      state.setConfirmedReservationId("demo-reservation");
      state.setPaymentDetails({
        status: "success",
        amount: state.quote?.totalPrice || 0
      });
    }, 2000);
  }, [state]);

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
    handleNewQuote: state.setShowQuote ? (() => {
      state.setShowQuote(false);
      state.setQuote(null);
      state.setReservationTab('dates');
    }) : undefined,
    handleConfirmReservation,
    handleActivityToggle,
    handlePackageToggle,
    getUpdatedQuoteTotal
  };
};
