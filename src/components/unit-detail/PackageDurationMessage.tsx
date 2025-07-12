import { differenceInDays } from "date-fns";

interface PackageDurationMessageProps {
  startDate?: Date;
  endDate?: Date;
  packageDuration: number; // Duration in days
}

export const PackageDurationMessage = ({
  startDate,
  endDate,
  packageDuration = 2
}: PackageDurationMessageProps) => {
  if (!startDate || !endDate) return null;

  const selectedDays = differenceInDays(endDate, startDate);

  if (selectedDays < packageDuration) {
    return (
      <div className="p-3 bg-blue-50 border border-blue-100 rounded text-blue-800 text-sm">
        Esta experiencia está diseñada para {packageDuration} días. Te recomendamos ajustar tus fechas para disfrutar de la experiencia completa.
      </div>
    );
  }

  if (selectedDays > packageDuration) {
    const extraNights = selectedDays - packageDuration;
    return (
      <div className="p-3 bg-amber-50 border border-amber-100 rounded text-amber-800 text-sm">
        Esta experiencia dura {packageDuration} días. 
        {extraNights === 1 
          ? ` La noche extra se cobrará adicionalmente e incluye solo desayuno (sin experiencias).`
          : ` Las ${extraNights} noches extras se cobrarán adicionalmente e incluyen solo desayuno (sin experiencias).`
        }
      </div>
    );
  }

  return null;
};