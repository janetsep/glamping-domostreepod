
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
  maxGuests?: number;
  availableDomos?: number;
  label?: string;
  required?: boolean;
  adults?: number;
  children?: number;
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
}

export const GuestSelector = ({
  value,
  onChange,
  maxGuests = 16,
  availableDomos,
  label = 'Huéspedes',
  required = false,
  adults = 2,
  children = 0,
  onAdultsChange,
  onChildrenChange
}: GuestSelectorProps) => {
  // IMPORTANTE: Si availableDomos es undefined, no mostrar limitaciones
  // Solo aplicar limitaciones cuando availableDomos tiene un valor válido
  const maxAllowedGuests = availableDomos !== undefined ? Math.min(maxGuests, availableDomos * 4) : maxGuests;
  
  // Calcular domos requeridos según huéspedes seleccionados
  const requiredDomos = Math.ceil(value / 4);


  const handleAdultsChange = (newAdults: number) => {
    if (newAdults >= 0 && newAdults + children <= maxAllowedGuests) {
      onAdultsChange?.(newAdults);
      onChange(newAdults + children);
    }
  };

  const handleChildrenChange = (newChildren: number) => {
    if (newChildren >= 0 && adults + newChildren <= maxAllowedGuests) {
      onChildrenChange?.(newChildren);
      onChange(adults + newChildren);
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="guest-selector"
        className="block text-sm font-medium text-gray-700 mb-3"
      >
        {label} (Máx. 4 por domo) {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="border border-gray-300 rounded-lg p-4 space-y-4 bg-white">
        {/* Selector de Adultos */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Adultos:</span>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => handleAdultsChange(adults - 1)}
              disabled={adults <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-medium">{adults}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => handleAdultsChange(adults + 1)}
              disabled={adults + children >= maxAllowedGuests}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selector de Niños */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Niños:</span>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => handleChildrenChange(children - 1)}
              disabled={children <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-medium">{children}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => handleChildrenChange(children + 1)}
              disabled={adults + children >= maxAllowedGuests}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Solo mostrar limitaciones si availableDomos tiene un valor válido */}
      {availableDomos !== undefined && maxAllowedGuests < maxGuests && availableDomos > 0 && (
        <p className="text-amber-600 text-sm mt-2">
          Solo hay {availableDomos} {availableDomos === 1 ? 'domo disponible' : 'domos disponibles'} 
          (máximo {maxAllowedGuests} huéspedes).
        </p>
      )}
      
      {availableDomos !== undefined && availableDomos === 0 && (
        <p className="text-red-600 text-sm mt-2">
          No hay domos disponibles para las fechas seleccionadas.
        </p>
      )}
      
      <p className="text-gray-500 text-xs mt-2">
        Cada domo puede alojar hasta 4 huéspedes
      </p>
      
      {value > 0 && (
        <p className="text-blue-700 text-sm mt-2 font-medium">
          Se necesitan {requiredDomos} domo{requiredDomos > 1 ? 's' : ''} para {value} huésped{value > 1 ? 'es' : ''}.
        </p>
      )}
    </div>
  );
};
