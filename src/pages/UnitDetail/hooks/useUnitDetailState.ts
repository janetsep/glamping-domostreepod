
import { useState, useRef, useEffect } from "react";
import { useGlampingUnits } from "@/hooks/reservations/useGlampingUnits";
import { useReservationFunctions } from "@/hooks/reservations/useReservations";
import { Activity, ThemedPackage, AvailabilityResult } from "@/types";

export const useUnitDetailState = (unitId?: string) => {
  const { data: units = [], isLoading: unitsLoading } = useGlampingUnits();
  const { 
    fetchGlampingUnits, 
    checkAvailability, 
    calculateQuote, 
    createReservation, 
    redirectToWebpay 
  } = useReservationFunctions();

  const displayUnit = units.find(unit => unit.id === unitId) || units[0];
  const confirmationRef = useRef(null);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [requiredDomos, setRequiredDomos] = useState(1);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availableDomos, setAvailableDomos] = useState(0);
  const [isPartialAvailability, setIsPartialAvailability] = useState(false);
  const [alternativeDates, setAlternativeDates] = useState<{ startDate: Date; endDate: Date }[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  const [reservationTab, setReservationTab] = useState("dates");
  const [checkedAvailability, setCheckedAvailability] = useState(false);

  const getCurrentStep = (): number => {
    if (isReservationConfirmed) return 4;
    if (showQuote) return 3;
    if (checkedAvailability && isAvailable) return 2;
    return 1;
  };

  const generateQuote = () => {
    setShowQuote(true);
  };

  const confirmReservation = () => {
    setIsReservationConfirmed(true);
  };

  const handleCheckAvailability = async (guestsCount: number, startDate: Date, endDate: Date, forceRefresh?: boolean): Promise<AvailabilityResult> => {
    return await checkAvailability(guestsCount, startDate, endDate, forceRefresh);
  };

  // Efecto unificado para calcular disponibilidad usando la misma lógica que el calendario
  useEffect(() => {
    if (!startDate || !endDate || guests <= 0) {
      setAvailableDomos(0);
      setIsAvailable(null);
      setRequiredDomos(Math.ceil(guests / 4));
      return;
    }

    const domosNecesarios = Math.ceil(guests / 4);
    setRequiredDomos(domosNecesarios);

    // Usar la misma lógica que el calendario: verificar disponibilidad para el rango completo
    (async () => {
      try {
        console.log('🔍 [useUnitDetailState] Verificando disponibilidad para rango completo:', {
          inicio: startDate.toISOString().split('T')[0],
          fin: endDate.toISOString().split('T')[0],
          huéspedes: guests,
          domosRequeridos: domosNecesarios
        });

        // Usar checkAvailability que ya implementa la lógica correcta de rango completo
        const result = await checkAvailability(guests, startDate, endDate, true);
        
        console.log('🔍 [useUnitDetailState] Resultado de verificación:', result);

        if (typeof result.availableDomes === 'number') {
          setAvailableDomos(result.availableDomes);
          setIsAvailable(result.availableDomes >= domosNecesarios);
          
          console.log('✅ [useUnitDetailState] Estado actualizado:', {
            domosDisponibles: result.availableDomes,
            domosRequeridos: domosNecesarios,
            disponible: result.availableDomes >= domosNecesarios
          });
        } else {
          console.log('❌ [useUnitDetailState] Resultado inválido:', result);
          setAvailableDomos(0);
          setIsAvailable(false);
        }

      } catch (error) {
        console.error('❌ [useUnitDetailState] Error verificando disponibilidad:', error);
        setAvailableDomos(0);
        setIsAvailable(false);
      }
    })();
  }, [startDate, endDate, guests, checkAvailability]);

  return {
    // Unit data
    displayUnit,
    units,
    unitsLoading,
    
    // State
    startDate,
    endDate,
    guests,
    adults,
    children,
    requiredDomos,
    isAvailable,
    availableDomos,
    isPartialAvailability,
    alternativeDates,
    showQuote,
    quote,
    isProcessingPayment,
    isReservationConfirmed,
    confirmedReservationId,
    paymentDetails,
    selectedActivities,
    selectedPackages,
    activitiesTotal,
    packagesTotal,
    reservationTab,
    checkedAvailability,
    
    // Refs
    confirmationRef,
    
    // Setters
    setStartDate,
    setEndDate,
    setGuests,
    setAdults,
    setChildren,
    setIsAvailable,
    setShowQuote,
    setQuote,
    setIsProcessingPayment,
    setIsReservationConfirmed,
    setSelectedActivities,
    setSelectedPackages,
    setReservationTab,
    setCheckedAvailability,
    
    // Functions
    checkAvailability: handleCheckAvailability,
    calculateQuote,
    createReservation,
    redirectToWebpay,
    getCurrentStep,
    generateQuote,
    confirmReservation
  };
};
