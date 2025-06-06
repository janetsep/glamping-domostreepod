
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { Activity, ThemedPackage } from "@/types";
import { ReservationTabs } from "../ReservationTabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Calendar, Check } from "lucide-react";
import { AlternativeDates } from "@/components/unit-detail/AlternativeDates";

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
  availableDomos = 0,
  alternativeDates = [],
  handleAlternativeDateSelect
}: ReservationFormProps) => {
  // Campo para controlar si hay que mostrar o no las fechas alternativas
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Efecto para mostrar las fechas alternativas cuando no hay disponibilidad completa
  useEffect(() => {
    if ((isAvailable === false || isAvailable && availableDomos < requiredDomos) && alternativeDates.length > 0) {
      setShowAlternatives(true);
    } else {
      setShowAlternatives(false);
    }
  }, [isAvailable, availableDomos, requiredDomos, alternativeDates]);

  // Efecto para depurar cambios en las fechas
  useEffect(() => {
    console.log('🔍 [ReservationForm] Fechas actualizadas:', {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });
  }, [startDate, endDate]);

  // Determinar si hay suficientes domos disponibles para la cantidad de huéspedes
  const hasSufficientDomos = availableDomos !== undefined && requiredDomos !== undefined ? availableDomos >= requiredDomos : true;

  // Manejador para la selección de fechas desde el calendario expandible
  const handleCalendarRangeSelect = (range: { startDate: Date | undefined, endDate: Date | undefined }) => {
    console.log('🔍 [ReservationForm] handleCalendarRangeSelect llamado con:', {
      startDate: range.startDate?.toISOString(),
      endDate: range.endDate?.toISOString()
    });

    // Actualizar las fechas directamente, ya que vienen validadas del calendario
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  return (
    <div className="space-y-6">
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
        requiredDomos={requiredDomos} 
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
      {isAvailable === true && hasSufficientDomos && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Disponible</AlertTitle>
          <AlertDescription className="text-green-700">
            {isPartialAvailability 
              ? `Tenemos disponibilidad parcial con ${availableDomos} domos en las fechas seleccionadas.` 
              : `Tenemos disponibilidad completa para las fechas seleccionadas con ${availableDomos} domos disponibles.`}
          </AlertDescription>
        </Alert>
      )}

      {(isAvailable === true || isAvailable === null) && !hasSufficientDomos && availableDomos > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Domos disponibles: {availableDomos}/{requiredDomos}</AlertTitle>
          <AlertDescription className="text-amber-700">
            Se necesitan {requiredDomos} domos para {guests} huéspedes, pero solo hay {availableDomos} disponibles.
            Por favor, reduce la cantidad de huéspedes o selecciona otras fechas.
          </AlertDescription>
        </Alert>
      )}

      {isAvailable === false && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">No disponible</AlertTitle>
          <AlertDescription className="text-red-700">
            Lo sentimos, no tenemos disponibilidad para las fechas seleccionadas.
            {availableDomos > 0 ? ` Solo hay ${availableDomos} domos disponibles.` : ''}
          </AlertDescription>
        </Alert>
      )}

      {/* Fechas alternativas */}
      {showAlternatives && alternativeDates.length > 0 && (
        <AlternativeDates 
          alternativeDates={alternativeDates} 
          onSelectDate={handleAlternativeDateSelect} 
          requiredDomos={requiredDomos} 
        />
      )}

      {/* Botón de reserva */}
      <Button 
        type="button" 
        className="w-full" 
        size="lg" 
        onClick={onReservation} 
        disabled={!startDate || !endDate || isAvailable === false || !hasSufficientDomos}
      >
        Cotizar
      </Button>
    </div>
  );
};
