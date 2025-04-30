import { Clock, Droplets, Check, Users, Smile } from "lucide-react";
import type { Feature, Policy } from "@/types";
import React from "react";

// Images for each domo type
export const getDomoImages = (domoName: string) => {
  // Devuelve un conjunto de imágenes predeterminadas para los domos
  return [
    {
      id: 'main',
      url: '/lovable-uploads/619d8dbf-d18c-4d22-9c72-9b823a2a52d1.png',
      alt: 'Vista exterior del domo'
    },
    {
      id: 'breakfast',
      url: '/lovable-uploads/4bb0b8cf-adee-40c4-ac00-a3676ff6cdcc.png',
      alt: 'Desayuno en el domo'
    },
    {
      id: 'night',
      url: '/lovable-uploads/1f579fd8-1af0-4397-9254-2cd8cbb54410.png',
      alt: 'Vista nocturna del domo'
    },
    {
      id: 'outside',
      url: '/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png',
      alt: 'Entorno exterior del domo'
    },
    {
      id: 'forest',
      url: '/lovable-uploads/ba985569-8f29-4da1-af9c-2aba9a5a886b.png',
      alt: 'Vista del bosque'
    },
    {
      id: 'sunset',
      url: '/lovable-uploads/9f5ec7ea-f65b-46be-94ba-8df609f0a24f.png',
      alt: 'Puesta de sol en TreePod'
    }
  ];
};

// Experience images for all domos
export const getExperienceImages = () => {
  return [
    "/lovable-uploads/113a2ea1-c91a-409e-afed-9484312a2563.png", // Bosque nativo
    "/lovable-uploads/0e4d1495-87f2-4608-8685-caddc7925222.png", // Desayuno en el bosque
    "/lovable-uploads/46270626-ab65-40db-895a-8668daa5032b.png", // Detalle de amenidades
    "/lovable-uploads/9d029773-a360-431b-a1b6-681971e6fb24.png", // Bosque con troncos caídos
    "/lovable-uploads/c574bdd7-54e1-4251-a57f-c23a453896fe.png", // Vista de los domos entre árboles
    "/lovable-uploads/2bc5ed0e-959e-414e-9a53-d3f5efb98d4e.png", // Cerco de madera al atardecer
  ];
};

// Get unit-specific details based on name
export const getUnitDetail = (unitName: string) => {
  // Información detallada sobre la unidad
  return {
    size: "45m²",
    description: "Disfruta de una experiencia única en medio del bosque nativo de Valle Las Trancas, con todas las comodidades de un alojamiento sostenible y la tranquilidad de la naturaleza en la cordillera de los Andes.",
    experience: [
      "Despierta con el canto de las aves y disfruta de un desayuno con productos frescos del invernadero.",
      "Relájate en la tinaja de agua mineral mientras contemplas el bosque nativo.",
      "Por la noche, observa las estrellas desde la comodidad de tu domo, con un ambiente cálido y acogedor."
    ]
  };
};

// Get features for each domo
export const getFeatures = (unitName: string): Feature[] => {
  // Common features for all domos
  const features = [
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Wi-Fi Starlink de alta velocidad"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Calefacción ecológica"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Smart TV con streaming"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Cocina equipada"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Baño privado con ducha de lluvia"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Terraza privada con vistas al bosque nativo"
    }
  ];
  
  return features;
};

// Get policies for all domos
export const getPolicies = (): Policy[] => {
  return [
    {
      icon: React.createElement(Clock, { className: "text-primary", size: 18 }),
      text: "Check-in: 15:00 - Check-out: 12:00"
    },
    {
      icon: React.createElement(Smile, { className: "text-primary", size: 18 }),
      text: "Desayuno con productos locales incluido"
    },
    {
      icon: React.createElement(Droplets, { className: "text-primary", size: 18 }),
      text: "Acceso a tinaja de agua mineralizada (previa reserva y pago extra)"
    },
    {
      icon: React.createElement(Users, { className: "text-primary", size: 18 }),
      text: "No se permiten mascotas"
    }
  ];
};
