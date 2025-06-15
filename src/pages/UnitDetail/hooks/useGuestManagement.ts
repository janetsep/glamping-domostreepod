
import { useState, useEffect } from "react";

export const useGuestManagement = (availableDomos: number | undefined) => {
  const [guests, setGuests] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Efecto para ajustar automáticamente los huéspedes cuando cambie availableDomos
  useEffect(() => {
    // No hacer nada si la disponibilidad aún no se ha determinado
    if (availableDomos === undefined) {
      return;
    }

    const maxGuestsAllowed = availableDomos * 4;
    
    // SOLO ajustar si los huéspedes actuales EXCEDEN la capacidad máxima
    if (guests > maxGuestsAllowed) {
      console.log('🔄 [useGuestManagement] Ajustando huéspedes porque exceden capacidad:', {
        huéspedesAntes: guests,
        máximoPermitido: maxGuestsAllowed,
        domosDisponibles: availableDomos
      });
      
      // Si la capacidad máxima es 0, resetear todo
      if (maxGuestsAllowed === 0) {
        setGuests(0);
        setAdults(0);
        setChildren(0);
      } else {
        // Ajustar al máximo permitido
        setGuests(maxGuestsAllowed);
        
        // Distribuir huéspedes entre adultos y niños, priorizando mantener los adultos actuales
        const newAdults = Math.max(1, Math.min(adults, maxGuestsAllowed));
        const newChildren = maxGuestsAllowed - newAdults;
        
        setAdults(newAdults);
        setChildren(newChildren);
      }
    }
  }, [availableDomos, guests, adults]);

  return {
    guests,
    adults,
    children,
    setGuests,
    setAdults,
    setChildren
  };
};
