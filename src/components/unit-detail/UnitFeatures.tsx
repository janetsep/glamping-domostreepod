
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlampingUnit } from "@/lib/supabase";
import { 
  Bed, 
  Wifi, 
  Trees, 
  Bath,
  Mountain,
  Star
} from "lucide-react";

interface UnitFeaturesProps {
  unit: GlampingUnit;
}

const features = [
  {
    icon: <Bed className="w-4 h-4" />,
    title: "Cama king size",
    description: "Máximo confort para tu descanso"
  },
  {
    icon: <Wifi className="w-4 h-4" />,
    title: "WiFi Starlink",
    description: "Conexión de alta velocidad"
  },
  {
    icon: <Trees className="w-4 h-4" />,
    title: "Bosque nativo",
    description: "Entorno natural preservado"
  },
  {
    icon: <Bath className="w-4 h-4" />,
    title: "Baño privado",
    description: "Comodidades modernas"
  },
  {
    icon: <Mountain className="w-4 h-4" />,
    title: "Vista panorámica",
    description: "Paisajes de la cordillera"
  }
];

export const UnitFeatures = ({ unit }: UnitFeaturesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Comodidades incluidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 mt-1 text-primary">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{feature.title}</h4>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
