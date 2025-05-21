// Añadir esto donde corresponda en useUnitDetailController.ts

const handleReservation = async () => {
  // ... código existente
  
  // CORRECCIÓN: Validar disponibilidad antes de continuar
  if (availableDomos !== undefined && requiredDomos > availableDomos) {
    toast.error(`Solo hay ${availableDomos} de 4 domos disponibles. Necesitas ${requiredDomos} para tu reserva.`);
    return;
  }
  
  // ... resto del código
};

const handleConfirmReservation = async () => {
  // ... código existente
  
  // CORRECCIÓN: Volver a validar disponibilidad antes de confirmar
  const { isAvailable, availableUnits } = await checkGeneralAvailability(
    new Date(checkInDate),
    new Date(checkOutDate),
    requiredDomos
  );
  
  if (!isAvailable) {
    toast.error(`No hay suficiente disponibilidad. Solo hay ${availableUnits} de 4 domos disponibles.`);
    return;
  }
  
  // ... resto del código
};