
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const individualPackages: PackageItem[] = [
  {
    id: "1",
    title: "Para el viajero en solitario 🌿",
    description: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. En la terraza, un buen libro y el sonido del bosque crean el ambiente ideal para un descanso profundo. Afuera, los senderos esperan ser explorados a tu propio ritmo.",
    detailedDescription: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. En la terraza, un buen libro y el sonido del bosque crean el ambiente ideal para un descanso profundo. Afuera, los senderos esperan ser explorados a tu propio ritmo.",
    price: 120000,
    originalPrice: 150000,
    image: "/lovable-uploads/203fb2cd-e719-4535-ace0-2907f720b675.png",
    interiorImage: "/lovable-uploads/8eb2430e-258c-41e1-aa76-74a1cb91f82f.png",
    size: "32m²",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 4 personas", "Vistas al bosque", "Acceso a senderos"],
    amenities: [
      { icon: createIcon(Coffee), text: "Mini cocina equipada" },
      { icon: createIcon(Droplets), text: "Ducha con agua caliente" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Calefacción ecológica" },
      { icon: createIcon(BedDouble), text: "Cama king size premium" },
      { icon: createIcon(Mountain), text: "Vistas panorámicas al bosque nativo" },
      { icon: createIcon(Users), text: "Capacidad para 4 personas" }
    ]
  },
  {
    id: "9",
    title: "Para quienes buscan simplicidad y descanso ☕",
    description: "Despertar sin prisa, con el aroma del bosque entrando por la ventana. Preparar un café y salir a la terraza a sentir la brisa fresca. Aquí, cada día comienza sin apuro, siguiendo el ritmo de la naturaleza.",
    detailedDescription: "Despertar sin prisa, con el aroma del bosque entrando por la ventana. Preparar un café y salir a la terraza a sentir la brisa fresca. Aquí, cada día comienza sin apuro, siguiendo el ritmo de la naturaleza.",
    price: 115000,
    originalPrice: 145000,
    image: "/lovable-uploads/5fec13a4-73e3-409a-8c8a-8e07e4d7df3e.png",
    interiorImage: "/lovable-uploads/881f84e7-856a-4057-bdc0-d55b67859a18.png",
    size: "30m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Hamaca en terraza", "Biblioteca minimalista"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cafetera de especialidad" },
      { icon: createIcon(Droplets), text: "Ducha con productos naturales" },
      { icon: createIcon(Wifi), text: "WiFi (opcional)" },
      { icon: createIcon(Flame), text: "Calefacción a leña" },
      { icon: createIcon(BedDouble), text: "Cama confortable con vista al bosque" },
      { icon: createIcon(Mountain), text: "Terraza con hamaca" },
      { icon: createIcon(Users), text: "Ideal para desconexión" }
    ]
  }
];
