import { MapPin, Trees, Droplets, Bird, Car, Bus, Plane, ConciergeBell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useElfsight } from '@/hooks/useElfsight';

const Location = () => {
  const navigate = useNavigate();
  
  // Force Elfsight initialization for map widget
  useElfsight('3b2bec9e-cc66-481c-88a9-3f156d8a74a3', 2000);
  
  const handleExploreClick = () => {
    navigate("/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9"); // ID del Domo Araucaria
  };

  return (
    <section id="location" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">¿Dónde Estamos?</h2>
          <p className="section-description">
            En el Valle Las Trancas, rodeados de bosque nativo y de montañas que cambian de color con las estaciones.
          </p>
        </div>
        
        {/* Widget Elfsight Google Maps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del mapa */}
            <div className="bg-primary text-white p-4">
              <div className="flex items-center justify-center gap-3">
                <MapPin className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Valle Las Trancas, Chile</h3>
              </div>
            </div>
            
            {/* Widget Elfsight */}
            <div className="min-h-[400px] bg-white p-4">
              <div className="elfsight-app-3b2bec9e-cc66-481c-88a9-3f156d8a74a3" data-elfsight-app-lazy></div>
            </div>
            
            {/* Información básica */}
            <div className="bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span>1.5h desde Chillán</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Plane className="h-4 w-4 text-primary" />
                  <span>5h desde Santiago</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Trees className="h-4 w-4 text-primary" />
                  <span>En bosque nativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón final */}
        <div className="text-center">
          <Button 
            onClick={handleExploreClick}
            className="btn-primary"
          >
            <ConciergeBell className="h-4 w-4 mr-2" />
            Reservar Tu Experiencia
          </Button>
          <p className="text-sm text-gray-500 mt-3">¡Vive la montaña de una forma única!</p>
        </div>
      </div>
    </section>
  );
};

export default Location;