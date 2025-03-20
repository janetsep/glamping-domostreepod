
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
  },
  {
    id: "5",
    title: "Para el amante del bienestar 🍃",
    description: "Una mañana de silencio y conexión con el entorno. El desayuno con productos locales y la caminata por los senderos despejan la mente. Al final del día, la tinaja de agua mineral es el espacio perfecto para relajar el cuerpo y la mente.",
    detailedDescription: "Una mañana de silencio y conexión con el entorno. El desayuno con productos locales y la caminata por los senderos despejan la mente. Al final del día, la tinaja de agua mineral es el espacio perfecto para relajar el cuerpo y la mente.",
    price: 140000,
    originalPrice: 175000,
    image: "/lovable-uploads/c951eccc-c6f1-4744-8bc8-fca101105107.png",
    interiorImage: "/lovable-uploads/9d029773-a360-431b-a1b6-681971e6fb24.png",
    size: "38m²",
    maxGuests: 2,
    features: ["3 noches de alojamiento", "Desayuno orgánico incluido", "Tinaja de agua mineral", "Capacidad: 2 personas", "Yoga mat"],
    amenities: [
      { icon: createIcon(Coffee), text: "Selección de tés e infusiones orgánicas" },
      { icon: createIcon(Droplets), text: "Tinaja de agua mineral privada" },
      { icon: createIcon(Wifi), text: "Wifi (desconectable para digital detox)" },
      { icon: createIcon(Flame), text: "Calefacción ecológica" },
      { icon: createIcon(BedDouble), text: "Cama con colchón ortopédico" },
      { icon: createIcon(Mountain), text: "Terraza para práctica de yoga" },
      { icon: createIcon(Users), text: "Experiencias de bienestar incluidas" }
    ]
  },
  {
    id: "10",
    title: "Para el viajero que busca nuevas experiencias 🌎",
    description: "Cada detalle del domo está pensado para disfrutar el entorno sin interrupciones. Desde la comodidad de la cama, la vista del bosque es un recordatorio de que estás en un lugar especial, listo para descubrir lo que el valle tiene para ofrecer.",
    detailedDescription: "Cada detalle del domo está pensado para disfrutar el entorno sin interrupciones. Desde la comodidad de la cama, la vista del bosque es un recordatorio de que estás en un lugar especial, listo para descubrir lo que el valle tiene para ofrecer.",
    price: 135000,
    originalPrice: 170000,
    image: "/lovable-uploads/ad46dae8-5b0a-4e4a-bf84-e0752b40f588.png",
    interiorImage: "/lovable-uploads/c574bdd7-54e1-4251-a57f-c23a453896fe.png",
    size: "36m²",
    maxGuests: 3,
    features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 3 personas", "Guía de experiencias locales", "Bicicletas disponibles"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina equipada con productos locales" },
      { icon: createIcon(Droplets), text: "Ducha de lluvia" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Sistema de calefacción eficiente" },
      { icon: createIcon(BedDouble), text: "Cama queen size" },
      { icon: createIcon(Mountain), text: "Terraza con vistas panorámicas" },
      { icon: createIcon(Users), text: "Guía de experiencias locales incluido" }
    ]
  }
];
