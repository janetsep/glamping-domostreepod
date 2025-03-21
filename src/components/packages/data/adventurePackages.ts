
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const adventurePackages: PackageItem[] = [
  {
    id: "3",
    title: "Para los aventureros de montaña",
    description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso. Dejas las botas en la entrada, enciendes la estufa a pellet y disfrutas de la vista mientras recuperas energías para la próxima aventura.",
    detailedDescription: "Después de una jornada recorriendo la montaña en la cordillera de los Andes, nuestro domo se convierte en tu refugio perfecto. Valle Las Trancas ofrece senderos para todos los niveles de experiencia, y TreePod es el lugar ideal para recuperar energías entre aventuras. Disfruta del confort después de un día de actividad, sumérgete en las aguas mineralizadas de nuestras tinajas de ciprés, y prepárate para explorar más rutas al día siguiente. Tu aventura en la naturaleza con todas las comodidades.",
    price: 125000,
    originalPrice: 160000,
    image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png",
    interiorImage: "/lovable-uploads/c574bdd7-54e1-4251-a57f-c23a453896fe.png",
    size: "36m²",
    maxGuests: 3,
    features: ["2 noches de alojamiento", "Desayuno energético incluido", "Capacidad: 3 personas", "Ducha panorámica", "Información de senderos locales"],
    amenities: [
      { icon: createIcon(Coffee), text: "Mini bar y café de especialidad" },
      { icon: createIcon(Droplets), text: "Tinaja de aguas mineralizadas después de la aventura" },
      { icon: createIcon(Wifi), text: "Conexión WiFi Starlink" },
      { icon: createIcon(Flame), text: "Calefacción eficiente de bajo consumo" },
      { icon: createIcon(BedDouble), text: "Cama queen con vistas al amanecer" },
      { icon: createIcon(Mountain), text: "Terraza privada con vista a la cordillera" },
      { icon: createIcon(Users), text: "Conexión con operadores locales para actividades" }
    ]
  },
  {
    id: "7",
    title: "Para los amantes del trekking",
    description: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales. El regreso es recompensado con una comida caliente en la cocina del domo y una noche de descanso profundo rodeado de bosque.",
    detailedDescription: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales en el Valle Las Trancas. Desde TreePod puedes acceder fácilmente a rutas que te llevarán a descubrir la belleza de la cordillera de los Andes, incluyendo la cascada Velo de Novia que alimenta nuestra piscina de montaña. Al final del día, relaja tus músculos en nuestras tinajas de agua mineralizada y disfruta de una noche de descanso rodeado del bosque nativo, con el arrullo del viento entre los árboles.",
    price: 125000,
    originalPrice: 155000,
    image: "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png",
    interiorImage: "/lovable-uploads/2bc5ed0e-959e-414e-9a53-d3f5efb98d4e.png",
    size: "34m²",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Mapa detallado de senderos locales", "Capacidad: 4 personas", "Secadora de botas", "Kit de primeros auxilios"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina completa para preparar snacks de ruta" },
      { icon: createIcon(Droplets), text: "Tinaja termal para recuperarse tras el trekking" },
      { icon: createIcon(Wifi), text: "WiFi para planificar rutas" },
      { icon: createIcon(Flame), text: "Estufa ecológica a pellet" },
      { icon: createIcon(BedDouble), text: "Camas confortables para recuperarse" },
      { icon: createIcon(Mountain), text: "Acceso directo a senderos del bosque nativo" },
      { icon: createIcon(Users), text: "Capacidad para grupos de trekking" }
    ]
  },
  {
    id: "6",
    title: "Para el fotógrafo de naturaleza",
    description: "Cada amanecer trae un espectáculo de luces y sombras en la montaña. Desde la terraza del domo, la cámara capta el vuelo de un cóndor y el reflejo del sol en los árboles. La niebla matutina le da un toque mágico al paisaje.",
    detailedDescription: "Cada amanecer en Valle Las Trancas trae un espectáculo de luces y sombras en la montaña. Los domos TreePod están ubicados estratégicamente para capturar la belleza natural de la cordillera de los Andes y el bosque nativo que los rodea. La diversidad de paisajes, desde las imponentes montañas hasta los detalles más pequeños del bosque, ofrece un paraíso para los fotógrafos. Con la calma del entorno y la comodidad de tu domo, podrás concentrarte en capturar esos momentos irrepetibles que la naturaleza nos regala.",
    price: 130000,
    originalPrice: 165000,
    image: "/lovable-uploads/365c130e-5ba5-49fa-84ed-dfb1c95cd08d.png",
    interiorImage: "/lovable-uploads/c28d0c48-43b6-4205-a663-d15e8833cda3.png",
    size: "34m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Ubicación privilegiada para fotografía", "Capacidad: 2 personas", "Mirador panorámico", "Guía de spots fotográficos locales"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina equipada para largas sesiones" },
      { icon: createIcon(Droplets), text: "Ubicación cercana a cascadas fotogénicas" },
      { icon: createIcon(Wifi), text: "WiFi Starlink para compartir tus fotos" },
      { icon: createIcon(Flame), text: "Calefacción silenciosa para no perturbar la fauna" },
      { icon: createIcon(BedDouble), text: "Cama con vista panorámica al paisaje" },
      { icon: createIcon(Mountain), text: "Terraza elevada 360° para fotografía" },
      { icon: createIcon(Users), text: "Guía de spots fotográficos incluida" }
    ]
  }
];
