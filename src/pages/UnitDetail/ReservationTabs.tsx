
// src/pages/UnitDetail/ReservationTabs.tsx
import React from 'react';
// CORRECTO: Basado en la estructura que muestras
import { GuestSelector } from '../../components/unit-detail/GuestSelector';

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