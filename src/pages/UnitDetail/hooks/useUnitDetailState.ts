
import { useState, useRef, useMemo } from "react";
import { useGlampingUnits } from "@/hooks/reservations/useGlampingUnits";
import { useReservationFunctions } from "@/hooks/reservations/useReservations";
import { useDateAvailability } from "./useDateAvailability";
import { useGuestManagement } from "./useGuestManagement";
import { useQuoteManagement } from "./useQuoteManagement";
import { useExtrasState } from "./useExtrasState";
import { useReservationState } from "./useReservationState";
import { useReservationActions } from "./useReservationActions";

export const useUnitDetailState = (unitId?: string) => {
  const { data: units = [], isLoading: unitsLoading } = useGlampingUnits();
  const { checkAvailability } = useReservationFunctions();

  const displayUnit = units.find(unit => unit.id === unitId) || units[0];
  const confirmationRef = useRef(null);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // --- REFACTORED DATA FLOW ---

  // 1. Get number of available domos for the selected date range.
  const { availableDomos, isLoadingAvailability } = useDateAvailability(startDate, endDate);

  // 2. Manage guests, now with knowledge of `availableDomos`.
  const {
    guests,
    adults,
    children,
    setGuests,
    setAdults,
    setChildren
  } = useGuestManagement(availableDomos);
    
  // 3. Derive required domos and availability status from the single sources of truth.
  const requiredDomos = useMemo(() => Math.max(1, Math.ceil(guests / 4)), [guests]);

  const isAvailable = useMemo(() => {
    if (isLoadingAvailability || availableDomos === undefined) {
      return null; // While loading, availability is undetermined.
    }
    return availableDomos >= requiredDomos;
  }, [availableDomos, requiredDomos, isLoadingAvailability]);
  
  const isPartialAvailability = useMemo(() => {
    if (isLoadingAvailability || availableDomos === undefined) {
        return false;
    }
    return availableDomos > 0 && availableDomos < requiredDomos;
  }, [availableDomos, requiredDomos, isLoadingAvailability]);
  
  // Placeholder for alternative dates. The logic to find them should be triggered here if needed.
  const [alternativeDates] = useState<{ startDate: Date, endDate: Date }[]>([]);

  // --- END REFACTORED DATA FLOW ---

  const {
    showQuote,
    quote,
    setShowQuote,
    setQuote,
    generateQuote: baseGenerateQuote
  } = useQuoteManagement();

  const {
    selectedActivities,
    selectedPackages,
    activitiesTotal,
    packagesTotal,
    setSelectedActivities,
    setSelectedPackages
  } = useExtrasState();

  const {
    isProcessingPayment,
    isReservationConfirmed,
    confirmedReservationId,
    paymentDetails,
    reservationTab,
    checkedAvailability,
    setIsProcessingPayment,
    setIsReservationConfirmed,
    setReservationTab,
    setCheckedAvailability,
    getCurrentStep: baseGetCurrentStep
  } = useReservationState();

  // Crear el objeto state para las acciones
  const stateForActions = {
    startDate,
    endDate,
    guests,
    displayUnit,
    quote,
    requiredDomos,
    availableDomos, // Pass this down for verifications
    activitiesTotal,
    packagesTotal,
    selectedActivities,
    selectedPackages,
    setIsProcessingPayment
  };

  // Usar las acciones de reserva
  const { handleConfirmReservation } = useReservationActions(stateForActions);

  // Wrapper para generateQuote que pase los parámetros correctos
  const generateQuote = () => {
    baseGenerateQuote(displayUnit, startDate, endDate, guests, requiredDomos);
  };

  // Wrapper para getCurrentStep que pase showQuote
  const getCurrentStep = () => {
    return baseGetCurrentStep(showQuote);
  };

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
    setShowQuote,
    setQuote,
    setIsProcessingPayment,
    setIsReservationConfirmed,
    setSelectedActivities,
    setSelectedPackages,
    setReservationTab,
    setCheckedAvailability,
    
    // Functions
    checkAvailability,
    getCurrentStep,
    generateQuote,
    confirmReservation: handleConfirmReservation
  };
};
