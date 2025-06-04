
import { Wifi, Car, Coffee, Utensils, Waves, Snowflake, TreePine, Shield } from "lucide-react";
import { Feature, Policy } from "@/types";

export const getUnitFeatures = (features?: string[]): Feature[] => {
  const featureMap: Record<string, Feature> = {
    wifi: {
      id: "wifi",
      name: "WiFi Starlink",
      icon: "Wifi",
      description: "Internet de alta velocidad"
    },
    parking: {
      id: "parking", 
      name: "Estacionamiento",
      icon: "Car",
      description: "Espacio para vehículo"
    },
    kitchen: {
      id: "kitchen",
      name: "Cocina equipada", 
      icon: "Coffee",
      description: "Cocina completa"
    },
    restaurant: {
      id: "restaurant",
      name: "Restaurante",
      icon: "Utensils", 
      description: "Servicio de alimentación"
    },
    pool: {
      id: "pool",
      name: "Piscina",
      icon: "Waves",
      description: "Piscina de agua fría"
    },
    heating: {
      id: "heating", 
      name: "Calefacción",
      icon: "Snowflake",
      description: "Sistema de calefacción"
    },
    nature: {
      id: "nature",
      name: "Entorno natural",
      icon: "TreePine", 
      description: "Rodeado de naturaleza"
    },
    security: {
      id: "security",
      name: "Seguridad",
      icon: "Shield",
      description: "Área segura"
    }
  };

  if (!features || features.length === 0) {
    return [
      featureMap.wifi,
      featureMap.parking,
      featureMap.kitchen,
      featureMap.pool,
      featureMap.heating,
      featureMap.nature,
      featureMap.security
    ];
  }

  return features.map(feature => featureMap[feature] || featureMap.wifi);
};

export const getUnitPolicies = (): Policy[] => {
  return [
    {
      id: "checkin",
      title: "Check-in",
      description: "A partir de las 15:00 hrs",
      icon: "Clock"
    },
    {
      id: "checkout", 
      title: "Check-out",
      description: "Hasta las 11:00 hrs",
      icon: "Clock"
    },
    {
      id: "cancellation",
      title: "Cancelación",
      description: "Cancelación gratuita hasta 48 hrs antes",
      icon: "Calendar"
    },
    {
      id: "pets",
      title: "Mascotas",
      description: "Se permiten mascotas con cargo adicional",
      icon: "Heart"
    },
    {
      id: "smoking",
      title: "No fumar",
      description: "Prohibido fumar en todas las áreas",
      icon: "Ban"
    },
    {
      id: "parties",
      title: "Eventos",
      description: "No se permiten fiestas o eventos",
      icon: "Users"
    }
  ];
};
