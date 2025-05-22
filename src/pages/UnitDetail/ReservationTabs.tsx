
// src/pages/UnitDetail/ReservationTabs.tsx
import React from 'react';
// Ajusta la ruta según la ubicación real de tu GuestSelector
import { GuestSelector } from '../../components/GuestSelector';

interface ReservationTabsProps {
  // Props existentes
  guests: number;
  onGuestsChange: (guests: number) => void;
  maxGuests?: number;
  requiredDomos: number;
  availableDomos: number;
  maxDomos?: number;
  
  // Props adicionales que se están pasando desde ReservationForm
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
  isAvailable?: boolean;
  isChecking?: boolean;
  onCheckAvailability?: () => void;
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
  onCheckAvailability
}) => {
  return (
    <div className="space-y-4">
      {/* Tabs si es necesario */}
      {tab && onTabChange && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => onTabChange('dates')}
            className={`px-4 py-2 rounded ${tab === 'dates' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Fechas
          </button>
          <button
            onClick={() => onTabChange('guests')}
            className={`px-4 py-2 rounded ${tab === 'guests' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Huéspedes
          </button>
        </div>
      )}
      
      {/* Selector de fechas */}
      {(startDate !== undefined || endDate !== undefined) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de entrada
            </label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => onStartDateChange && onStartDateChange(new Date(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de salida
            </label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => onEndDateChange && onEndDateChange(new Date(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}
      
      {/* Selector de huéspedes */}
      <GuestSelector
        value={guests}
        onChange={onGuestsChange}
        maxGuests={maxGuests}
        availableDomos={availableDomos}
        label="Número de huéspedes"
        required
      />
      
      {/* Información de domos */}
      <div className="text-sm text-gray-600">
        <p>Domos requeridos: {requiredDomos}</p>
        <p>Domos disponibles: {availableDomos}</p>
      </div>
      
      {/* Botón de verificación si está disponible */}
      {onCheckAvailability && (
        <button
          onClick={onCheckAvailability}
          disabled={isChecking}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isChecking ? 'Verificando...' : 'Verificar Disponibilidad'}
        </button>
      )}
    </div>
  );
};