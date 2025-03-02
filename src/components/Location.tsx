import { MapPin, Trees, Droplets, Bird, Car, Bus, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Location = () => {
  const navigate = useNavigate();
  
  const handleExploreClick = () => {
    navigate("/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9"); // ID del Domo Araucaria
  };
  
  return (
    <section id="location" className="py-20 bg-white">
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Ubicación y Entorno
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Ubicados en el Valle Las Trancas, a 10 minutos de las Termas de Chillán, rodeados de bosques vírgenes y lejos del ruido urbano
        </p>
        
        <div className="w-full mb-12">
          <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192!2d-71.487!3d-36.907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzrCsDU0JzI1LjIiUyA3McKwMjknMTMuMiJX!5e0!3m2!1ses!2scl!4v1715374232348!5m2!1ses!2scl&q=3FQV%2B7FW+Las+Trancas,+Pinto,+Chile&markers=color:red%7Clabel:T%7C3FQV+7FW+Las+Trancas,+Pinto,+Chile&zoom=15" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="h-6 w-6 text-cyan-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Valle Las Trancas, Chile</h3>
                <p className="text-gray-600">
                  Ubicado a los pies del Volcán Chillán y rodeado de bosques nativos, nuestro glamping te ofrece una 
                  experiencia única en uno de los valles más hermosos de la Cordillera de Los Andes, a solo 1.5 horas 
                  de la ciudad de Chillán.
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Coordenadas GPS:</span> 36°54'S 71°28'O
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Descubre los alrededores:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <Trees className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Senderos Naturales</h4>
                  <p className="text-sm text-gray-600">Recorre bosques milenarios y cascadas escondidas.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Termas Naturales</h4>
                  <p className="text-sm text-gray-600">A solo 15 minutos de las mejores aguas termales de la región.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bird className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Fauna Local</h4>
                  <p className="text-sm text-gray-600">Observa cóndores y otras especies autóctonas en su hábitat natural.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Centro de Ski</h4>
                  <p className="text-sm text-gray-600">A 20 minutos del centro de ski Nevados de Chillán.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Cómo llegar:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Desde Chillán</h4>
                  <p className="text-sm text-gray-600">1.5 horas por ruta pavimentada (85 km).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Desde Concepción</h4>
                  <p className="text-sm text-gray-600">3 horas por autopista (230 km).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Plane className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Desde Santiago</h4>
                  <p className="text-sm text-gray-600">5 horas por autopista (420 km) o 45 minutos en avión + 1.5 horas en auto desde Chillán.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bus className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">En Bus</h4>
                  <p className="text-sm text-gray-600">Buses diarios desde Chillán al Valle Las Trancas (consultar horarios).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-cyan-500/10 to-cyan-500/10 rounded-lg p-6 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-cyan-500 mb-3">
            ¿Listo para descubrir este paraíso natural?
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            La aventura comienza desde el trayecto. Reserva tu experiencia en TreePod Glamping y vive la Cordillera de los Andes como nunca antes.
          </p>
          <Button 
            size="lg" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
            onClick={handleExploreClick}
          >
            Reserva tu escapada ahora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Location;
