
import { Check } from "lucide-react";
import { Wifi, UtensilsCrossed, MapPin, Thermometer, Mountain, Shower } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface UnitFeaturesProps {
  features?: Feature[];
}

export const UnitFeatures = ({ features = [] }: UnitFeaturesProps) => {
  // Si no se proporcionan características, usamos unas predeterminadas
  const defaultFeatures: Feature[] = [
    { icon: <Wifi size={18} />, text: "Conexión WiFi Starlink" },
    { icon: <UtensilsCrossed size={18} />, text: "Parrilla para asados" },
    { icon: <Mountain size={18} />, text: "Vista a la montaña" },
    { icon: <Thermometer size={18} />, text: "Calefacción" },
    { icon: <MapPin size={18} />, text: "Cerca de senderos" },
    { icon: <Shower size={18} />, text: "Agua caliente" },
  ];
  
  const displayFeatures = features.length > 0 ? features : defaultFeatures;
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8">
        {displayFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-gray-700">
            <span className="mt-1">{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </>
  );
};
