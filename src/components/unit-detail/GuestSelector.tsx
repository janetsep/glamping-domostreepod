
// src/pages/UnitDetail/ReservationTabs.tsx
import React from 'react';
// Cambia esta línea según la ubicación real de tu GuestSelector
// Opción 1: Si está en src/components/
import { GuestSelector } from '../../components/GuestSelector';

// Opción 2: Si está en otra carpeta, ajusta la ruta
// import { GuestSelector } from '../../../components/GuestSelector';

// Opción 3: Si tu proyecto no tiene configurado el alias @, usa rutas relativas
// import { GuestSelector } from '../../components/GuestSelector';

interface ReservationTabsProps {
  guests: number;
  onGuestsChange: (guests: number) => void;
  maxGuests?: number;
  requiredDomos: number;
  availableDomos: number;
  maxDomos?: number;
}

export const ReservationTabs: React.FC<ReservationTabsProps> = ({
  guests,
  onGuestsChange,
  maxGuests = 16,
  requiredDomos,
  availableDomos,
  maxDomos
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
    </div>
  );
};