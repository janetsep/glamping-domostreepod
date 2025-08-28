import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useElfsight } from "@/hooks/useElfsight";
export const InteractiveMap = () => {
  // Initialize Elfsight for Google Maps widget
  useElfsight('3b2bec9e-cc66-481c-88a9-3f156d8a74a3', 1500);
  
  const location = {
    address: "Valle Las Trancas, Región de Ñuble, Chile",
    coordinates: "-36.9197, -71.4892",
    nearbyAttractions: [{
      name: "Termas de Chillán",
      distance: "15 km",
      type: "Termas"
    }, {
      name: "Centro de Ski Valle Las Trancas",
      distance: "8 km",
      type: "Ski"
    }, {
      name: "Sendero Los Coigües",
      distance: "3 km",
      type: "Trekking"
    }, {
      name: "Mirador Shangri-La",
      distance: "12 km",
      type: "Mirador"
    }],
    accessInfo: {
      fromSantiago: "5 horas en auto",
      fromConcepcion: "2.5 horas en auto",
      fromChillan: "1 hora en auto"
    }
  };
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };
  const openInWaze = () => {
    const url = `https://waze.com/ul?q=${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };
  return <section className="py-16 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Encuentra TreePod en el Valle Las Trancas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            En el corazón de la Región de Ñuble, rodeado de naturaleza virgen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Interactive Map */}
          <div className="relative">
            <Card className="overflow-hidden shadow-xl">
              {/* Elfsight Google Maps Widget */}
              <div className="relative h-96">
                <div className="elfsight-app-3b2bec9e-cc66-481c-88a9-3f156d8a74a3" data-elfsight-app-lazy></div>
                
                {/* Coordinate overlay */}
                <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-3 py-2">
                  <p className="text-xs text-muted-foreground font-mono">
                    {location.coordinates}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            
            {/* Access Information */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Cómo llegar</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Desde Santiago</span>
                  <span className="font-medium">{location.accessInfo.fromSantiago}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-muted-foreground">Desde Concepción</span>
                  <span className="font-medium">{location.accessInfo.fromConcepcion}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Desde Chillán</span>
                  <span className="font-medium">{location.accessInfo.fromChillan}</span>
                </div>
              </div>
            </Card>

            {/* Nearby Attractions */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Atractivos cercanos</h3>
              </div>
              <div className="space-y-3">
                {location.nearbyAttractions.map((attraction, index) => <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">{attraction.name}</p>
                      <p className="text-sm text-muted-foreground">{attraction.type}</p>
                    </div>
                    <span className="text-primary font-medium">{attraction.distance}</span>
                  </div>)}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">¿Necesitas ayuda con la ubicación?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Nuestro equipo te puede guiar paso a paso para llegar sin problemas
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => window.open('https://wa.me/56912345678', '_blank')}>
                <Phone className="w-4 h-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};