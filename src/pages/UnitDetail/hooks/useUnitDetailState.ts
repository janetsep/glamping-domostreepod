
import { useState, useEffect, useRef } from "react";
import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";
import { useReservations } from "@/hooks/reservations";
import { toast } from "sonner";

export interface Quote {
  nights: number;
  pricePerNight: number;
  basePrice: number;
  totalPrice: number;
  breakdown: any[];
  rateDescription: string;
  requiredDomos: number;
  domoDistribution: any[];
  season: any;
  activitiesTotal: number;
  packagesTotal: number;
  petsPrice: number;
  pets: number;
  finalTotal: number;
  extrasTotal: number;
}

export const useUnitDetailState = (unitId: string | undefined) => {
  // Estados básicos
  const [displayUnit, setDisplayUnit] = useState<GlampingUnit | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(4);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Estados de disponibilidad
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availableDomos, setAvailableDomos] = useState<number>(0);
  const [requiredDomos, setRequiredDomos] = useState<number>(1);
  const [isPartialAvailability, setIsPartialAvailability] = useState(false);
  const [alternativeDates, setAlternativeDates] = useState<{startDate: Date; endDate: Date}[]>([]);
  
  // Estados de cotización y reserva
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  // Estados de extras
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  
  // Estados de navegación
  const [reservationTab, setReservationTab] = useState("dates");
  const confirmationRef = useRef<HTMLDivElement>(null);
  
  // Hook de reservas
  const { 
    fetchGlampingUnits, 
    checkAvailability, 
    calculateQuote,
    createReservationAndRedirect 
  } = useReservations();

  // Cargar unidad
  useEffect(() => {
    const loadUnit = async () => {
      if (!unitId) return;
      
      try {
        const units = await fetchGlampingUnits();
        const unit = units?.find(u => u.id === unitId);
        
        if (unit) {
          setDisplayUnit(unit);
        } else {
          toast("Unidad no encontrada", {
            description: "La unidad que buscas no existe o no está disponible."
          });
        }
      } catch (error) {
        console.error('Error al cargar la unidad:', error);
        toast("Error al cargar", {
          description: "Hubo un problema al cargar la información de la unidad."
        });
      }
    };

    loadUnit();
  }, [unitId, fetchGlampingUnits]);

  // Calcular domos requeridos
  useEffect(() => {
    const newRequiredDomos = Math.ceil(guests / 4);
    setRequiredDomos(newRequiredDomos);
  }, [guests]);

  // Verificar disponibilidad cuando cambien las fechas o huéspedes
  useEffect(() => {
    const checkDatesAvailability = async () => {
      if (!startDate || !endDate || !displayUnit) {
        setIsAvailable(null);
        return;
      }

      try {
        const result = await checkAvailability(guests, startDate, endDate, true);
        setIsAvailable(result.isAvailable);
        setAvailableDomos(result.availableDomes || 0);
        
        // Determinar si es disponibilidad parcial
        const isPartial = result.isAvailable && result.availableDomes < requiredDomos;
        setIsPartialAvailability(isPartial);
        
      } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        setIsAvailable(false);
        setAvailableDomos(0);
      }
    };

    checkDatesAvailability();
  }, [startDate, endDate, guests, requiredDomos, displayUnit, checkAvailability]);

  // Calcular totales de extras
  useEffect(() => {
    const activitiesTotal = selectedActivities.reduce((sum, activity) => sum + (activity.price || 0), 0);
    const packagesTotal = selectedPackages.reduce((sum, pkg) => sum + (pkg.price || 0), 0);
    
    setActivitiesTotal(activitiesTotal);
    setPackagesTotal(packagesTotal);
  }, [selectedActivities, selectedPackages]);

  // Función para generar cotización
  const generateQuote = async () => {
    if (!displayUnit || !startDate || !endDate) {
      toast("Faltan datos", {
        description: "Por favor completa las fechas y huéspedes."
      });
      return;
    }

    try {
      const unitPrices = {
        base_price: displayUnit.prices?.base_price || displayUnit.base_price || 50000,
        weekend_price: displayUnit.prices?.weekend_price || displayUnit.weekend_price,
        holiday_price: displayUnit.prices?.holiday_price || displayUnit.holiday_price
      };

      const calculatedQuote = calculateQuote(unitPrices, startDate, endDate, guests, requiredDomos);
      
      setQuote({
        ...calculatedQuote,
        activitiesTotal,
        packagesTotal,
        petsPrice: 0,
        pets: 0,
        finalTotal: calculatedQuote.totalPrice + activitiesTotal + packagesTotal,
        extrasTotal: activitiesTotal + packagesTotal
      });
      
      setShowQuote(true);
    } catch (error) {
      console.error('Error al generar cotización:', error);
      toast("Error", {
        description: "No se pudo generar la cotización. Inténtalo de nuevo."
      });
    }
  };

  // Función para confirmar reserva
  const confirmReservation = async () => {
    if (!displayUnit || !startDate || !endDate || !quote) {
      toast("Error", {
        description: "Faltan datos para procesar la reserva."
      });
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const reservation = await createReservationAndRedirect(
        displayUnit.id,
        startDate,
        endDate,
        guests,
        quote.finalTotal,
        selectedActivities,
        selectedPackages,
        requiredDomos
      );

      if (reservation) {
        setConfirmedReservationId(reservation.reservationId);
        setIsReservationConfirmed(true);
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      toast("Error", {
        description: "No se pudo procesar la reserva. Inténtalo de nuevo."
      });
      setIsProcessingPayment(false);
    }
  };

  // Función para obtener el paso actual
  const getCurrentStep = () => {
    if (isReservationConfirmed) return 4;
    if (isProcessingPayment) return 3;
    if (showQuote) return 2;
    return 1;
  };

  return {
    // Estados
    displayUnit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guests,
    setGuests,
    adults,
    setAdults,
    children,
    setChildren,
    isAvailable,
    availableDomos,
    requiredDomos,
    isPartialAvailability,
    alternativeDates,
    showQuote,
    setShowQuote,
    quote,
    setQuote,
    isProcessingPayment,
    setIsProcessingPayment,
    isReservationConfirmed,
    setIsReservationConfirmed,
    confirmedReservationId,
    paymentDetails,
    setPaymentDetails,
    selectedActivities,
    setSelectedActivities,
    selectedPackages,
    setSelectedPackages,
    activitiesTotal,
    packagesTotal,
    reservationTab,
    setReservationTab,
    confirmationRef,
    
    // Funciones
    generateQuote,
    confirmReservation,
    getCurrentStep
  };
};
