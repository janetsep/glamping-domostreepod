
import { ConciergeBell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackageCTAsProps {
  onMainCTAClick: () => void;
  onViewAvailabilityClick: () => void;
}

const PackageCTAs = ({
  onMainCTAClick,
  onViewAvailabilityClick
}: PackageCTAsProps) => {
  return <>
      {/* CTA después de la sección de domos */}
      <div className="mt-12 mb-16 bg-gradient-to-r from-cyan-500/10 to-cyan-500/10 rounded-lg p-8 text-center">
        <h3 className="text-2xl md:text-3xl font-display font-bold text-cyan-500 mb-3">¿Te imaginas despertar cerca de árboles nativos?</h3>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">Reserva tu estadía y descubre cómo cada rincón guarda una historia esperando ser vivida.</p>
        <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium flex items-center gap-2" onClick={onMainCTAClick}>
          <ConciergeBell className="h-5 w-5" />
          <span>Asegura tu experiencia ahora</span>
        </Button>
      </div>
      
      {/* Disponibilidad limitada - Enhanced CTA */}
      <div className="text-center mt-10 mb-6">
        
        
        
      </div>
    </>;
};
export default PackageCTAs;
