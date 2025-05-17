
import React from 'react';

export const CalendarLegend = () => {
  return (
    <div className="mt-4 flex justify-center space-x-6 text-xs">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
        <span>No disponible</span>
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
