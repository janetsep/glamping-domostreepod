
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Activity, ThemedPackage } from "@/types";
import { GuestCounter } from "@/components/unit-detail/GuestCounter";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { AvailabilityCalendarSheet } from "../AvailabilityCalendarSheet";
import { ActivitiesSelector } from "./ActivitiesSelector";
import { PackageSelector } from "./PackageSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { reservationContent } from "@/data/content/reservation";
import { DomoCounter } from "@/components/unit-detail/DomoCounter";

interface ReservationFormProps {
  unitId: string;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  requiredDomos: number;
  setRequiredDomos?: (domos: number) => void;
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
  alternativeDates?: {startDate: Date, endDate: Date}[];
  handleCalendarDateSelect: (date: Date) => void;
  handleAlternativeDateSelect: (start: Date, end: Date) => void;
}

export const ReservationForm = ({
  unitId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  guests,
  setGuests,
  requiredDomos,
  setRequiredDomos,
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
  handleCalendarDateSelect,
  handleAlternativeDateSelect
}: ReservationFormProps) => {
  // Estado para tracking del número mínimo de domos requeridos
  const [minRequiredDomos, setMinRequiredDomos] = useState(1);
  
  // Calcular domos mínimos necesarios basado en el número de huéspedes
  useEffect(() => {
    // Cada domo puede alojar hasta 4 personas
    const minDomos = Math.ceil(guests / 4);
    setMinRequiredDomos(minDomos);
    
    // Si requiredDomos está por debajo del mínimo necesario, actualizarlo
    if (requiredDomos < minDomos && setRequiredDomos) {
      setRequiredDomos(minDomos);
    }
  }, [guests, requiredDomos, setRequiredDomos]);

  return (
    <div className="space-y-6">
      <Tabs value={reservationTab} onValueChange={setReservationTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="dates">Fechas</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dates" className="space-y-6">
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            unitId={unitId}
          />
          
          <AvailabilityCalendarSheet
            unitId={unitId}
            onSelectDate={handleCalendarDateSelect}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
          />
          
          <GuestCounter
            guests={guests}
            setGuests={setGuests}
            maxGuests={16}
          />
          
          {guests > 0 && setRequiredDomos && (
            <DomoCounter
              requiredDomos={requiredDomos}
              setRequiredDomos={setRequiredDomos}
              minRequiredDomos={minRequiredDomos}
              availableDomos={availableDomos > 0 ? availableDomos : undefined}
              maxDomos={3} // Limitado al 75% de los domos (3 de 4)
              guests={guests}
            />
          )}
          
          {requiredDomos > minRequiredDomos && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-700">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Has seleccionado los domos, en función de más espacio y privacidad.
              </AlertDescription>
            </Alert>
          )}
          
          {isPartialAvailability && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {reservationContent.availability.partialMessage
                  .replace('{available}', String(availableDomos))
                  .replace('{required}', String(requiredDomos))}
              </AlertDescription>
            </Alert>
          )}
          
          {startDate && endDate && isAvailable === false && alternativeDates.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <h3 className="font-medium text-amber-900 mb-2">
                  {reservationContent.alternativeDates.title}
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  {reservationContent.alternativeDates.subtitle}
                </p>
                <div className="space-y-2">
                  {alternativeDates.map((dates, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border border-amber-200 rounded-md bg-white">
                      <span className="text-sm">
                        {format(dates.startDate, 'PPP', { locale: es })} - {format(dates.endDate, 'PPP', { locale: es })}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAlternativeDateSelect(dates.startDate, dates.endDate)}
                      >
                        {reservationContent.alternativeDates.select}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isAvailable === false && alternativeDates.length === 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {reservationContent.dates.unavailable}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setReservationTab("extras")}
              disabled={!startDate || !endDate || isAvailable === false}
            >
              Continuar
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="extras" className="space-y-6">
          <ActivitiesSelector
            selectedActivities={selectedActivities}
            onActivityToggle={onActivityToggle}
            totalPrice={activitiesTotal}
          />
          
          <PackageSelector
            selectedPackages={selectedPackages}
            onPackageToggle={onPackageToggle}
            totalPrice={packagesTotal}
          />
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setReservationTab("dates")}>
              Atrás
            </Button>
            <Button onClick={onReservation}>
              {reservationContent.availability.quoteButton}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              {reservationContent.policies.title}
            </p>
            <p className="text-sm mb-6">
              Pago del 50% por adelantado para confirmar tu reserva. Check-in desde las 16:00 hrs., check-out hasta las 12:00.
            </p>
            
            <Button onClick={onReservation} size="lg">
              {reservationContent.dates.reserve}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
