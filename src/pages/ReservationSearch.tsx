
import { ReservationLookup } from "@/components/reservations/ReservationLookup";

export default function ReservationSearch() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Buscar Reserva</h1>
        <ReservationLookup />
      </div>
    </div>
  );
}
