import React from 'react';
export const CalendarLegend = () => {
  return <div className="mt-4 text-sm">
      <p className="text-gray-700 mb-2">* El formato de disponibilidad es: disponibles/total</p>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-green-100 mr-2"></div>
          <span>Disponible (suficientes domos)</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-yellow-100 mr-2"></div>
          <span>Disponibilidad parcial (insuficientes domos)</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-red-100 mr-2"></div>
          <span>No disponible</span>
        </div>
      </div>
      
    </div>;
};