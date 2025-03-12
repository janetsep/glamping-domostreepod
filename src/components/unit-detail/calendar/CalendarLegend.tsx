
export const CalendarLegend = () => {
  return (
    <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-100 rounded-full mr-2"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-100 rounded-full mr-2"></div>
        <span>No disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
        <span>Seleccionado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-primary/20 rounded-full mr-2"></div>
        <span>Rango seleccionado</span>
      </div>
    </div>
  );
};
