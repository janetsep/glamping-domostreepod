
import { useState, useRef, useEffect } from "react";
import { useGlampingUnits } from "@/hooks/reservations/useGlampingUnits";
import { useReservationFunctions } from "@/hooks/reservations/useReservations";
import { Activity, ThemedPackage, AvailabilityResult } from "@/types";
import { eachDayOfInterval, addDays } from "date-fns";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker/checkGeneralAvailability";

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

  // Efecto para calcular la disponibilidad mínima real para todo el rango de fechas
  useEffect(() => {
    if (!startDate || !endDate || guests <= 0) {
      setAvailableDomos(0);
      setIsAvailable(null);
      setRequiredDomos(Math.ceil(guests / 4));
      return;
    }

    const domosNecesarios = Math.ceil(guests / 4);
    setRequiredDomos(domosNecesarios);

    // Calcular la disponibilidad mínima para todo el rango
    (async () => {
      try {
        console.log('🔍 [useUnitDetailState] Calculando disponibilidad mínima para rango:', {
          inicio: startDate.toISOString().split('T')[0],
          fin: endDate.toISOString().split('T')[0],
          huéspedes: guests,
          domosRequeridos: domosNecesarios
        });

        // Obtener todas las noches del rango (excluyendo la fecha de checkout)
        const nights = eachDayOfInterval({ 
          start: startDate, 
          end: addDays(endDate, -1) 
        });

        let minAvailableDomos = Infinity;

        // Verificar disponibilidad para cada noche individualmente
        for (const night of nights) {
          const nextDay = addDays(night, 1);
          
          const result = await checkGeneralAvailability(night, nextDay, domosNecesarios);
          
          if (typeof result.availableUnits === 'number') {
            minAvailableDomos = Math.min(minAvailableDomos, result.availableUnits);
            console.log(`🔍 [useUnitDetailState] Noche ${night.toISOString().split('T')[0]}: ${result.availableUnits} domos disponibles`);
          } else {
            // Si alguna noche no tiene datos válidos, no hay disponibilidad
            minAvailableDomos = 0;
            break;
          }
        }

        // Si no se encontraron datos válidos, establecer en 0
        if (minAvailableDomos === Infinity) {
          minAvailableDomos = 0;
        }

        console.log('🔍 [useUnitDetailState] Disponibilidad mínima calculada:', {
          nochesVerificadas: nights.length,
          domosMinimosDisponibles: minAvailableDomos,
          domosRequeridos: domosNecesarios,
          disponible: minAvailableDomos >= domosNecesarios
        });

        setAvailableDomos(minAvailableDomos);
        setIsAvailable(minAvailableDomos >= domosNecesarios);

      } catch (error) {
        console.error('❌ [useUnitDetailState] Error calculando disponibilidad:', error);
        setAvailableDomos(0);
        setIsAvailable(false);
      }
    })();
  }, [startDate, endDate, guests]);

  // Efecto para ajustar automáticamente los huéspedes cuando la disponibilidad cambie
  useEffect(() => {
    if (availableDomos > 0) {
      const maxGuestsAllowed = availableDomos * 4;
      
      // Si los huéspedes actuales exceden la capacidad máxima, ajustar automáticamente
      if (guests > maxGuestsAllowed) {
        console.log('🔄 [useUnitDetailState] Ajustando huéspedes automáticamente:', {
          huéspedesAntes: guests,
          máximoPermitido: maxGuestsAllowed,
          domosDisponibles: availableDomos
        });
        
        setGuests(maxGuestsAllowed);
        
        // También ajustar adults y children proporcionalmente
        const ratio = maxGuestsAllowed / guests;
        const newAdults = Math.max(1, Math.floor(adults * ratio));
        const newChildren = Math.max(0, maxGuestsAllowed - newAdults);
        
        setAdults(newAdults);
        setChildren(newChildren);
      }
    }
  }, [availableDomos]);

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
