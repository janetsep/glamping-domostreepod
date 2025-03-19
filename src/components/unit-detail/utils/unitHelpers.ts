
import { Clock, Droplets, Check, Users, Smile } from "lucide-react";
import type { Feature, Policy } from "@/types";

// Images for each domo type
export const getDomoImages = (unitName: string) => {
  const baseImages = [
    "/lovable-uploads/dbcd97fc-9467-44b8-af76-01592c156f3f.png",
    "/lovable-uploads/9750700a-7f4e-4744-9703-049733204f14.png",
    "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
    "/lovable-uploads/71928294-5635-46f7-a3ec-5fb33ef836ea.png",
    "/lovable-uploads/82c8828f-f40f-4d4a-a240-bef61c16fc9f.png",
    "/lovable-uploads/ba985569-8f29-4da1-af9c-2aba9a5a886b.png",
  ];
  
  // In the future, we can add specific images for different domo types
  return baseImages;
};

// Experience images for all domos
export const getExperienceImages = () => {
  return [
    "/lovable-uploads/3c154ff6-0916-450e-8515-dc48d7f232fd.png",
    "/lovable-uploads/e07b0d00-f09b-4a23-b937-964931a152a6.png",
    "/lovable-uploads/5bcb79d0-1a05-40e3-9088-2836fa262778.png",
    "/lovable-uploads/e1e25810-22c3-4985-a125-505889912a69.png",
    "/lovable-uploads/3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png",
    "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png",
  ];
};

// Get unit-specific details based on name
export const getUnitDetail = (unitName: string) => {
  // Default values
  const defaultDetail = {
    size: "45m²",
    description: "Disfruta de una experiencia única en medio del bosque, con todas las comodidades de un hotel boutique y la tranquilidad de la naturaleza.",
    experience: "Sumérgete en la belleza natural del bosque nativo. Despierta con el canto de las aves, disfruta de senderos exclusivos, relájate en nuestras tinajas de agua caliente bajo las estrellas y experimenta la desconexión total en un entorno de lujo sostenible."
  };
  
  // In the future we can add specific details for different domo types
  return defaultDetail;
};

// Get features for each domo
export const getFeatures = (unitName: string): Feature[] => {
  // Common features for all domos
  const features = [
    {
      icon: <Check className="text-primary" size={18} />,
      text: "Wi-Fi de alta velocidad"
    },
    {
      icon: <Check className="text-primary" size={18} />,
      text: "Calefacción central"
    },
    {
      icon: <Check className="text-primary" size={18} />,
      text: "Smart TV con Netflix"
    },
    {
      icon: <Check className="text-primary" size={18} />,
      text: "Cocina equipada"
    },
    {
      icon: <Check className="text-primary" size={18} />,
      text: "Baño privado con ducha de lluvia"
    },
    {
      icon: <Check className="text-primary" size={18} />,
      text: "Terraza privada con vistas al bosque"
    }
  ];
  
  return features;
};

// Get policies for all domos
export const getPolicies = (): Policy[] => {
  return [
    {
      icon: <Clock className="text-primary" size={18} />,
      text: "Check-in: 15:00 - Check-out: 12:00"
    },
    {
      icon: <Smile className="text-primary" size={18} />,
      text: "Desayuno incluido"
    },
    {
      icon: <Droplets className="text-primary" size={18} />,
      text: "Acceso a tinaja de agua caliente (previa reserva)"
    },
    {
      icon: <Users className="text-primary" size={18} />,
      text: "No se permiten mascotas"
    }
  ];
};
