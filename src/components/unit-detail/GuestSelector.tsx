import React, { useEffect } from 'react';

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
  maxGuests?: number;
  availableDomos?: number;
  label?: string;
  required?: boolean;
}

export const GuestSelector = ({
  value,
  onChange,
  maxGuests = 16, // Valor por defecto máximo
  availableDomos,
  label = 'Huéspedes',
  required = false
}: GuestSelectorProps) => {
  // CORRECCIÓN: Calcular el máximo de huéspedes basado en los domos disponibles
  const maxAllowedGuests = availableDomos !== undefined 
    ? Math.min(maxGuests, availableDomos * 4) // Cada domo permite 4 huéspedes
    : maxGuests;
  
  // Si el valor actual excede el máximo permitido, ajustarlo
  useEffect(() => {
    if (value > maxAllowedGuests && maxAllowedGuests > 0) {
      onChange(maxAllowedGuests);
    }
  }, [maxAllowedGuests, value, onChange]);

  // Crear las opciones para el selector
  const options = Array.from(
    { length: maxAllowedGuests }, 
    (_, i) => ({
      value: i + 1,
      label: `${i + 1} ${i === 0 ? 'huésped' : 'huéspedes'}`
    })
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded-md"
        disabled={maxAllowedGuests === 0}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {maxAllowedGuests < maxGuests && availableDomos !== undefined && (
        <p className="text-amber-600 text-sm mt-1">
          Solo hay {availableDomos} {availableDomos === 1 ? 'domo disponible' : 'domos disponibles'} 
          (máximo {maxAllowedGuests} huéspedes).
        </p>
      )}
      
      {maxAllowedGuests === 0 && (
        <p className="text-red-600 text-sm mt-1">
          No hay domos disponibles para las fechas seleccionadas.
        </p>
      )}
    </div>
  );
};