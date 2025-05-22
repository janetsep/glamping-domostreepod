
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
  maxGuests = 16,
  availableDomos,
  label = 'Huéspedes',
  required = false
}: GuestSelectorProps) => {
  // 🐛 DEBUG: Log de props al inicio del componente
  console.log('🔍 GuestSelector Props recibidos:', {
    value,
    onChange: typeof onChange,
    maxGuests,
    availableDomos,
    label
  });

  // CORRECCIÓN: Calcular el máximo de huéspedes basado en los domos disponibles
  const maxAllowedGuests = availableDomos !== undefined 
    ? Math.min(maxGuests, availableDomos * 4) // Cada domo permite 4 huéspedes
    : maxGuests;
  
  // 🐛 DEBUG: Log de valores calculados
  console.log('🔍 GuestSelector Valores calculados:', {
    maxAllowedGuests,
    originalValue: value
  });

  // CORRECCIÓN: Quitar onChange de las dependencias para evitar loops infinitos
  useEffect(() => {
    if (value > maxAllowedGuests && maxAllowedGuests > 0) {
      console.log('🔍 GuestSelector useEffect: Ajustando valor', {
        from: value,
        to: maxAllowedGuests
      });
      onChange(maxAllowedGuests);
    }
  }, [maxAllowedGuests, value]); // Removido onChange de las dependencias

  // CORRECCIÓN: Función de cambio con debugging
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    
    // 🐛 DEBUG: Log detallado del cambio
    console.log('🔍 GuestSelector handleChange INICIADO:', {
      eventValue: e.target.value,
      parsedValue: newValue,
      currentValue: value,
      isValidNumber: !isNaN(newValue),
      willCallOnChange: !isNaN(newValue) && newValue > 0
    });
    
    if (!isNaN(newValue) && newValue > 0) {
      console.log('🔍 GuestSelector: Llamando onChange con:', newValue);
      onChange(newValue);
      
      // 🐛 DEBUG: Verificar si onChange se ejecutó después de un tick
      setTimeout(() => {
        console.log('🔍 GuestSelector: Estado después de onChange:', value);
      }, 100);
    } else {
      console.log('❌ GuestSelector: Valor inválido, no se ejecuta onChange');
    }
  };

  // Crear las opciones para el selector
  const options = Array.from(
    { length: maxAllowedGuests }, 
    (_, i) => ({
      value: i + 1,
      label: `${i + 1} ${i === 0 ? 'huésped' : 'huéspedes'}`
    })
  );

  // 🐛 DEBUG: Log antes del render
  console.log('🔍 GuestSelector antes del render:', {
    finalValue: value,
    optionsCount: maxAllowedGuests,
    isDisabled: maxAllowedGuests === 0
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={value}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={maxAllowedGuests === 0}
        required={required}
        // 🐛 DEBUG: Eventos adicionales para debugging
        onFocus={() => console.log('🔍 GuestSelector: Select recibió focus')}
        onBlur={() => console.log('🔍 GuestSelector: Select perdió focus')}
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
      
      {maxAllowedGuests < maxGuests && availableDomos !== undefined && availableDomos > 0 && (
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