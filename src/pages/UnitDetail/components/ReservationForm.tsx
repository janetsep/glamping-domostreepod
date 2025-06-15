
import { useState, useEffect } from "react";
import { Activity, ThemedPackage } from "@/types";
import { ReservationTabs } from "../ReservationTabs";
import { AlternativeDates } from "@/components/unit-detail/AlternativeDates";
import { AvailabilityMessage } from "./AvailabilityMessage";
import { AvailabilityAlerts } from "./AvailabilityAlerts";
import { ReservationButton } from "./ReservationButton";

interface ReservationFormProps {
  unitId: string;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  adults?: number;
  children?: number;
  setAdults?: (adults: number) => void;
  setChildren?: (children: number) => void;
  requiredDomos?: number;
  isAvailable: boolean | null;
  onReservation: () => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  onActivityToggle: (activity: Activity) => void;
  onPackageToggle: (pkg: ThemedPackage) => void;
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  isPartialAvailability?: boolean;
  availableDomos?: number;
  alternativeDates?: {
    startDate: Date;
    endDate: Date;
  }[];
  handleAlternativeDateSelect?: (startDate: Date, endDate: Date) => void;
}

export const ReservationForm = ({
  unitId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  guests,
  setGuests,
  adults = 2,
  children = 0,
  setAdults,
  setChildren,
  requiredDomos = 1,
  isAvailable,
  onReservation,
  selectedActivities,
  selectedPackages,
  onActivityToggle,
  onPackageToggle,
  activitiesTotal,
  packagesTotal,
  reservationTab,
  setReservationTab,
  isPartialAvailability = false,
  availableDomos,
  alternativeDates = [],
  handleAlternativeDateSelect
}: ReservationFormProps) => {
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Calcular domos requeridos por huéspedes
  const calculatedRequiredDomos = Math.ceil(guests / 4);

  // ¿Hay suficientes domos para el grupo?
  const hasSufficientDomos = availableDomos !== undefined ? availableDomos >= calculatedRequiredDomos : false;

  // Efecto para mostrar las fechas alternativas cuando no hay disponibilidad completa
  useEffect(() => {
    if ((isAvailable === false || isAvailable && availableDomos !== undefined && availableDomos < calculatedRequiredDomos) && alternativeDates.length > 0) {
      setShowAlternatives(true);
    } else {
      setShowAlternatives(false);
    }
  }, [isAvailable, availableDomos, calculatedRequiredDomos, alternativeDates]);

  console.log('🔍 [ReservationForm] Estado final de cotización:', {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    guests,
    calculatedRequiredDomos,
    availableDomos,
    hasSufficientDomos,
    isAvailable,
    canQuote: startDate && endDate && hasSufficientDomos
  });

  return (
    <div className="space-y-6">
      {/* Mensaje de disponibilidad principal */}
      <AvailabilityMessage 
        availableDomos={availableDomos}
        startDate={startDate}
        endDate={endDate}
        guests={guests}
      />

      {/* Tabs de reserva */}
      <ReservationTabs 
        tab={reservationTab} 
        onTabChange={setReservationTab} 
        startDate={startDate} 
        endDate={endDate} 
        onStartDateChange={setStartDate} 
        onEndDateChange={setEndDate} 
        maxGuests={16} 
        guests={guests} 
        onGuestsChange={setGuests} 
        adults={adults}
        children={children}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
        requiredDomos={calculatedRequiredDomos} 
        isAvailable={isAvailable} 
        selectedActivities={selectedActivities} 
        onActivityToggle={onActivityToggle} 
        activitiesTotal={activitiesTotal} 
        selectedPackages={selectedPackages} 
        onPackageToggle={onPackageToggle} 
        packagesTotal={packagesTotal} 
        unitId={unitId} 
        availableDomos={availableDomos} 
      />

      {/* Alertas de disponibilidad */}
      <AvailabilityAlerts 
        availableDomos={availableDomos}
        calculatedRequiredDomos={calculatedRequiredDomos}
        guests={guests}
      />

      {/* Fechas alternativas */}
      {showAlternatives && alternativeDates.length > 0 && (
        <AlternativeDates 
          alternativeDates={alternativeDates} 
          onSelectDate={handleAlternativeDateSelect} 
          requiredDomos={calculatedRequiredDomos} 
        />
      )}

      {/* Botón de reserva */}
      <ReservationButton 
        startDate={startDate}
        endDate={endDate}
        hasSufficientDomos={hasSufficientDomos}
        calculatedRequiredDomos={calculatedRequiredDomos}
        availableDomos={availableDomos}
        onReservation={onReservation}
      />
    </div>
  );
};
