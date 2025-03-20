
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const adventurePackages: PackageItem[] = [
  {
    id: "3",
    title: "Para los aventureros 🥾",
    description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso. Dejas las botas en la entrada, enciendes la estufa a pellet y disfrutas de la vista mientras recuperas energías para la próxima aventura.",
    detailedDescription: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso. Dejas las botas en la entrada, enciendes la estufa a pellet y disfrutas de la vista mientras recuperas energías para la próxima aventura.",
    price: 125000,
    originalPrice: 160000,
    image: "/lovable-uploads/2d15bec1-4bf8-4339-8aba-a44cf71e1888.png",
    interiorImage: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png",
    size: "36m²",
    maxGuests: 3,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 3 personas", "Ducha panorámica", "Mini cocina"],
    amenities: [
      { icon: createIcon(Coffee), text: "Mini bar y café de especialidad" },
      { icon: createIcon(Droplets), text: "Ducha panorámica con vista al bosque" },
      { icon: createIcon(Wifi), text: "Conexión WiFi" },
      { icon: createIcon(Flame), text: "Calefacción de bajo consumo" },
      { icon: createIcon(BedDouble), text: "Cama queen con vistas al amanecer" },
      { icon: createIcon(Mountain), text: "Terraza privada suspendida" },
      { icon: createIcon(Users), text: "Equipamiento para aventureros" }
    ]
  },
  {
    id: "7",
    title: "Para los amantes del trekking ⛰️",
    description: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales. El regreso es recompensado con una comida caliente en la cocina del domo y una noche de descanso profundo rodeado de bosque.",
    detailedDescription: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales. El regreso es recompensado con una comida caliente en la cocina del domo y una noche de descanso profundo rodeado de bosque.",
    price: 125000,
    originalPrice: 155000,
    image: "/lovable-uploads/852513f7-08f6-41be-aab5-2d435195b174.png",
    interiorImage: "/lovable-uploads/1ac889d3-0c46-4f2b-951b-83c65548a48e.png",
    size: "34m²",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Mapa de senderos", "Capacidad: 4 personas", "Botas secadoras", "Kit de primeros auxilios"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina para preparar tus snacks" },
      { icon: createIcon(Droplets), text: "Ducha de alta presión" },
      { icon: createIcon(Wifi), text: "WiFi para planificar rutas" },
      { icon: createIcon(Flame), text: "Estufa a pellet" },
      { icon: createIcon(BedDouble), text: "Camas confortables para recuperarse" },
      { icon: createIcon(Mountain), text: "Acceso directo a senderos" },
      { icon: createIcon(Users), text: "Capacidad para grupos de trekking" }
    ]
  },
  {
    id: "6",
    title: "Para el fotógrafo de naturaleza 📷",
    description: "Cada amanecer trae un espectáculo de luces y sombras en la montaña. Desde la terraza del domo, la cámara capta el vuelo de un cóndor y el reflejo del sol en los árboles. La niebla matutina le da un toque mágico al paisaje.",
    detailedDescription: "Cada amanecer trae un espectáculo de luces y sombras en la montaña. Desde la terraza del domo, la cámara capta el vuelo de un cóndor y el reflejo del sol en los árboles. La niebla matutina le da un toque mágico al paisaje.",
    price: 130000,
    originalPrice: 165000,
    image: "/lovable-uploads/8365f2da-fa25-4ee2-b11c-f4651affb6ab.png",
    interiorImage: "/lovable-uploads/34c4f9ff-baac-4d48-a8bd-f3c149302031.png",
    size: "34m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Ubicación privilegiada para fotos", "Capacidad: 2 personas", "Mirador panorámico", "Guía de spots fotográficos"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina equipada" },
      { icon: createIcon(Droplets), text: "Ubicación cercana a cascadas" },
      { icon: createIcon(Wifi), text: "WiFi para compartir tus fotos" },
      { icon: createIcon(Flame), text: "Calefacción ecológica" },
      { icon: createIcon(BedDouble), text: "Cama con vista al paisaje" },
      { icon: createIcon(Mountain), text: "Terraza elevada 360° para fotografía" },
      { icon: createIcon(Users), text: "Guía de spots fotográficos incluida" }
    ]
  }
];
