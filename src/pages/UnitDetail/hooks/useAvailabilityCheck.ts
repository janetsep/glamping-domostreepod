
import { toast } from "sonner";

type AvailabilityState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
  setIsAvailable: (isAvailable: boolean) => void;
  setCheckedAvailability: (checked: boolean) => void;
  requiredDomos?: number;
};

export const useAvailabilityCheck = (state: AvailabilityState) => {
  const checkDatesAvailability = async () => {
    if (state.startDate && state.endDate && state.displayUnit && !state.checkedAvailability) {
      const requiredDomos = state.requiredDomos || 1;
      
      let allAvailable = true;
      for (let i = 0; i < requiredDomos; i++) {
        const available = await state.checkAvailability(
          state.displayUnit.id,
          state.startDate,
          state.endDate
        );
        if (!available) {
          allAvailable = false;
          break;
        }
      }
      
      state.setIsAvailable(allAvailable);
      state.setCheckedAvailability(true);
      
      if (allAvailable) {
        toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios.`);
      } else {
        toast.error(`No hay suficientes domos disponibles para las fechas seleccionadas. Se necesitan ${requiredDomos} domos.`);
      }
    }
  };

  return {
    checkDatesAvailability,
  };
};
