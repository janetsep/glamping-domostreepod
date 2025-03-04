
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Activity, ThemedPackage } from "@/types";

type ReservationState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean) => void;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
  calculateQuote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  toast: any;
  selectedActivities: Activity[];
  setSelectedActivities: (
    value: Activity[] | ((prev: Activity[]) => Activity[])
  ) => void;
  selectedPackages: ThemedPackage[];
  setSelectedPackages: (
    value: ThemedPackage[] | ((prev: ThemedPackage[]) => ThemedPackage[])
  ) => void;
  activitiesTotal: number;
  packagesTotal: number;
  checkedAvailability: boolean;
  setCheckedAvailability: (checked: boolean) => void;
  setReservationTab: (tab: string) => void;
  createReservation: any;
  redirectToWebpay: any;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  quote: any;
};

export const useReservationActions = (state: ReservationState) => {
  // Handle activity toggle
  const handleActivityToggle = (activity: Activity) => {
    state.setSelectedActivities((prev: Activity[]) => {
      const isSelected = prev.some((a) => a.id === activity.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  // Handle package toggle
  const handlePackageToggle = (pkg: ThemedPackage) => {
    state.setSelectedPackages((prev: ThemedPackage[]) => {
      const isSelected = prev.some((p) => p.id === pkg.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };

  // Verify availability automatically when dates are selected
  const checkDatesAvailability = async () => {
    if (state.startDate && state.endDate && state.displayUnit && !state.checkedAvailability) {
      const available = await state.checkAvailability(state.displayUnit.id, state.startDate, state.endDate);
      state.setIsAvailable(available);
      state.setCheckedAvailability(true);
      
      if (available) {
        state.toast({
          title: "Fechas disponibles",
          description: "Las fechas seleccionadas están disponibles para reserva.",
          variant: "default",
        });
      } else {
        state.toast({
          variant: "destructive",
          title: "No disponible",
          description: "Las fechas seleccionadas no están disponibles. Por favor, elige otras fechas.",
        });
      }
    }
  };

  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const available = await state.checkAvailability(state.displayUnit.id, state.startDate, state.endDate);
    state.setIsAvailable(available);

    if (available) {
      let quoteDetails = state.calculateQuote(
        state.displayUnit.prices,
        state.startDate,
        state.endDate,
        state.guests
      );
      
      // Add activities and packages to the quote
      if (state.selectedActivities.length > 0 || state.selectedPackages.length > 0) {
        // Add activities and packages to the breakdown
        const totalWithExtras = quoteDetails.totalPrice + state.activitiesTotal + state.packagesTotal;
        
        quoteDetails = {
          ...quoteDetails,
          totalPrice: totalWithExtras
        };
      }
      
      state.setQuote(quoteDetails);
      state.setShowQuote(true);
      state.setReservationTab("summary");
    } else {
      state.setQuote(null);
      state.setShowQuote(false);
      state.toast({
        variant: "destructive",
        title: "No disponible",
        description: "Las fechas seleccionadas no están disponibles.",
      });
    }
  };

  const handleReservation = async () => {
    if (!state.startDate || !state.endDate) {
      state.toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona las fechas de entrada y salida",
      });
      return;
    }

    await checkAvailabilityAndQuote();
  };

  const handleNewQuote = () => {
    state.setShowQuote(false);
    state.setSelectedActivities([]);
    state.setSelectedPackages([]);
    state.setReservationTab("dates");
  };

  const handleConfirmReservation = async () => {
    if (!state.displayUnit || !state.startDate || !state.endDate || !state.quote) return;

    try {
      state.setIsProcessingPayment(true);
      
      // Limpiar todos los mensajes antes de iniciar el proceso
      clearAllToasts();
      toast.dismiss();
      
      // Get activity and package IDs for storage
      const activityIds = state.selectedActivities.map(a => a.id);
      const packageIds = state.selectedPackages.map(p => p.id);
      
      const reservation = await state.createReservation(
        state.displayUnit.id,
        state.startDate,
        state.endDate,
        state.guests,
        state.quote.totalPrice,
        'webpay',
        activityIds,
        packageIds
      );

      if (reservation) {
        // Iniciar el proceso de pago sin esperar respuesta (para evitar errores de timeout)
        state.redirectToWebpay(reservation.id, state.quote.totalPrice);
        // No hacemos nada después de la redirección, ya que el usuario será llevado a WebPay
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      // No mostramos toast de error, ya que el usuario podría ser redirigido de todas formas
    } finally {
      state.setIsProcessingPayment(false);
    }
  };

  // Calculate updated quote total with selected extras
  const getUpdatedQuoteTotal = () => {
    if (!state.quote) return 0;
    return state.quote.totalPrice + state.activitiesTotal + state.packagesTotal;
  };

  return {
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    checkAvailabilityAndQuote,
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    getUpdatedQuoteTotal
  };
};
