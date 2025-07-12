
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
  adults?: number;
  children?: number;
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
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
  adults = 2,
  children = 0,
  onAdultsChange,
  onChildrenChange,
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
  // Detectar si es un paquete de celebración
  const isCelebrationPackage = unitId && (
    unitId.includes('package') || 
    unitId === 'mujeres-relax-package' ||
    unitId === 'cumpleanos-package' ||
    unitId === 'aniversario-package' ||
    unitId === 'familia-package'
  );

  // Obtener información del paquete
  const getPackageInfo = (packageId: string) => {
    switch (packageId) {
      case 'mujeres-relax-package':
        return {
          name: 'Mujeres al Descanso y Relax',
          duration: '2 noches',
          price: '$520.000',
          description: 'Paquete fijo por domo, incluye todas las comodidades para hasta 8 personas'
        };
      case 'cumpleanos-package':
        return {
          name: 'Cumpleaños en la Naturaleza',
          duration: '2 noches',
          price: '$580.000',
          description: 'Paquete fijo por domo con decoración especial'
        };
      default:
        return {
          name: 'Paquete de Celebración',
          duration: '2 noches',
          price: 'Precio fijo',
          description: 'Paquete por domo'
        };
    }
  };

  const packageInfo = isCelebrationPackage ? getPackageInfo(unitId) : null;

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
        {/* Información del paquete para paquetes de celebración */}
        {isCelebrationPackage && packageInfo && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
            <h3 className="font-semibold text-primary mb-2">{packageInfo.name}</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Duración:</span> {packageInfo.duration}</p>
              <p><span className="font-medium">Precio:</span> {packageInfo.price} por domo</p>
              <p className="text-gray-600">{packageInfo.description}</p>
            </div>
          </div>
        )}
        
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          unitId={unitId}
          requiredDomos={requiredDomos}
        />
        
        {/* Selector de huéspedes solo para unidades regulares */}
        {!isCelebrationPackage && (
          <GuestSelector
            value={guests}
            onChange={onGuestsChange}
            maxGuests={16}
            availableDomos={availableDomos}
            adults={adults}
            children={children}
            onAdultsChange={onAdultsChange}
            onChildrenChange={onChildrenChange}
          />
        )}
        
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
