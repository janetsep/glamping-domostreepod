
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

export const CalendarWeekDays = () => {
  // El problema estaba aquí: necesitamos usar la fecha actual y no una codificada
  // Usamos weekStartsOn: 1 para comenzar la semana el lunes (estándar en español)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    // Usamos "EEE" para nombre corto del día en lugar de "EEEEEE"
    // que estaba causando problemas con algunos locales
    weekDays.push(format(day, "EEE", { locale: es }).toUpperCase());
  }
  
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
