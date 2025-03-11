
import { ReservationLookup } from "@/components/reservations/ReservationLookup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ReservationSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Buscar Reserva</h1>
        </div>
        
        {code === '468654' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="font-medium">Estás buscando la reserva con código: <strong>468654</strong></p>
          </div>
        )}
        
        <ReservationLookup />
      </div>
    </div>
  );
}
