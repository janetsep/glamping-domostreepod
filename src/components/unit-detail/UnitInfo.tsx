
import { Users, Coffee, Droplets, Wifi, Flame } from "lucide-react";
import type { GlampingUnit } from "@/lib/supabase";

interface UnitInfoProps {
  unit: GlampingUnit;
}

export const UnitInfo = ({ unit }: UnitInfoProps) => {
  // Imágenes interiores actualizadas para mostrar
  const interiorImages = [
    "/lovable-uploads/381ffefb-15d1-43c6-b9a2-576aefbb71ab.png",
    "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png",
    "/lovable-uploads/21690294-058b-4ab7-9d01-fcf2bd94b8b3.png"
  ];

  // Determinar las características específicas basadas en el nombre del domo
  const getFeatures = (unitName: string) => {
    const baseFeatures = [
      { icon: <Coffee size={16} />, text: "Mini cocina equipada" },
      { icon: <Droplets size={16} />, text: "Ducha con agua caliente" },
      { icon: <Wifi size={16} />, text: "Wifi disponible" },
    ];

    // Agregar características específicas según el domo
    if (unitName.includes("Araucaria")) {
      return [...baseFeatures, { icon: <Flame size={16} />, text: "Zona de fogón" }];
    }
    if (unitName.includes("Canelo")) {
      return [...baseFeatures, { icon: <Droplets size={16} />, text: "Jacuzzi al aire libre" }];
    }
    if (unitName.includes("Coihue")) {
      return [...baseFeatures, { icon: <Droplets size={16} />, text: "Ducha panorámica" }];
    }
    if (unitName.includes("Mirador")) {
      return [...baseFeatures, { icon: <Droplets size={16} />, text: "Hot tub privado" }];
    }
    
    return baseFeatures;
  };

  const features = getFeatures(unit.name);

  return (
    <div>
      <img
        src={unit.image_url || "/placeholder.svg"}
        alt={unit.name}
        className="w-full h-96 object-cover rounded-lg"
      />
      
      {/* Galería de imágenes interiores */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {interiorImages.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`Interior del ${unit.name}`}
            className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
          />
        ))}
      </div>
      
      <div className="mt-6">
        <h1 className="text-3xl font-display font-bold text-primary mb-4">
          {unit.name}
        </h1>
        <p className="text-gray-600 mb-6">{unit.description}</p>
        
        <h2 className="text-lg font-semibold mb-3">Características</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} />
            <span>Hasta {unit.max_guests} personas</span>
          </div>
          
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              {feature.icon}
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-semibold text-green-800 mb-2">Experiencia TreePod</h3>
          <p className="text-sm text-green-700">
            Disfruta de una experiencia única en nuestros exclusivos domos, rodeado de naturaleza y con 
            todas las comodidades para una estadía inolvidable en el sur de Chile.
          </p>
        </div>
      </div>
    </div>
  );
};
