import React from 'react';

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
  maxGuests = 16,
  availableDomos = 4, // Valor por defecto de 4 domos
  label = 'Huéspedes',
  required = false
}: GuestSelectorProps) => {
  // Calcular el máximo de huéspedes basado en los domos disponibles
  const maxAllowedGuests = Math.min(maxGuests, availableDomos * 4);
  // Calcular domos requeridos según huéspedes seleccionados
  const requiredDomos = Math.ceil(value / 4);
  
  // Crear las opciones para el selector
  const options = Array.from(
    { length: maxAllowedGuests }, 
    (_, i) => ({
      value: i + 1,
      label: `${i + 1} ${i === 0 ? 'huésped' : 'huéspedes'}`
    })
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue > 0) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="guest-selector"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        id="guest-selector"
        value={value}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={maxAllowedGuests === 0}
        required={required}
        aria-labelledby="guest-selector-label"
      >
        {maxAllowedGuests === 0 ? (
          <option value="">No hay disponibilidad</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
      
      {maxAllowedGuests < maxGuests && availableDomos > 0 && (
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
      
      <p className="text-gray-500 text-xs mt-1">
        Cada domo puede alojar hasta 4 huéspedes
      </p>
      
      {value > 0 && (
        <p className="text-blue-700 text-sm mt-1 font-medium">
          Se necesitan {requiredDomos} domo{requiredDomos > 1 ? 's' : ''} para {value} huésped{value > 1 ? 'es' : ''}.
        </p>
      )}
    </div>
  );
};