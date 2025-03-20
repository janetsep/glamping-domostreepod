
import { Clock, Droplets, Check, Users, Smile } from "lucide-react";
import type { Feature, Policy } from "@/types";
import React from "react";

// Images for each domo type
export const getDomoImages = (unitName: string) => {
  const baseImages = [
    "/lovable-uploads/203fb2cd-e719-4535-ace0-2907f720b675.png", // Main exterior domo view
    "/lovable-uploads/9359ff84-0833-4ae9-8e97-833f2a12e4d6.png", // Interior bedroom
    "/lovable-uploads/852513f7-08f6-41be-aab5-2d435195b174.png", // Interior with window view
    "/lovable-uploads/34c4f9ff-baac-4d48-a8bd-f3c149302031.png", // Another bedroom view
    "/lovable-uploads/d19c9ef6-5402-4d13-8a3f-04ff376f1e56.png", // Snow covered domo at night
    "/lovable-uploads/aa3eb184-ad64-408d-8656-db40ac0e43a4.png", // Bedroom with wood stove
  ];
  
  // In the future, we can add specific images for different domo types
  return baseImages;
};

// Experience images for all domos
export const getExperienceImages = () => {
  return [
    "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png", // Interior with stove
    "/lovable-uploads/881f84e7-856a-4057-bdc0-d55b67859a18.png", // Kitchen area
    "/lovable-uploads/8eb2430e-258c-41e1-aa76-74a1cb91f82f.png", // Interior with chairs
    "/lovable-uploads/1ac889d3-0c46-4f2b-951b-83c65548a48e.png", // Snow view from window
    "/lovable-uploads/8365f2da-fa25-4ee2-b11c-f4651affb6ab.png", // Window frost detail
    "/lovable-uploads/bbab3037-e76e-49f8-8a7c-7ee59e063980.png", // Interior with yellow chairs
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
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Wi-Fi de alta velocidad"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Calefacción central"
    },
    {
      icon: React.createElement(Check, { className: "text-primary", size: 18 }),
      text: "Smart TV con Netflix"
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
      text: "Terraza privada con vistas al bosque"
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
      text: "Desayuno incluido"
    },
    {
      icon: React.createElement(Droplets, { className: "text-primary", size: 18 }),
      text: "Acceso a tinaja de agua caliente (previa reserva)"
    },
    {
      icon: React.createElement(Users, { className: "text-primary", size: 18 }),
      text: "No se permiten mascotas"
    }
  ];
};
