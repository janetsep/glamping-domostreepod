import { DateSelector } from "./DateSelector";
import { PackageInfoDisplay, getPackageInfo } from "./PackageInfo";
import { DomeSelector } from "./DomeSelector";
import { AvailabilityAlerts } from "./AvailabilityAlerts";
import { PackageDurationMessage } from "./PackageDurationMessage";

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

interface CelebrationPackageTabProps {
  unitId: string;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  requiredDomos?: number;
  selectedDomos: number;
  setSelectedDomos: (domos: number) => void;
  isAvailable: boolean | null;
  availableDomos?: number;
  guests: number;
}

export const CelebrationPackageTab = ({
  unitId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  requiredDomos,
  selectedDomos,
  setSelectedDomos,
  isAvailable,
  availableDomos,
  guests
}: CelebrationPackageTabProps) => {
  const packageInfo = getPackageInfo(unitId);

  return (
    <div className="space-y-4">
      <PackageInfoDisplay packageInfo={packageInfo} />
      
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        unitId={unitId}
        requiredDomos={requiredDomos}
      />
      
      <PackageDurationMessage
        startDate={startDate}
        endDate={endDate}
        packageDuration={getPackageDuration(unitId)}
      />
      
      <DomeSelector
        selectedDomos={selectedDomos}
        setSelectedDomos={setSelectedDomos}
        availableDomos={availableDomos}
        packageBasePrice={packageInfo.basePrice}
      />
      
      <AvailabilityAlerts
        isAvailable={isAvailable}
        availableDomos={availableDomos}
        requiredDomos={requiredDomos}
        guests={guests}
      />
    </div>
  );
};