
import { useState, useRef } from "react";
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

  // Usar los hooks especializados
  const {
    requiredDomos,
    isAvailable,
    availableDomos,
    isPartialAvailability,
    alternativeDates,
    setIsAvailable
  } = useDateAvailability(startDate, endDate, 2);

  const {
    guests,
    adults,
    children,
    setGuests,
    setAdults,
    setChildren
  } = useGuestManagement(availableDomos);

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

  // Calcular el número correcto de domos requeridos
  const actualRequiredDomos = Math.ceil(guests / 4);

  // Crear el objeto state para las acciones
  const stateForActions = {
    startDate,
    endDate,
    guests,
    displayUnit,
    quote,
    requiredDomos: actualRequiredDomos, // Usar el cálculo correcto
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
    baseGenerateQuote(displayUnit, startDate, endDate, guests, actualRequiredDomos);
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
    requiredDomos: actualRequiredDomos, // Usar el cálculo correcto
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
    checkAvailability,
    getCurrentStep,
    generateQuote,
    confirmReservation: handleConfirmReservation
  };
};
