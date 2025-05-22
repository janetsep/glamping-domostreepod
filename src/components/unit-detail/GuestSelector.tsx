
// src/components/unit-detail/GuestSelector.tsx
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
  // 🐛 DEBUG: Log de props al inicio del componente
  console.log('🔍 GuestSelector Props recibidos:', {
    value,
    onChange: typeof onChange,
    maxGuests,
    availableDomos,
    disabled,
    label
  });

  const getMaxAllowedGuests = () => {
    if (availableDomos !== undefined && availableDomos > 0) {
      return Math.min(maxGuests, availableDomos * 4);
    }
    return maxGuests;
  };

  const maxAllowedGuests = getMaxAllowedGuests();
  const safeValue = Math.min(value, maxAllowedGuests);
  
  // 🐛 DEBUG: Log de valores calculados
  console.log('🔍 GuestSelector Valores calculados:', {
    maxAllowedGuests,
    safeValue,
    originalValue: value
  });

  React.useEffect(() => {
    if (value !== safeValue && safeValue > 0) {
      console.log('🔍 GuestSelector useEffect: Ajustando valor', {
        from: value,
        to: safeValue
      });
      onChange(safeValue);
    }
  }, [safeValue, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    
    // 🐛 DEBUG: Log detallado del cambio
    console.log('🔍 GuestSelector handleChange INICIADO:', {
      eventTargetValue: e.target.value,
      parsedValue: newValue,
      currentValue: value,
      isValidNumber: !isNaN(newValue),
      willCallOnChange: !isNaN(newValue) && newValue > 0
    });
    
    if (!isNaN(newValue) && newValue > 0) {
      console.log('🔍 GuestSelector: Llamando onChange con:', newValue);
      onChange(newValue);
      
      // 🐛 DEBUG: Verificar si onChange se ejecutó
      setTimeout(() => {
        console.log('🔍 GuestSelector: Valor después de onChange:', value);
      }, 100);
    } else {
      console.log('❌ GuestSelector: Valor inválido, no se ejecuta onChange');
    }
  };

  // Crear las opciones para el selector
  const options = [];
  for (let i = 1; i <= maxAllowedGuests; i++) {
    options.push(
      <option key={i} value={i}>
        {i} {i === 1 ? 'huésped' : 'huéspedes'}
      </option>
    );
  }

  // 🐛 DEBUG: Log antes del render
  console.log('🔍 GuestSelector antes del render:', {
    finalValue: safeValue,
    optionsCount: maxAllowedGuests,
    isDisabled: disabled || maxAllowedGuests === 0
  });

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
        onFocus={() => console.log('🔍 GuestSelector: Select recibió focus')}
        onBlur={() => console.log('🔍 GuestSelector: Select perdió focus')}
      >
        {maxAllowedGuests === 0 ? (
          <option value="">No hay disponibilidad</option>
        ) : (
          options
        )}
      </select>
      
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
      
      <p className="text-gray-500 text-xs mt-1">
        Cada domo puede alojar hasta 4 huéspedes
      </p>
    </div>
  );
};