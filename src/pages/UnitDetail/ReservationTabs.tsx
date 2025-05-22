
// src/pages/UnitDetail/ReservationTabs.tsx
import React from 'react';
// Corregir la importación usando rutas relativas en lugar de alias
import { GuestSelector } from '../../components/unit-detail/GuestSelector';

interface ReservationTabsProps {
  guests: number;
  onGuestsChange: (guests: number) => void;
  maxGuests?: number;
  requiredDomos: number;
  availableDomos: number;
  maxDomos?: number;
  // Propiedades adicionales requeridas
  tab?: string;
  onTabChange?: (tab: string) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date) => void;
  onEndDateChange?: (date: Date) => void;
  checkInTime?: string;
  checkOutTime?: string;
  onCheckInTimeChange?: (time: string) => void;
  onCheckOutTimeChange?: (time: string) => void;
  isAvailable?: boolean | null;
  isChecking?: boolean;
  onCheckAvailability?: () => void;
  selectedActivities?: any[];
  onActivityToggle?: (activity: any) => void;
  activitiesTotal?: number;
  selectedPackages?: any[];
  onPackageToggle?: (pkg: any) => void;
  packagesTotal?: number;
  unitId?: string;
}

export const ReservationTabs: React.FC<ReservationTabsProps> = ({
  guests,
  onGuestsChange,
  maxGuests = 16,
  requiredDomos,
  availableDomos,
  maxDomos,
  tab,
  onTabChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  checkInTime,
  checkOutTime,
  onCheckInTimeChange,
  onCheckOutTimeChange,
  isAvailable,
  isChecking,
  onCheckAvailability,
  selectedActivities,
  onActivityToggle,
  activitiesTotal,
  selectedPackages,
  onPackageToggle,
  packagesTotal,
  unitId
}) => {
  return (
    <div className="space-y-4">
      <GuestSelector
        value={guests}
        onChange={onGuestsChange}
        maxGuests={maxGuests}
        availableDomos={availableDomos}
        label="Número de huéspedes"
        required
      />
      
      <div className="text-sm text-gray-600">
        <p>Domos requeridos: {requiredDomos}</p>
        <p>Domos disponibles: {availableDomos}</p>
      </div>
      
      {/* Aquí se podrían renderizar otras partes dependiendo del tab seleccionado */}
      {tab && onTabChange && (
        <div className="mt-4">
          {/* Contenido adicional basado en la pestaña seleccionada */}
        </div>
      )}
    </div>
  );
};
