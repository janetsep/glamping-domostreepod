
export const CalendarLegend = () => {
  return (
    <div className="flex flex-col gap-2 mt-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200"></div>
        <span>Disponible (todos o la mayoría de los domos)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-200"></div>
        <span>Disponibilidad limitada (menos de la mitad de domos)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-100 border border-red-200"></div>
        <span>No disponible (todos los domos ocupados)</span>
      </div>
      <div className="flex items-center gap-2 italic">
        <span>Los números bajo cada fecha indican: domos disponibles / total de domos</span>
      </div>
    </div>
  );
};
