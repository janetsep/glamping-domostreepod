
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { Activity, ThemedPackage } from "@/types";
import ActivitiesSelector from "./components/ActivitiesSelector";
import PackageSelector from "./components/PackageSelector";

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
  maxDomos: number; // Añadido explícitamente
  requiredDomos?: number;
  onDomosChange?: (domos: number) => void;
  isAvailable: boolean | null;
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  activitiesTotal: number;
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  packagesTotal: number;
  unitId: string;
  activities?: Activity[];
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
  maxDomos,
  requiredDomos,
  onDomosChange,
  isAvailable,
  selectedActivities,
  onActivityToggle,
  activitiesTotal,
  selectedPackages,
  onPackageToggle,
  packagesTotal,
  unitId,
  activities = []
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
        />
        
        <GuestSelector
          maxGuests={16} // Permitir hasta 16 huéspedes en total
          guests={guests}
          onGuestsChange={onGuestsChange}
          maxDomos={4} // Máximo 4 domos disponibles
          requiredDomos={requiredDomos}
          onDomosChange={onDomosChange}
        />
        
        {isAvailable === false && (
          <div className="p-3 bg-red-50 border border-red-100 rounded text-red-800 text-sm mt-4">
            No hay disponibilidad para las fechas seleccionadas. Por favor, selecciona otras fechas.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="activities">
        <ActivitiesSelector
          activities={activities}
          selectedActivities={selectedActivities}
          onActivityToggle={onActivityToggle}
          totalPrice={activitiesTotal}
        />
      </TabsContent>
      
      <TabsContent value="packages">
        <PackageSelector
          packages={selectedPackages}
          selectedPackages={selectedPackages}
          onPackageToggle={onPackageToggle}
          totalPrice={packagesTotal}
        />
      </TabsContent>
    </Tabs>
  );
};
