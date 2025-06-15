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

  // Calcular domos requeridos por huéspedes (4 huéspedes por domo, como antes).
  const calculatedRequiredDomos = Math.ceil(guests / 4);

  // El valor de availableDomos ya es el mínimo de todas las noches (según hook), pero aclaro variable para claridad.
  const minDomosDisponiblesEnTodasLasNoches = availableDomos;

  // Mensaje de disponibilidad (azul o contextual)
  let availableMessage = '';
  if (minDomosDisponiblesEnTodasLasNoches === undefined) {
    availableMessage = "Calculando disponibilidad...";
  } else if (!startDate || !endDate) {
    availableMessage = "Selecciona fechas para ver la disponibilidad.";
  } else if (minDomosDisponiblesEnTodasLasNoches === 0) {
    availableMessage = "No hay domos disponibles para todas las noches del período seleccionado.";
  } else if (minDomosDisponiblesEnTodasLasNoches < calculatedRequiredDomos) {
    availableMessage = `Solo hay ${minDomosDisponiblesEnTodasLasNoches} domo${minDomosDisponiblesEnTodasLasNoches === 1 ? "" : "s"} disponible${minDomosDisponiblesEnTodasLasNoches === 1 ? "" : "s"} para todas las noches seleccionadas. Se requieren ${calculatedRequiredDomos} domos para alojar a ${guests} huésped${guests > 1 ? "es" : ""}.`;
  } else if (minDomosDisponiblesEnTodasLasNoches === 1) {
    availableMessage = "¡Solo queda 1 domo disponible para todas las noches seleccionadas 🔥!";
  } else {
    availableMessage = `Tenemos ${minDomosDisponiblesEnTodasLasNoches} domo${minDomosDisponiblesEnTodasLasNoches === 1 ? "" : "s"} disponibles para todas las noches seleccionadas.`;
  }

  // ¿Hay suficientes domos para el grupo?
  const hasSufficientDomos = minDomosDisponiblesEnTodasLasNoches !== undefined ? minDomosDisponiblesEnTodasLasNoches >= calculatedRequiredDomos : false;
  // Se puede cotizar solo si cumple condiciones...
  const canQuote = startDate && endDate && hasSufficientDomos && (isAvailable === true || (isAvailable === null && minDomosDisponiblesEnTodasLasNoches > 0));

  console.log('🔍 [ReservationForm] Estado de cotización:', {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    guests,
    calculatedRequiredDomos,
    availableDomos,
    hasSufficientDomos,
    isAvailable,
    canQuote
  });

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

      {/* Mensaje de disponibilidad principal (azul/ámbar/rojo según escenarios), usando el mínimo REAL */}
      <div
        className={`text-xs rounded px-2 py-1 mb-2 font-medium
          ${minDomosDisponiblesEnTodasLasNoches === undefined
            ? 'text-blue-700'
            : minDomosDisponiblesEnTodasLasNoches === 0
              ? 'text-red-600 bg-red-50 border border-red-200'
            : minDomosDisponiblesEnTodasLasNoches < calculatedRequiredDomos
              ? 'text-amber-700 bg-amber-50 border border-amber-100'
            : minDomosDisponiblesEnTodasLasNoches === 1
              ? 'text-orange-700 bg-orange-50 border border-orange-100'
              : 'text-blue-700 bg-blue-50 border border-blue-100'
          }
        `}
      >
        {availableMessage}
      </div>

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
        availableDomos={minDomosDisponiblesEnTodasLasNoches} 
      />

      {/* Alertas de disponibilidad */}
      {(minDomosDisponiblesEnTodasLasNoches !== undefined && calculatedRequiredDomos > 0) && (
        <>
          {minDomosDisponiblesEnTodasLasNoches >= calculatedRequiredDomos ? (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Disponible</AlertTitle>
              <AlertDescription className="text-green-700">
                Tenemos {minDomosDisponiblesEnTodasLasNoches} domo{minDomosDisponiblesEnTodasLasNoches === 1 ? "" : "s"} disponibles para {guests} huésped{guests > 1 ? "es" : ""} ({calculatedRequiredDomos} domo{calculatedRequiredDomos === 1 ? "" : "s"} necesarios).
              </AlertDescription>
            </Alert>
          ) : minDomosDisponiblesEnTodasLasNoches > 0 ? (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Disponibilidad limitada</AlertTitle>
              <AlertDescription className="text-amber-700">
                Solo hay {minDomosDisponiblesEnTodasLasNoches} domo{minDomosDisponiblesEnTodasLasNoches === 1 ? "" : "s"} para el rango completo. Necesitas {calculatedRequiredDomos} domos para {guests} huésped{guests > 1 ? "es" : ""}. Te sugerimos reducir huéspedes o modificar fechas.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">No disponible</AlertTitle>
              <AlertDescription className="text-red-700">
                No hay domos disponibles para todas las noches seleccionadas.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Fechas alternativas */}
      {showAlternatives && alternativeDates.length > 0 && (
        <AlternativeDates 
          alternativeDates={alternativeDates} 
          onSelectDate={handleAlternativeDateSelect} 
          requiredDomos={calculatedRequiredDomos} 
        />
      )}

      {/* Botón de reserva */}
      <Button 
        type="button" 
        className="w-full" 
        size="lg" 
        onClick={onReservation} 
        disabled={!canQuote}
      >
        {!startDate || !endDate ? "Selecciona fechas para cotizar" :
         !hasSufficientDomos ? `Necesitas reducir huéspedes (${calculatedRequiredDomos} domo${calculatedRequiredDomos === 1 ? "" : "s"} requeridos, ${minDomosDisponiblesEnTodasLasNoches} disponible${minDomosDisponiblesEnTodasLasNoches === 1 ? "" : "s"})` :
         "Cotizar"}
      </Button>
    </div>
  );
};
