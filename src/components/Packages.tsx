
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GlampingUnit } from "@/lib/supabase";
import PackageCard from "./packages/PackageCard";
import PackageCTAs from "./packages/PackageCTAs";
import { packageData } from "./packages/packageData";
import { specialtyPackages } from "./packages/data/specialtyPackages";

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

  const handleExclusivePackageClick = () => {
    navigate(`/unit/${specialtyPackages[0].id}`);
  };

  return <section id="packages" className="py-10 bg-secondary/10">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-8">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">Descubre Nuestros Domos</h2>
        <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">Disfruta de una experiencia exclusiva en Domos TreePod: son cómodos refugios rodeados de bosque nativo, tinajas con aguas mineralizadas y una piscina de montaña alimentada por la cascada llamada Velo de la Novia, todo en un entorno natural sustentable en Valle Las Trancas.</p>
        
        {/* Paquete especial destacado */}
        <div className="mb-10 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-cyan-100">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 h-64 rounded-lg overflow-hidden">
              <img 
                src={specialtyPackages[0].image} 
                alt="Exclusividad total" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="text-2xl font-display font-bold text-primary">Exclusividad Total para Familias</h3>
              <p className="text-lg text-gray-700">{specialtyPackages[0].detailedDescription}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">${specialtyPackages[0].price.toLocaleString()}</span>
                <span className="text-lg text-gray-500 line-through">${specialtyPackages[0].originalPrice.toLocaleString()}</span>
                <span className="bg-red-500 text-white text-sm py-1 px-2 rounded-md">
                  {Math.round(((specialtyPackages[0].originalPrice - specialtyPackages[0].price) / specialtyPackages[0].originalPrice) * 100)}% Descuento
                </span>
              </div>
              <button 
                onClick={handleExclusivePackageClick}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <span>Reservar para mi familia</span>
                <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Domos con efecto hover y expansión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
      </div>
    </section>;
};

export default Packages;
