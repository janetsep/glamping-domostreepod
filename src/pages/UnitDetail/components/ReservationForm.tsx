
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
  selectedDomos?: number;
  setSelectedDomos?: (domos: number) => void;
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
  selectedDomos = 1,
  setSelectedDomos,
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

  // Detectar si es un paquete de celebración
  const isCelebrationPackage = unitId && (
    unitId.includes('package') || 
    unitId === 'mujeres-relax-package' ||
    unitId === 'cumpleanos-package' ||
    unitId === 'aniversario-package' ||
    unitId === 'familia-package'
  );

  // Para paquetes de celebración, establecer automáticamente la duración
  useEffect(() => {
    if (isCelebrationPackage && startDate && !endDate) {
      const packageDuration = getPackageDuration(unitId);
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + packageDuration);
      setEndDate(calculatedEndDate);
    }
  }, [startDate, endDate, isCelebrationPackage, unitId, setEndDate]);

  // Función para obtener la duración del paquete
  const getPackageDuration = (packageId: string): number => {
    switch (packageId) {
      case 'mujeres-relax-package':
      case 'cumpleanos-package':
      case 'aniversario-package':
      case 'familia-package':
        return 2; // 2 noches por defecto
      default:
        return 2;
    }
  };

  // Calcular domos requeridos solo para unidades regulares
  const calculatedRequiredDomos = isCelebrationPackage ? 1 : Math.ceil(guests / 4);

  // ¿Hay suficientes domos para el grupo?
  const hasSufficientDomos = isCelebrationPackage ? 
    true : // Los paquetes siempre tienen disponibilidad simplificada
    (availableDomos !== undefined ? availableDomos >= calculatedRequiredDomos : false);

  // Efecto para mostrar las fechas alternativas cuando no hay disponibilidad completa
  useEffect(() => {
    if (!isCelebrationPackage && (isAvailable === false || isAvailable && availableDomos !== undefined && availableDomos < calculatedRequiredDomos) && alternativeDates.length > 0) {
      setShowAlternatives(true);
    } else {
      setShowAlternatives(false);
    }
  }, [isAvailable, availableDomos, calculatedRequiredDomos, alternativeDates, isCelebrationPackage]);

  console.log('🔍 [ReservationForm] Estado:', {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    guests,
    calculatedRequiredDomos,
    availableDomos,
    hasSufficientDomos,
    isAvailable,
    isCelebrationPackage,
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
        selectedDomos={selectedDomos}
        setSelectedDomos={setSelectedDomos}
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
