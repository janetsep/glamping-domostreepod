
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlampingUnit } from "@/lib/supabase";
import { 
  Bed, 
  Users, 
  Wifi, 
  Car, 
  Trees, 
  Coffee,
  Bath,
  Wind,
  Mountain,
  Star
} from "lucide-react";

interface UnitFeaturesProps {
  unit: GlampingUnit;
}

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.includes('cama')) return <Bed className="w-4 h-4" />;
  if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return <Wifi className="w-4 h-4" />;
  if (lowerFeature.includes('estacionamiento')) return <Car className="w-4 h-4" />;
  if (lowerFeature.includes('naturaleza') || lowerFeature.includes('bosque')) return <Trees className="w-4 h-4" />;
  if (lowerFeature.includes('café') || lowerFeature.includes('cocina')) return <Coffee className="w-4 h-4" />;
  if (lowerFeature.includes('baño') || lowerFeature.includes('tinaja')) return <Bath className="w-4 h-4" />;
  if (lowerFeature.includes('aire') || lowerFeature.includes('ventilación')) return <Wind className="w-4 h-4" />;
  if (lowerFeature.includes('vista') || lowerFeature.includes('montaña')) return <Mountain className="w-4 h-4" />;
  return <Star className="w-4 h-4" />;
};

export const UnitFeatures = ({ unit }: UnitFeaturesProps) => {
  // Características por defecto si no existen
  const features = unit?.features && unit.features.length > 0 ? unit.features : [
    "Cama king size",
    "WiFi Starlink",
    "Vista al bosque nativo",
    "Baño privado",
    "Estacionamiento incluido",
    "Conexión con la naturaleza"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Características destacadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              {getFeatureIcon(feature)}
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Hasta {unit?.max_guests || 4} huéspedes
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bed className="w-3 h-3" />
              {unit?.bedrooms || 1} habitación
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {unit?.bathrooms || 1} baño
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
