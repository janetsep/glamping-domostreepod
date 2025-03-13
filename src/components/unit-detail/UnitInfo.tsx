import { Users, Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Utensils, Check, Clock, Smile } from "lucide-react";
import type { GlampingUnit } from "@/lib/supabase";
import { useState } from "react";

interface UnitInfoProps {
  unit: GlampingUnit;
}

export const UnitInfo = ({
  unit
}: UnitInfoProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Seleccionar imágenes según el tipo de domo
  const getDomoImages = (unitName: string) => {
    if (unitName.includes("Araucaria")) {
      return ["/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png", "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png", "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png"];
    } else if (unitName.includes("Canelo")) {
      return ["/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png", "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png", "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png"];
    } else if (unitName.includes("Coihue") || unitName.includes("Mirador")) {
      return ["/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png", "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png", "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png"];
    }

    // Imágenes por defecto si no coincide con ningún nombre conocido
    return [unit.image_url || "/placeholder.svg", "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png", "/lovable-uploads/04lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png"];
  };
  const images = getDomoImages(unit.name);

  // Obtener las características específicas basadas en el nombre del domo
  const getFeatures = (unitName: string) => {
    const baseFeatures = [
      {
        icon: <Check size={16} className="text-green-500" />,
        text: "Cocina equipada con lo necesario para preparar tus comidas."
      },
      {
        icon: <Check size={16} className="text-green-500" />,
        text: "Baño privado con ducha de agua caliente."
      },
      {
        icon: <Check size={16} className="text-green-500" />,
        text: "Estufa a pellet para mantener un ambiente cálido."
      },
      {
        icon: <Check size={16} className="text-green-500" />,
        text: "Terraza privada, ideal para disfrutar del entorno."
      },
      {
        icon: <Check size={16} className="text-green-500" />,
        text: "Parrilla para asado, disponible sin costo adicional."
      },
      {
        icon: <Check size={16} className="text-green-500" />,
        text: "Acceso libre a la piscina exterior de agua fría."
      },
      {
        icon: <Droplets size={16} className="text-blue-500" />,
        text: "Opción adicional: Disfruta de nuestras tinajas de agua caliente mineralizada, ubicadas entre los árboles, por un valor extra."
      }
    ];

    // Información específica según tipo de domo
    if (unitName.includes("Araucaria")) {
      return [...baseFeatures];
    }
    if (unitName.includes("Canelo")) {
      return [...baseFeatures];
    }
    if (unitName.includes("Coihue")) {
      return [...baseFeatures];
    }
    if (unitName.includes("Mirador")) {
      return [...baseFeatures];
    }
    return baseFeatures;
  };
  const features = getFeatures(unit.name);

  // Obtener los horarios y políticas
  const getPolicies = () => {
    return [
      {
        icon: <Clock size={16} className="text-primary" />,
        text: "Ingreso: Desde las 16:00 hrs."
      },
      {
        icon: <Clock size={16} className="text-primary" />,
        text: "Salida: Hasta las 12:00 hrs."
      },
      {
        icon: <Smile size={16} className="text-primary" />,
        text: "Mascotas: Permitidas (máximo 2 pequeñas, con aviso previo)."
      }
    ];
  };
  const policies = getPolicies();

  // Obtener detalle específico según el domo
  const getUnitDetail = (unitName: string) => {
    if (unitName.includes("Araucaria")) {
      return {
        size: "32m²",
        description: "Duerme bajo un manto de estrellas visibles desde la bóveda de cristal de nuestro domo exclusivo. Despertar con los primeros rayos del sol abrazando el bosque nativo nunca había sido tan mágico.",
        experience: "Un espacio único entre araucarias centenarias donde la arquitectura se funde con la naturaleza. Nuestros domos completamente equipados cuentan con terminaciones de lujo y vistas panorámicas al bosque y cielo estrellado."
      };
    }
    if (unitName.includes("Canelo")) {
      return {
        size: "38m²",
        description: "Sumérgete en el lujo de la simplicidad con nuestro jacuzzi exterior privado mientras contemplas el atardecer sobre los árboles. Una experiencia que despertará todos tus sentidos.",
        experience: "El Domo Canelo, llamado así por el árbol sagrado mapuche, ofrece una experiencia de conexión profunda con la naturaleza sin renunciar al confort. Su jacuzzi al aire libre te permite contemplar las estrellas mientras te relajas en agua temperada."
      };
    }
    if (unitName.includes("Coihue")) {
      return {
        size: "36m²",
        description: "Experimenta la sensación de dormir entre las copas de los árboles. Nuestro domo elevado te ofrece una perspectiva única del bosque nativo desde cada ángulo y un despertar envuelto en naturaleza.",
        experience: "El Domo Coihue se eleva entre los árboles nativos para brindarte una experiencia única. Su diseño suspendido y su ducha panorámica te permiten sentirte parte del bosque, mientras disfrutas de todas las comodidades de un alojamiento de lujo."
      };
    }
    if (unitName.includes("Mirador")) {
      return {
        size: "40m²",
        description: "Contempla la inmensidad del valle desde las alturas. Este domo premium te ofrece un hot tub privado y las mejores vistas panorámicas para disfrutar de los atardeceres más espectaculares.",
        experience: "Ubicado en el punto más alto de nuestro terreno, el Domo Mirador te brinda una experiencia elevada en todos los sentidos. Su amplio espacio interior y sus ventanales te hacen sentir como si estuvieras flotando sobre el valle."
      };
    }
    return {
      size: "35m²",
      description: unit.description || "Disfruta de una experiencia única en nuestros exclusivos domos, rodeado de naturaleza y con todas las comodidades para una estadía inolvidable.",
      experience: "Nuestros domos ofrecen una experiencia única que combina la belleza natural con comodidades exclusivas."
    };
  };
  const unitDetail = getUnitDetail(unit.name);
  return <div>
      {/* Imagen principal con navegación */}
      <div className="relative rounded-lg overflow-hidden">
        <img src={images[activeImageIndex]} alt={`${unit.name} - Vista ${activeImageIndex + 1}`} className="w-full h-96 object-cover rounded-lg" />
        
        {/* Navegación de imágenes */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-2 h-2 rounded-full ${activeImageIndex === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`Ver imagen ${index + 1}`} />)}
        </div>
      </div>
      
      {/* Miniaturas de imágenes */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {images.map((img, index) => <div key={index} className={`h-24 rounded-md overflow-hidden cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveImageIndex(index)}>
            <img src={img} alt={`${unit.name} - Miniatura ${index + 1}`} className="w-full h-full object-cover" />
          </div>)}
      </div>
      
      <div className="mt-6">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          {unit.name}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          <span className="text-sm bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
            {unitDetail.size}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>Hasta {unit.max_guests} personas</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 text-lg">{unitDetail.description}</p>
        
        <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8">
          {features.map((feature, index) => <div key={index} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>)}
        </div>
        
        <h2 className="text-xl font-semibold mb-3">Información Importante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8">
          {policies.map((policy, index) => <div key={index} className="flex items-center gap-2 text-gray-700">
              <span className="text-primary">{policy.icon}</span>
              <span>{policy.text}</span>
            </div>)}
        </div>
        
        <div className="bg-green-50 p-5 rounded-lg border border-green-100">
          <h3 className="font-semibold text-green-800 mb-2">Tu experiencia TreePod</h3>
          <p className="text-green-700">
            {unitDetail.experience}
          </p>
          
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-green-700">
              <strong>¿Qué incluye tu estadía?</strong> Acceso a senderos exclusivos, desayuno con productos locales, tinajas de agua mineralizada (previa reserva) y la tranquilidad absoluta del bosque nativo.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
