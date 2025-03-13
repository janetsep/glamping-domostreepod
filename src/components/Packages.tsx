
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GlampingUnit } from "@/lib/supabase";
import PackageCard from "./packages/PackageCard";
import CountdownTimer from "./packages/CountdownTimer";
import PackageCTAs from "./packages/PackageCTAs";
import { packageData } from "./packages/packageData";

interface PackagesProps {
  units: GlampingUnit[];
  isLoading: boolean;
}

const Packages = ({
  units,
  isLoading
}: PackagesProps) => {
  const navigate = useNavigate();
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const handleUnitClick = (unitId: string) => {
    navigate(`/unit/${unitId}`);
  };

  const toggleExpandUnit = (unitId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const handleReservationClick = () => {
    navigate(`/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9`);
  };

  return <section id="packages" className="py-20 bg-secondary/10">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">Descubre Nuestros Domos</h2>
        <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">Disfruta de una experiencia exclusiva en Domos TreePod: son cómodos refugios rodeados de bosque nativo, tinajas con aguas mineralizadas y una piscina de montaña alimentada por la cascada llamada Velo de la Novia, todo en un entorno natural sustentable.</p>
        
        {/* Domos con efecto hover y expansión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-8 mb-16">
          {packageData.map(pkg => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              hoveredUnit={hoveredUnit} 
              expandedUnit={expandedUnit} 
              setHoveredUnit={setHoveredUnit} 
              toggleExpandUnit={toggleExpandUnit} 
              handleUnitClick={handleUnitClick} 
            />
          ))}
        </div>
        
        <PackageCTAs onMainCTAClick={handleReservationClick} onViewAvailabilityClick={() => handleUnitClick("48a7a330-ebae-4e79-8f53-31a84ac900d9")} />
        
        <CountdownTimer initialTimeLeft={{
          days: 3,
          hours: 8,
          minutes: 45
        }} />
      </div>
    </section>;
};

export default Packages;
