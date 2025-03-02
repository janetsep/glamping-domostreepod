
import { Button } from "@/components/ui/button";

interface PackageCTAsProps {
  onMainCTAClick: () => void;
  onViewAvailabilityClick: () => void;
}

const PackageCTAs = ({ onMainCTAClick, onViewAvailabilityClick }: PackageCTAsProps) => {
  return (
    <>
      {/* CTA después de la sección de domos */}
      <div className="mt-12 mb-16 bg-gradient-to-r from-cyan-500/10 to-cyan-500/10 rounded-lg p-8 text-center">
        <h3 className="text-2xl md:text-3xl font-display font-bold text-cyan-500 mb-3">
          ¿Te imaginas despertando con estas vistas?
        </h3>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Reserva tu domo ahora y prepárate para vivir una experiencia inolvidable en medio de la naturaleza.
        </p>
        <Button 
          size="lg" 
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
          onClick={onMainCTAClick}
        >
          Asegura tu experiencia ahora
        </Button>
      </div>
      
      {/* Disponibilidad limitada - Enhanced CTA */}
      <div className="text-center mt-10 mb-6">
        <p className="text-sm text-red-600 font-semibold mb-4">
          ¡Solo quedan 3 domos disponibles para este fin de semana!
        </p>
        <Button 
          size="lg" 
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={onViewAvailabilityClick}
        >
          Ver Disponibilidad
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          No esperes más, la naturaleza te está esperando
        </p>
      </div>
    </>
  );
};

export default PackageCTAs;
