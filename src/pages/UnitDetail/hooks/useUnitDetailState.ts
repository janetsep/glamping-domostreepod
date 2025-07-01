
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

  // Verificación optimizada de disponibilidad
  const { availableDomos, isLoadingAvailability } = useDateAvailability(startDate, endDate);

  // Gestión de huéspedes con conocimiento de disponibilidad
  const {
    guests,
    adults,
    children,
    setGuests,
    setAdults,
    setChildren
  } = useGuestManagement(availableDomos);
    
  // Cálculo de domos requeridos y estado de disponibilidad
  const requiredDomos = useMemo(() => Math.max(1, Math.ceil(guests / 4)), [guests]);

  const isAvailable = useMemo(() => {
    if (isLoadingAvailability || availableDomos === undefined) {
      return null;
    }
    return availableDomos >= requiredDomos;
  }, [availableDomos, requiredDomos, isLoadingAvailability]);
  
  const isPartialAvailability = useMemo(() => {
    if (isLoadingAvailability || availableDomos === undefined) {
        return false;
    }
    return availableDomos > 0 && availableDomos < requiredDomos;
  }, [availableDomos, requiredDomos, isLoadingAvailability]);
  
  const [alternativeDates] = useState<{ startDate: Date, endDate: Date }[]>([]);

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

  // Estado para las acciones de reserva
  const stateForActions = {
    startDate,
    endDate,
    guests,
    displayUnit,
    quote,
    requiredDomos,
    availableDomos,
    activitiesTotal,
    packagesTotal,
    selectedActivities,
    selectedPackages,
    setIsProcessingPayment
  };

  // Usar las acciones de reserva
  const { handleConfirmReservation } = useReservationActions(stateForActions);

  // Wrapper para generateQuote
  const generateQuote = () => {
    baseGenerateQuote(displayUnit, startDate, endDate, guests, requiredDomos);
  };

  // Wrapper para getCurrentStep
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
