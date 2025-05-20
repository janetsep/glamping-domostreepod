
import React from 'react';

export const CalendarLegend = () => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
        <span>Disponible (4/4)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-amber-100 rounded-full mr-1"></div>
        <span>Disponibilidad parcial</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
        <span>No disponible (0/4)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
        <span>Seleccionado</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-gray-100 rounded-full mr-1"></div>
        <span>No seleccionable</span>
      </div>
    </div>
  );
};
