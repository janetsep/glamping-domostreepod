
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const specialtyPackages: PackageItem[] = [
  {
    id: "4",
    title: "Para la familia con niños 🏡",
    description: "Los más pequeños exploran el bosque mientras los adultos preparan un asado en la parrilla. La piscina de agua fría se convierte en el lugar favorito de la tarde, y al caer la noche, las historias junto a la estufa crean recuerdos que quedan para siempre.",
    detailedDescription: "Los más pequeños exploran el bosque mientras los adultos preparan un asado en la parrilla. La piscina de agua fría se convierte en el lugar favorito de la tarde, y al caer la noche, las historias junto a la estufa crean recuerdos que quedan para siempre.",
    price: 145000,
    originalPrice: 180000,
    image: "/lovable-uploads/c951eccc-c6f1-4744-8bc8-fca101105107.png",
    interiorImage: "/lovable-uploads/9d029773-a360-431b-a1b6-681971e6fb24.png",
    size: "42m²",
    maxGuests: 5,
    features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 5 personas", "Área de juegos", "Parrilla"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina familiar equipada" },
      { icon: createIcon(Droplets), text: "Piscina de agua natural" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Estufa a pellet" },
      { icon: createIcon(BedDouble), text: "Habitaciones familiares" },
      { icon: createIcon(Mountain), text: "Terraza con área de juegos" },
      { icon: createIcon(Users), text: "Ideal para familias con niños" }
    ]
  }
];
