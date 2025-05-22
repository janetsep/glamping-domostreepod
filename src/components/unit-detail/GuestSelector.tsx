
// src/components/GuestSelector.tsx
import React from 'react';

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
  maxGuests?: number;
  availableDomos?: number;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  value,
  onChange,
  maxGuests = 16,
  availableDomos,
  label = 'Huéspedes',
  required = false,
  disabled = false
}) => {
  // Calcular el máximo de huéspedes basado en los domos disponibles
  const getMaxAllowedGuests = () => {
    if (availableDomos !== undefined && availableDomos > 0) {
      return Math.min(maxGuests, availableDomos * 4);
    }
    return maxGuests;
  };

  const maxAllowedGuests = getMaxAllowedGuests();
  
  // Asegurar que el valor actual no exceda el máximo permitido
  const safeValue = Math.min(value, maxAllowedGuests);
  
  // Si el valor es diferente al valor seguro, notificar el cambio
  React.useEffect(() => {
    if (value !== safeValue && safeValue > 0) {
      onChange(safeValue);
    }
  }, [safeValue, value, onChange]);

  // Crear las opciones para el selector
  const options = [];
  for (let i = 1; i <= maxAllowedGuests; i++) {
    options.push(
      <option key={i} value={i}>
        {i} {i === 1 ? 'huésped' : 'huéspedes'}
      </option>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue > 0) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={safeValue}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled || maxAllowedGuests === 0}
        required={required}
      >
        {maxAllowedGuests === 0 ? (
          <option value="">No hay disponibilidad</option>
        ) : (
          options
        )}
      </select>
      
      {/* Mensajes informativos */}
      {availableDomos !== undefined && availableDomos < 4 && availableDomos > 0 && (
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
      
      {/* Información adicional */}
      <p className="text-gray-500 text-xs mt-1">
        Cada domo puede alojar hasta 4 huéspedes
      </p>
    </div>
  );
};
