
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

  // ÚNICO efecto para calcular disponibilidad - corregido para obtener el mínimo real
  useEffect(() => {
    if (!startDate || !endDate || guests <= 0) {
      setAvailableDomos(0);
      setIsAvailable(null);
      setRequiredDomos(Math.ceil(guests / 4));
      return;
    }

    const domosNecesarios = Math.ceil(guests / 4);
    setRequiredDomos(domosNecesarios);

    // Función para obtener todas las noches del rango (sin incluir la fecha de checkout)
    const getNightsInRange = (start: Date, end: Date) => {
      const nights: Date[] = [];
      let current = new Date(start);
      const endDay = new Date(end);
      
      while (current < endDay) {
        nights.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return nights;
    };

    (async () => {
      try {
        const nights = getNightsInRange(startDate, endDate);
        let minAvailableForAllNights = Infinity;
        
        // Verificar disponibilidad para cada noche individualmente
        for (const nightDate of nights) {
          const nextDay = new Date(nightDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          // Verificar disponibilidad para esta noche específica
          const result = await checkAvailability(guests, nightDate, nextDay, true);
          
          if (typeof result.availableDomes === 'number') {
            minAvailableForAllNights = Math.min(minAvailableForAllNights, result.availableDomes);
            console.log(`🔍 [AVAILABILITY] Noche ${nightDate.toISOString().split('T')[0]}: ${result.availableDomes} domos disponibles`);
          } else {
            // Si alguna noche no tiene datos válidos, no hay disponibilidad
            minAvailableForAllNights = 0;
            break;
          }
        }

        // Si no se encontraron datos válidos, establecer en 0
        if (minAvailableForAllNights === Infinity) {
          minAvailableForAllNights = 0;
        }

        console.log(`🔍 [AVAILABILITY FINAL] Rango ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}: ${minAvailableForAllNights} domos mínimos disponibles para ${nights.length} noches`);

        setAvailableDomos(minAvailableForAllNights);
        setIsAvailable(minAvailableForAllNights >= domosNecesarios);

      } catch (error) {
        console.error('Error calculando disponibilidad:', error);
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
