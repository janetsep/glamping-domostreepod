
import React from "react";

export const CalendarWeekDays = () => {
  // Usamos un array estático con los nombres de los días en español
  // empezando por lunes (formato estándar en español)
  const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  
  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      {weekDays.map((day, index) => (
        <div 
          key={index} 
          className="text-center font-medium text-gray-600 text-base"
        >
          {day}
        </div>
      ))}
    </div>
  );
};
