
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

export const CalendarWeekDays = () => {
  // Usar locale español para mostrar los días de la semana correctamente
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Comienza en lunes
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    // Usamos EEE para obtener el nombre corto del día de la semana en español
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
