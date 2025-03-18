
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const couplePackages: PackageItem[] = [
  {
    id: "2",
    title: "Para la pareja en busca de tranquilidad 💙",
    description: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    detailedDescription: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    price: 135000,
    originalPrice: 180000,
    image: "/lovable-uploads/b3f7fcc3-d3a3-4ddf-b3b1-bf673a471dd2.png",
    interiorImage: "/lovable-uploads/0fe12fb9-c758-424f-9a5b-67b8b2ae67d1.png",
    size: "38m²",
    maxGuests: 2,
    features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Jacuzzi privado", "Wifi gratis"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina completamente equipada" },
      { icon: createIcon(Droplets), text: "Jacuzzi exterior privado" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Sistema de calefacción central" },
      { icon: createIcon(BedDouble), text: "Cama king size con ropa de cama premium" },
      { icon: createIcon(Mountain), text: "Terraza con vistas al valle" },
      { icon: createIcon(Users), text: "Ideal para parejas" }
    ]
  },
  {
    id: "8",
    title: "Para quienes buscan una escapada especial 🎉",
    description: "Celebrar en medio de la montaña tiene otro significado. Una cena especial bajo las estrellas, la calidez del domo y la sensación de estar lejos del mundo convierten cualquier ocasión en un recuerdo inolvidable.",
    detailedDescription: "Celebrar en medio de la montaña tiene otro significado. Una cena especial bajo las estrellas, la calidez del domo y la sensación de estar lejos del mundo convierten cualquier ocasión en un recuerdo inolvidable.",
    price: 150000,
    originalPrice: 190000,
    image: "/lovable-uploads/717e7999-5c62-4fc9-a165-917b692351f9.png",
    interiorImage: "/lovable-uploads/0fe12fb9-c758-424f-9a5b-67b8b2ae67d1.png",
    size: "40m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Botella de champagne", "Capacidad: 2 personas", "Decoración especial", "Cena romántica"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina gourmet" },
      { icon: createIcon(Droplets), text: "Jacuzzi con vista al bosque" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Ambientación romántica" },
      { icon: createIcon(BedDouble), text: "Cama king premium" },
      { icon: createIcon(Mountain), text: "Terraza privada para ocasiones especiales" },
      { icon: createIcon(Users), text: "Servicio de concierge" }
    ]
  }
];
