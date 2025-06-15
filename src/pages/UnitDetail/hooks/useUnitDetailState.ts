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

  // Recalcular siempre la cantidad real de domos disponibles cuando cambian fechas o huéspedes
  // Este efecto asegura consistencia frente a cambios de fechas o cantidad de huéspedes
  useEffect(() => {
    // Asegurada la cantidad de huéspedes y fechas
    if (startDate && endDate && guests > 0) {
      // Aquí buscamos la cantidad de domos requeridos para las fechas seleccionadas
      (async () => {
        // Buscamos la función actualizada de disponibilidad
        try {
          const res = await checkAvailability(guests, startDate, endDate, true); // forzamos refresh de datos
          setAvailableDomos(res.availableDomes);
          setIsAvailable(res.isAvailable);
          setRequiredDomos(res.requiredDomos || 1);
          // Ayuda clave: log para depurar inconsistencias
          console.log('[SYNC] checkAvailability:', {
            guests,
            startDate,
            endDate,
            resultado: res
          });
        } catch (err) {
          setAvailableDomos(0);
          setIsAvailable(false);
          setRequiredDomos(Math.ceil(guests / 4));
        }
      })();
    }
  }, [startDate, endDate, guests, checkAvailability]); // siempre que cambien fechas/huéspedes

  // Corrección CRÍTICA: Calcula la disponibilidad mínima para todo el rango de noches seleccionadas (NO incluye el día de salida/check-out)
  useEffect(() => {
    if (!startDate || !endDate || guests <= 0) {
      setAvailableDomos(0);
      setIsAvailable(null);
      setRequiredDomos(Math.ceil(guests / 4));
      return;
    }

    // El número real de domos que se requieren para el grupo completo
    const domosNecesarios = Math.ceil(guests / 4);

    // Util para obtener todas las noches desde check-in hasta la noche anterior a check-out
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
        let foundError = false;
        for (const day of nights) {
          // Consulta la disponibilidad real para domosNecesarios para esa noche (desde 'day' hasta 'day+1')
          const res = await checkAvailability(
            domosNecesarios * 4, // guests ficticios, fuerza a devolver availableDomes respecto a domosNecesarios
            day,
            new Date(day.getTime() + 24 * 60 * 60 * 1000),
            true
          );
          if (typeof res.availableDomes === 'number') {
            minAvailableForAllNights = Math.min(minAvailableForAllNights, res.availableDomes);
          } else {
            foundError = true;
          }
        }
        if (foundError || minAvailableForAllNights === Infinity) {
          setAvailableDomos(0);
          setIsAvailable(false);
          setRequiredDomos(domosNecesarios);
        } else {
          setAvailableDomos(minAvailableForAllNights);
          setIsAvailable(minAvailableForAllNights >= domosNecesarios);
          setRequiredDomos(domosNecesarios);
          // Log de depuración
          console.log('[SYNC][RANGO REAL] noches:', nights.length, 'minDomosDisponibles:', minAvailableForAllNights, 'domos necesarios:', domosNecesarios);
        }
      } catch (err) {
        setAvailableDomos(0);
        setIsAvailable(false);
        setRequiredDomos(domosNecesarios);
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
