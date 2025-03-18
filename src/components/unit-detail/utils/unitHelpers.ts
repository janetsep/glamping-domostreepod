
import { Check, Clock, Smile, Droplets } from "lucide-react";
import type { GlampingUnit } from "@/lib/supabase";

export interface UnitDetail {
  size: string;
  description: string;
  experience: string;
}

export interface Feature {
  icon: React.ReactNode;
  text: string;
}

export interface Policy {
  icon: React.ReactNode;
  text: string;
}

// Seleccionar imágenes según el tipo de domo
export const getDomoImages = (unitName: string): string[] => {
  if (unitName.includes("Araucaria")) {
    return [
      "/lovable-uploads/81cdaf67-2cb9-460d-a5ca-e57298d3d700.png", 
      "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png", 
      "/lovable-uploads/ce94fa50-b554-4f58-894b-93a89468b8c7.png",
      "/lovable-uploads/31454024-c7c7-4a8b-8f5c-c4fd1af369e1.png",
      "/lovable-uploads/9f5ec7ea-f65b-46be-94ba-8df609f0a24f.png"
    ];
  } else if (unitName.includes("Canelo")) {
    return [
      "/lovable-uploads/ce94fa50-b554-4f58-894b-93a89468b8c7.png", 
      "/lovable-uploads/81cdaf67-2cb9-460d-a5ca-e57298d3d700.png", 
      "/lovable-uploads/31454024-c7c7-4a8b-8f5c-c4fd1af369e1.png",
      "/lovable-uploads/9f5ec7ea-f65b-46be-94ba-8df609f0a24f.png"
    ];
  } else if (unitName.includes("Coihue") || unitName.includes("Mirador")) {
    return [
      "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png", 
      "/lovable-uploads/81cdaf67-2cb9-460d-a5ca-e57298d3d700.png", 
      "/lovable-uploads/ce94fa50-b554-4f58-894b-93a89468b8c7.png",
      "/lovable-uploads/9f5ec7ea-f65b-46be-94ba-8df609f0a24f.png"
    ];
  }

  // Imágenes por defecto si no coincide con ningún nombre conocido
  return [
    "/lovable-uploads/81cdaf67-2cb9-460d-a5ca-e57298d3d700.png", 
    "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png", 
    "/lovable-uploads/ce94fa50-b554-4f58-894b-93a89468b8c7.png",
    "/lovable-uploads/31454024-c7c7-4a8b-8f5c-c4fd1af369e1.png",
    "/lovable-uploads/9f5ec7ea-f65b-46be-94ba-8df609f0a24f.png"
  ];
};

// Obtener las características específicas basadas en el nombre del domo
export const getFeatures = (unitName: string): Feature[] => {
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

// Obtener los horarios y políticas
export const getPolicies = (): Policy[] => {
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

// Obtener detalle específico según el domo
export const getUnitDetail = (unitName: string): UnitDetail => {
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
    description: unitName.includes("description") ? unitName : "Disfruta de una experiencia única en nuestros exclusivos domos, rodeado de naturaleza y con todas las comodidades para una estadía inolvidable.",
    experience: "Nuestros domos ofrecen una experiencia única que combina la belleza natural con comodidades exclusivas."
  };
};

// Imágenes para la experiencia TreePod
export const getExperienceImages = (): string[] => {
  return [
    "/lovable-uploads/efff0e9e-0976-497a-9afe-25104c9fefef.png",
    "/lovable-uploads/1e29d754-6882-4de5-b2ca-3d9680160dda.png",
    "/lovable-uploads/ba985569-8f29-4da1-af9c-2aba9a5a886b.png",
    "/lovable-uploads/41ccd2d9-61e0-45f7-a155-0db08bc3800e.png",
    "/lovable-uploads/71928294-5635-46f7-a3ec-5fb33ef836ea.png",
    "/lovable-uploads/72e3600d-5b7a-4218-82ac-b305c49e4aeb.png"
  ];
};
