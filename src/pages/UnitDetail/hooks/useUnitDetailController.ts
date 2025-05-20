
import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { findUnitById } from "@/components/unit-detail/utils/unitHelpers";
import { Activity, ThemedPackage } from "@/types";
import { useAvailabilityCheck } from "@/hooks/reservations/useAvailabilityCheck";
import { usePriceCalculator } from "@/hooks/reservations/usePricing";
import { useReservationCreation } from "@/hooks/reservations/useReservationCreation";
import { usePaymentStatus } from "./usePaymentStatusHandler";
import { useReservationActions } from "./reservationActions";
import { calculateRequiredDomos } from "@/components/unit-detail/utils/unitHelpers";
import { useQuoteBase } from "./useQuoteBase";

export const useUnitDetailController = () => {
  const { unitId = "" } = useParams<{ unitId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { toast: uiToast } = useToast();
  
  // Estados generales
  const [isLoading, setIsLoading] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<any>(null);
  
  // Estados de fecha y huéspedes
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [requiredDomos, setRequiredDomos] = useState<number | undefined>(1);
  
  // Estados de disponibilidad
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isPartialAvailability, setPartialAvailability] = useState(false);
  const [availableDomos, setAvailableDomos] = useState<number | undefined>(undefined);
  const [alternativeDates, setAlternativeDates] = useState<{startDate: Date, endDate: Date}[]>([]);
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  
  // Estados de cotización
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Estados de extras
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  
  // Estado de navegación de pestañas
  const [reservationTab, setReservationTab] = useState("dates");
  
  // Hooks
  const { checkAvailability, checkDetailedAvailability } = useAvailabilityCheck({ 
    setIsLoading, 
    toast: uiToast 
  });
  
  const { calculatePrice } = usePriceCalculator();
  const { createReservation } = useReservationCreation({ 
    setIsLoading, 
    toast: uiToast,
    checkAvailability 
  });
  
  // Obtener unidad para mostrar
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unit = await findUnitById(unitId);
        if (unit) {
          setDisplayUnit(unit);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error('Error fetching unit details:', error);
      }
    };
    
    if (unitId) {
      fetchUnitDetails();
    }
  }, [unitId, navigate]);
  
  // Calcular domos requeridos cuando cambia el número de huéspedes
  useEffect(() => {
    if (displayUnit) {
      const requiredDomosCount = calculateRequiredDomos(guests, displayUnit.max_guests || 4);
      setRequiredDomos(requiredDomosCount);
    }
  }, [guests, displayUnit]);
  
  // Calcular totales de actividades y paquetes
  useEffect(() => {
    const calculateActivitiesTotal = () => {
      return selectedActivities.reduce((total, activity) => total + activity.price, 0);
    };
    
    const calculatePackagesTotal = () => {
      return selectedPackages.reduce((total, pkg) => total + pkg.price, 0);
    };
    
    setActivitiesTotal(calculateActivitiesTotal());
    setPackagesTotal(calculatePackagesTotal());
  }, [selectedActivities, selectedPackages]);
  
  // Calcular cotización
  const calculateQuote = useCallback(async () => {
    if (!startDate || !endDate || !displayUnit) return null;
    
    try {
      setIsLoading(true);
      
      const priceDetails = await calculatePrice(
        displayUnit.id,
        startDate,
        endDate,
        guests,
        0 // Pets
      );
      
      return priceDetails;
    } catch (error) {
      console.error('Error calculating quote:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, displayUnit, guests, calculatePrice]);
  
  // Manejar redirección a WebPay
  const redirectToWebpay = async (reservationId: string) => {
    // Este método requiere ser implementado con la integración de WebPay
    console.log(`Redirecting to WebPay for reservation ${reservationId}`);
    
    // Por ahora simulamos una redirección exitosa
    navigate(`/webpay-return?success=true&reservation_id=${reservationId}`);
  };
  
  const paymentStatusHandler = usePaymentStatus({ 
    setIsProcessingPayment,
    navigate
  });
  
  const reservationState = {
    startDate,
    endDate,
    displayUnit,
    guests,
    requiredDomos,
    isAvailable,
    setIsAvailable,
    checkAvailability,
    checkDetailedAvailability,
    calculateQuote,
    setQuote,
    setShowQuote,
    selectedActivities,
    setSelectedActivities,
    selectedPackages,
    setSelectedPackages,
    activitiesTotal,
    packagesTotal,
    checkedAvailability,
    setCheckedAvailability,
    setReservationTab,
    createReservation,
    redirectToWebpay,
    setIsProcessingPayment,
    quote,
    availableDomos
  };
  
  const {
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    getUpdatedQuoteTotal
  } = useReservationActions(reservationState);
  
  const quoteBase = useQuoteBase({
    startDate,
    endDate,
    displayUnit,
    guests,
    isAvailable,
    requiredDomos,
    availableDomos,
    calculateQuote,
    setQuote,
    setShowQuote,
    setReservationTab,
    selectedActivities,
    selectedPackages,
    activitiesTotal,
    packagesTotal,
    quote
  });
  
  // Comprobar parámetros URL
  useEffect(() => {
    const checkUrlParams = () => {
      const paymentStatus = queryParams.get('status');
      const reservationId = queryParams.get('reservation_id');
      const token = queryParams.get('token_ws');
      
      if ((paymentStatus || token) && reservationId) {
        paymentStatusHandler.handlePaymentReturn(paymentStatus, reservationId, token);
      }
    };
    
    checkUrlParams();
  }, [location.search, queryParams, paymentStatusHandler]);
  
  return {
    // Estados
    isLoading,
    displayUnit,
    startDate,
    endDate,
    guests,
    requiredDomos,
    isAvailable,
    isPartialAvailability,
    availableDomos,
    alternativeDates,
    showQuote,
    quote,
    isProcessingPayment,
    selectedActivities,
    selectedPackages,
    activitiesTotal,
    packagesTotal,
    reservationTab,
    
    // Setters
    setStartDate,
    setEndDate,
    setGuests,
    
    // Acciones
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    setReservationTab,
    getUpdatedQuoteTotal,
    
    // Handlers
    paymentStatusHandler
  };
};
