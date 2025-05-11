
export const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
        <span>No disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-primary rounded mr-2"></div>
        <span>Seleccionado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
        <span>No seleccionable</span>
      </div>
    </div>
  );
};
