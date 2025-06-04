
import type { GlampingUnit } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Star,
  Wifi,
  Car,
  Trees
} from "lucide-react";

interface UnitInfoProps {
  unit: GlampingUnit;
}

export const UnitInfo = ({ unit }: UnitInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-display font-bold mb-2">
              {unit.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Valle Las Trancas, Región de Ñuble</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.9</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          {unit.description || "Experimenta la tranquilidad del Valle Las Trancas en nuestros exclusivos domos geodésicos. Ubicados en un bosque nativo, ofrecemos una experiencia única que combina comodidad moderna con conexión natural."}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Hasta {unit.max_guests} huéspedes
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {unit.bedrooms || 1} habitación
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {unit.bathrooms || 1} baño
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wifi className="w-4 h-4" />
            <span>WiFi Starlink</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Car className="w-4 h-4" />
            <span>Estacionamiento</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trees className="w-4 h-4" />
            <span>Bosque nativo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bath className="w-4 h-4" />
            <span>Tinajas termales</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
