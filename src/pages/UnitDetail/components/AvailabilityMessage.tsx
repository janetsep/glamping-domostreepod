interface AvailabilityMessageProps {
  availableDomos?: number;
  startDate?: Date;
  endDate?: Date;
  guests: number;
}
export const AvailabilityMessage = ({
  availableDomos,
  startDate,
  endDate,
  guests
}: AvailabilityMessageProps) => {
  const calculatedRequiredDomos = Math.ceil(guests / 4);
  console.log('🔍 [AvailabilityMessage] Estado actual:', {
    availableDomos,
    guests,
    calculatedRequiredDomos,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString()
  });
  let availableMessage = '';
  let messageStyle = '';
  if (availableDomos === undefined) {
    availableMessage = "Calculando disponibilidad...";
    messageStyle = 'text-blue-700';
  } else if (!startDate || !endDate) {
    availableMessage = "Selecciona fechas para ver la disponibilidad.";
    messageStyle = 'text-blue-700';
  } else if (availableDomos === 0) {
    availableMessage = "No hay domos disponibles para todas las noches del período seleccionado.";
    messageStyle = 'text-red-600 bg-red-50 border border-red-200';
  } else if (availableDomos < calculatedRequiredDomos) {
    availableMessage = `Solo hay ${availableDomos} domo${availableDomos === 1 ? "" : "s"} disponible${availableDomos === 1 ? "" : "s"} para todas las noches seleccionadas. Se requieren ${calculatedRequiredDomos} domos para alojar a ${guests} huésped${guests > 1 ? "es" : ""}.`;
    messageStyle = 'text-amber-700 bg-amber-50 border border-amber-100';
  } else if (availableDomos === 1) {
    availableMessage = "¡Solo queda 1 domo disponible para todas las noches seleccionadas 🔥!";
    messageStyle = 'text-orange-700 bg-orange-50 border border-orange-100';
  } else {
    availableMessage = `Tenemos ${availableDomos} domo${availableDomos === 1 ? "" : "s"} disponibles para todas las noches seleccionadas.`;
    messageStyle = 'text-blue-700 bg-blue-50 border border-blue-100';
  }
  console.log('🔍 [AvailabilityMessage] Mensaje generado:', {
    mensaje: availableMessage,
    estilo: messageStyle
  });
  
  return (
    <div className={`p-3 rounded-lg ${messageStyle}`}>
      <p className="text-sm font-medium">{availableMessage}</p>
    </div>
  );
};