
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { ActivitiesSelector } from "@/components/unit-detail/ActivitiesSelector";
import { ThemedPackagesSelector } from "@/components/unit-detail/ThemedPackagesSelector";
import { Activity, ThemedPackage } from "@/types";

interface ReservationTabsProps {
  tab: string;
  onTabChange: (value: string) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  isAvailable: boolean | null;
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  activitiesTotal: number;
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  packagesTotal: number;
  children?: ReactNode;
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
  isAvailable,
  selectedActivities,
  onActivityToggle,
  activitiesTotal,
  selectedPackages,
  onPackageToggle,
  packagesTotal,
  children
}: ReservationTabsProps) => {
  return (
    <Tabs defaultValue="dates" value={tab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="dates">Fechas y huéspedes</TabsTrigger>
        <TabsTrigger value="activities">Actividades</TabsTrigger>
        <TabsTrigger value="packages">Paquetes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dates" className="space-y-4">
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />

        <GuestSelector
          maxGuests={maxGuests}
          guests={guests}
          onGuestsChange={onGuestsChange}
        />
        
        {isAvailable !== null && (
          <div className={`p-3 rounded-md mt-4 text-sm font-medium flex items-center gap-2 ${
            isAvailable ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {isAvailable ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                ¡Fechas disponibles! Puedes continuar con tu reserva.
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Fechas no disponibles. Por favor, selecciona otras fechas.
              </>
            )}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="activities">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selecciona actividades</h3>
          <p className="text-sm text-muted-foreground">
            Añade experiencias a tu estadía para hacerla más especial
          </p>
        </div>
        <ActivitiesSelector 
          selectedActivities={selectedActivities} 
          onActivityToggle={onActivityToggle} 
        />
        {selectedActivities.length > 0 && (
          <div className="mt-4 pt-2 border-t">
            <div className="flex justify-between font-medium">
              <span>Total actividades:</span>
              <span>${activitiesTotal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="packages">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Paquetes temáticos</h3>
          <p className="text-sm text-muted-foreground">
            Personaliza tu experiencia con nuestros paquetes exclusivos
          </p>
        </div>
        <ThemedPackagesSelector 
          selectedPackages={selectedPackages} 
          onPackageToggle={onPackageToggle} 
        />
        {selectedPackages.length > 0 && (
          <div className="mt-4 pt-2 border-t">
            <div className="flex justify-between font-medium">
              <span>Total paquetes:</span>
              <span>${packagesTotal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
