
import { useState } from 'react';
import { useReservationLookup } from "@/hooks/reservations/useReservationLookup";
import { ReservationDetails } from "@/components/unit-detail/ReservationDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ReservationLookup() {
  const [code, setCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  
  const { data: reservation, isLoading, isError, error } = useReservationLookup(searchCode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCode(code);
  };

  if (isLoading) {
    return <div>Buscando reserva...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ingresa el código de reserva"
          className="max-w-xs"
        />
        <Button type="submit">Buscar</Button>
      </form>

      {isError && (
        <div className="text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Error al buscar la reserva'}
        </div>
      )}

      {reservation && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Detalles de la Reserva</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Estado:</span> {reservation.status}</p>
              <p><span className="font-semibold">Cliente:</span> {reservation.client_name}</p>
              <p><span className="font-semibold">Email:</span> {reservation.client_email}</p>
              <p><span className="font-semibold">Teléfono:</span> {reservation.client_phone}</p>
              <p><span className="font-semibold">Unidad:</span> {reservation.unit_id}</p>
              <p><span className="font-semibold">Check-in:</span> {format(new Date(reservation.check_in), 'PPP', { locale: es })}</p>
              <p><span className="font-semibold">Check-out:</span> {format(new Date(reservation.check_out), 'PPP', { locale: es })}</p>
              <p><span className="font-semibold">Huéspedes:</span> {reservation.guests}</p>
            </div>
          </div>

          <ReservationDetails
            startDate={new Date(reservation.check_in)}
            endDate={new Date(reservation.check_out)}
            guests={reservation.guests}
            quote={{
              totalPrice: reservation.total_price,
              basePrice: reservation.total_price,
              selectedActivities: reservation.selected_activities || [],
              selectedPackages: reservation.selected_packages || [],
              nights: 0  // Se calculará automáticamente
            }}
            paymentDetails={reservation.payment_details}
          />
        </div>
      )}
    </div>
  );
}
