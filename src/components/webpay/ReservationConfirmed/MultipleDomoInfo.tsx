
import React from 'react';

interface MultipleDomoInfoProps {
  requiredDomos: number;
  totalGuests: number;
  allReservations: any[];
}

export const MultipleDomoInfo: React.FC<MultipleDomoInfoProps> = ({
  requiredDomos,
  totalGuests,
  allReservations
}) => {
  if (requiredDomos <= 1) return null;

  return (
    <div className="bg-amber-50 p-4 rounded-md mb-4">
      <p className="text-amber-800 font-medium mb-2">
        Tu reserva incluye {requiredDomos} domos:
      </p>
      <p className="text-sm text-amber-700 mb-2">
        Para {totalGuests} huéspedes hemos reservado {requiredDomos} domos geodésicos.
        Cada domo tiene capacidad para hasta 4 personas.
      </p>
      <div className="space-y-1">
        {allReservations.map((res, index) => (
          <div key={res.id} className="text-sm text-amber-700">
            • Domo {index + 1} (Unidad {res.unit_id}): {res.guests} {res.guests === 1 ? 'persona' : 'personas'}
          </div>
        ))}
      </div>
    </div>
  );
};
