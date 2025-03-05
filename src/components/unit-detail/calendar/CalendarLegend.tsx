
export const CalendarLegend = () => {
  return (
    <div className="flex flex-col gap-2 mt-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-100 border border-red-200"></div>
        <span>No disponible</span>
      </div>
      <div className="flex items-center gap-2 italic">
        <span>El porcentaje mostrado indica la disponibilidad de domos para cada fecha</span>
      </div>
    </div>
  );
};
