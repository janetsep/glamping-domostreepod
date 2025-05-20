
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { ActivitiesSelector } from "@/components/unit-detail/ActivitiesSelector";
import { ThemedPackagesSelector } from "@/components/unit-detail/ThemedPackagesSelector";
import { Activity, ThemedPackage } from "@/types";

interface ReservationTabsProps {
  tab: string;
  onTabChange: (tab: string) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  requiredDomos?: number;
  isAvailable: boolean | null;
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  activitiesTotal: number;
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  packagesTotal: number;
  unitId: string;
  availableDomos?: number;
}

export const ReservationTabs = ({
  tab,
  onTabChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  maxGuests,
  guests,
  onGuestsChange,
  requiredDomos,
  isAvailable,
  selectedActivities,
  onActivityToggle,
  activitiesTotal,
  selectedPackages,
  onPackageToggle,
  packagesTotal,
  unitId,
  availableDomos
}: ReservationTabsProps) => {
  return (
    <Tabs 
      defaultValue="dates" 
      value={tab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="dates">Fechas y huéspedes</TabsTrigger>
        <TabsTrigger value="activities">Actividades</TabsTrigger>
        <TabsTrigger value="packages">Paquetes temáticos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dates" className="space-y-4">
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          unitId={unitId}
          requiredDomos={requiredDomos}
        />
        
        <GuestSelector
          maxGuests={16}
          guests={guests}
          onGuestsChange={onGuestsChange}
          maxDomos={4}
          requiredDomos={requiredDomos}
          availableDomos={availableDomos}
        />
        
        {isAvailable === false && (
          <div className="p-3 bg-red-50 border border-red-100 rounded text-red-800 text-sm mt-4">
            No hay disponibilidad para las fechas seleccionadas. Por favor, selecciona otras fechas.
          </div>
        )}
        
        {availableDomos !== undefined && requiredDomos !== undefined && availableDomos < requiredDomos && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded text-amber-800 text-sm mt-4">
            No hay suficientes domos disponibles. Se necesitan {requiredDomos} domos para {guests} huéspedes, 
            pero solo hay {availableDomos} disponibles. Por favor, reduce la cantidad de huéspedes o selecciona otras fechas.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="activities">
        <ActivitiesSelector
          selectedActivities={selectedActivities}
          onActivityToggle={onActivityToggle}
          total={activitiesTotal}
        />
      </TabsContent>
      
      <TabsContent value="packages">
        <ThemedPackagesSelector
          selectedPackages={selectedPackages}
          onPackageToggle={onPackageToggle}
          total={packagesTotal}
        />
      </TabsContent>
    </Tabs>
  );
};
