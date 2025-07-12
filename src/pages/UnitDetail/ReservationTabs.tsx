
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitiesSelector } from "@/components/unit-detail/ActivitiesSelector";
import { ThemedPackagesSelector } from "@/components/unit-detail/ThemedPackagesSelector";
import { CelebrationPackageTab } from "@/components/unit-detail/CelebrationPackageTab";
import { RegularUnitTab } from "@/components/unit-detail/RegularUnitTab";
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
  adults?: number;
  children?: number;
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
  requiredDomos?: number;
  selectedDomos?: number;
  setSelectedDomos?: (domos: number) => void;
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
  adults = 2,
  children = 0,
  onAdultsChange,
  onChildrenChange,
  requiredDomos,
  selectedDomos,
  setSelectedDomos,
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
  // Detectar si es un paquete de celebración
  const isCelebrationPackage = unitId && (
    unitId.includes('package') || 
    unitId === 'mujeres-relax-package' ||
    unitId === 'cumpleanos-package' ||
    unitId === 'aniversario-package' ||
    unitId === 'familia-package'
  );

  return (
    <Tabs 
      defaultValue="dates" 
      value={tab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className={`grid ${isCelebrationPackage ? 'grid-cols-2' : 'grid-cols-3'} mb-4`}>
        <TabsTrigger value="dates">
          {isCelebrationPackage ? 'Fechas' : 'Fechas y huéspedes'}
        </TabsTrigger>
        <TabsTrigger value="activities">Actividades</TabsTrigger>
        {!isCelebrationPackage && (
          <TabsTrigger value="packages">Paquetes temáticos</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="dates" className="space-y-4">
        {isCelebrationPackage && selectedDomos !== undefined && setSelectedDomos ? (
          <CelebrationPackageTab
            unitId={unitId}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            requiredDomos={requiredDomos}
            selectedDomos={selectedDomos}
            setSelectedDomos={setSelectedDomos}
            isAvailable={isAvailable}
            availableDomos={availableDomos}
            guests={guests}
          />
        ) : (
          <RegularUnitTab
            unitId={unitId}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            guests={guests}
            onGuestsChange={onGuestsChange}
            adults={adults}
            children={children}
            onAdultsChange={onAdultsChange}
            onChildrenChange={onChildrenChange}
            requiredDomos={requiredDomos}
            isAvailable={isAvailable}
            availableDomos={availableDomos}
          />
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
