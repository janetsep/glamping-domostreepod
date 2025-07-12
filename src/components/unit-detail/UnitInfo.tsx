import type { GlampingUnit } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Bed, Bath, Star, Wifi, Trees } from "lucide-react";
import { getAverageRating } from "@/data/content/testimonials";
interface UnitInfoProps {
  unit: GlampingUnit;
}
export const UnitInfo = ({
  unit
}: UnitInfoProps) => {
  // Datos reales de la sección "¡Los Huéspedes Opinan!"
  const reviewsPlatforms = [
    { name: "Todas las reseñas", rating: "4.9", color: "text-gray-700" },
    { name: "Airbnb", rating: "5.0", color: "text-red-500" },
    { name: "Google", rating: "4.9", color: "text-blue-500" },
    { name: "Booking.com", rating: "9.6", color: "text-blue-700" },
    { name: "Tripadvisor", rating: "5.0", color: "text-green-600" }
  ];
  
  const generalRating = 4.9;

  return <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-display font-bold mb-2">
              Domo
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Valle Las Trancas, Región de Ñuble</span>
            </div>
          </div>
          <div className="text-right">
            {/* Tabla de puntuaciones por plataforma - formato horizontal */}
            <div className="mb-3 bg-gray-50 rounded-lg p-2">
              <div className="flex flex-wrap gap-4 text-xs justify-end border-b border-gray-300 pb-2">
                {reviewsPlatforms.map((platform, index) => (
                  <div key={platform.name} className={`flex items-center gap-1 ${index === 0 ? 'border-b-2 border-black pb-1' : ''}`}>
                    <span className={platform.color}>{platform.name}</span>
                    <span className="font-semibold">{platform.rating}</span>
                  </div>
                ))}
              </div>
              
              {/* Calificación general con estrellas */}
              <div className="pt-2">
                <div className="text-sm text-gray-700 mb-1">Calificación general</div>
                <div className="flex items-center justify-end gap-1">
                  <span className="font-bold text-lg">{generalRating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">(161)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Experimenta la tranquilidad del Valle Las Trancas en nuestros domos geodésicos ubicados en un bosque nativo. Una experiencia única que combina comodidad moderna con conexión natural.
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Hasta {unit.max_guests} huéspedes
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            Cama king size
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            Baño privado
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wifi className="w-4 h-4" />
            <span>WiFi Starlink</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trees className="w-4 h-4" />
            <span>Bosque nativo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            
            
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            
          </div>
        </div>
      </CardContent>
    </Card>;
};