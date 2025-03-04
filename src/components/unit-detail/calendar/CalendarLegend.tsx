
export const CalendarLegend = () => {
  return (
    <div className="flex justify-center items-center mt-4 space-x-6 text-sm">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
        <span>No disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
        <span>Seleccionado</span>
      </div>
    </div>
  );
};
