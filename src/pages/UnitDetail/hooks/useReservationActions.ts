
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Activity, ThemedPackage } from "@/types";

type ReservationState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  adults?: number;
  children?: number;
  requiredDomos?: number;
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
      // Comprobar si hay suficientes domos disponibles para el número de huéspedes
      const requiredDomos = state.requiredDomos || 1;
      
      // Verificar disponibilidad para cada domo necesario
      let allAvailable = true;
      for (let i = 0; i < requiredDomos; i++) {
        const available = await state.checkAvailability(state.displayUnit.id, state.startDate, state.endDate);
        if (!available) {
          allAvailable = false;
          break;
        }
      }
      
      state.setIsAvailable(allAvailable);
      state.setCheckedAvailability(true);
      
      if (allAvailable) {
        state.toast({
          title: "Fechas disponibles",
          description: `Tenemos disponibilidad para los ${requiredDomos} domos necesarios.`,
          variant: "default",
        });
      } else {
        state.toast({
          variant: "destructive",
          title: "No disponible",
          description: `No hay suficientes domos disponibles para las fechas seleccionadas. Se necesitan ${requiredDomos} domos.`,
        });
      }
    }
  };

  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const requiredDomos = state.requiredDomos || 1;
    
    // Verificar disponibilidad para cada domo necesario
    let allAvailable = true;
    for (let i = 0; i < requiredDomos; i++) {
      const available = await state.checkAvailability(state.displayUnit.id, state.startDate, state.endDate);
      if (!available) {
        allAvailable = false;
        break;
      }
    }
    
    state.setIsAvailable(allAvailable);

    if (allAvailable) {
      // Calcular cotización para todos los domos
      let quoteDetails = state.calculateQuote(
        state.displayUnit.prices,
        state.startDate,
        state.endDate,
        state.guests
      );
      
      // Multiplicar el precio base por el número de domos
      quoteDetails.basePrice = quoteDetails.basePrice * requiredDomos;
      quoteDetails.totalPrice = quoteDetails.totalPrice * requiredDomos;
      quoteDetails.requiredDomos = requiredDomos;
      
      // Añadir actividades y paquetes a la cotización
      if (state.selectedActivities.length > 0 || state.selectedPackages.length > 0) {
        // Agregar actividades y paquetes al desglose
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
        description: `No hay suficientes domos disponibles para las fechas seleccionadas. Se necesitan ${requiredDomos} domos.`,
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
    
    // Validar que si hay 16 huéspedes, al menos 4 sean adultos
    if (state.guests === 16 && (state.adults || 0) < 4) {
      state.toast({
        variant: "destructive",
        title: "Error en la selección de huéspedes",
        description: "Para 16 huéspedes, se requieren al menos 4 adultos (uno por domo).",
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
      
      // Obtener IDs de actividades y paquetes para almacenamiento
      const activityIds = state.selectedActivities.map(a => a.id);
      const packageIds = state.selectedPackages.map(p => p.id);
      
      // Calcular el precio total incluyendo precio base, actividades y paquetes
      const totalPrice = getUpdatedQuoteTotal();
      const requiredDomos = state.requiredDomos || 1;
      
      // Crear las reservas para cada domo necesario
      const reservations = [];
      for (let i = 0; i < requiredDomos; i++) {
        const individualQuotePrice = state.quote.totalPrice / requiredDomos;
        
        const reservation = await state.createReservation(
          state.displayUnit.id,
          state.startDate,
          state.endDate,
          Math.ceil(state.guests / requiredDomos), // Distribuir huéspedes entre domos
          individualQuotePrice,
          'webpay',
          i === 0 ? activityIds : [], // Solo incluir actividades en la primera reserva
          i === 0 ? packageIds : []   // Solo incluir paquetes en la primera reserva
        );
        
        if (reservation) {
          reservations.push(reservation);
        }
      }
      
      if (reservations.length > 0) {
        // Usar la primera reserva para el proceso de pago
        // El total ya incluye el precio de todos los domos
        state.redirectToWebpay(reservations[0].id, state.quote.totalPrice);
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
