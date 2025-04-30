
import { Clock, Droplets, Check, Users, Smile } from "lucide-react";
import type { Feature, Policy } from "@/types";
import React from "react";

// Images for each domo type
export const getDomoImages = (unitName: string) => {
  const baseImages = [
    "/lovable-uploads/c951eccc-c6f1-4744-8bc8-fca101105107.png", // Domo exterior de día
    "/lovable-uploads/ad46dae8-5b0a-4e4a-bf84-e0752b40f588.png", // Domo iluminado de noche
    "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png", // Dos domos en la noche
    "/lovable-uploads/41791139-e499-40bf-89c0-cb5a2947b4eb.png", // Entrada del recinto con auto
    "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png", // Vista del cielo nocturno
    "/lovable-uploads/365c130e-5ba5-49fa-84ed-dfb1c95cd08d.png", // Vista del camino con domos iluminados
  ];
  
  // In the future, we can add specific images for different domo types
  return baseImages;
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
  // Default values
  const defaultDetail = {
    size: "45m²",
    description: "Disfruta de una experiencia única en medio del bosque nativo de Valle Las Trancas, con todas las comodidades de un alojamiento sostenible y la tranquilidad de la naturaleza en la cordillera de los Andes.",
    experience: "Sumérgete en la belleza natural del bosque nativo. Despierta con el canto de las aves, disfruta de senderos exclusivos, relájate en nuestras tinajas de agua mineralizada proveniente de las termas de Chillán bajo las estrellas y experimenta la desconexión total en un entorno de lujo sostenible."
  };
  
  // In the future we can add specific details for different domo types
  return defaultDetail;
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
