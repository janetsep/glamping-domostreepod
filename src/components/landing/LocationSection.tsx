import { MapPin, Navigation, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
export const LocationSection = () => {
  const navigate = useNavigate();
  const directions = [{
    icon: Navigation,
    title: "Desde Santiago",
    description: "5 horas por Ruta 5 Sur hasta Chillán, luego 1.5h por Valle Las Trancas",
    time: "5 horas"
  }, {
    icon: Navigation,
    title: "Desde Chillán",
    description: "1.5 horas por carretera asfaltada hacia Valle Las Trancas",
    time: "1.5 horas"
  }, {
    icon: Navigation,
    title: "Desde Concepción",
    description: "2.5 horas vía Chillán por Ruta 5 Sur",
    time: "2.5 horas"
  }];
  return <section id="ubicacion" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Te Esperamos en la Montaña
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos ubicados en uno de los destinos más espectaculares de Chile, 
            rodeado de bosque nativo y la cordillera de los Andes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Mapa */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-96">
                <Map />
              </div>
              <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-900">TreePod Glamping</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Valle Las Trancas, Región de Ñuble, Chile
                </p>
              </div>
            </div>
          </div>

          {/* Directions */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Cómo Llegar?
            </h3>
            
            <div className="space-y-4 mb-8">
              {directions.map((direction, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <direction.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{direction.title}</h4>
                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {direction.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{direction.description}</p>
                    </div>
                  </div>
                </div>)}
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-4">¿Necesitas Ayuda?</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-gray-600">+56 9 8765 4321</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-gray-600">info@treepod.cl</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90" onClick={() => navigate('/unit/1')}>
                Reservar Experiencia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};