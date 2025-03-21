
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users, Home } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const specialtyPackages: PackageItem[] = [
  {
    id: "4",
    title: "Para familias que buscan exclusividad total",
    description: "Reserva todo el complejo para tu familia y disfruta de una experiencia única de privacidad total. Todos los domos, las tinajas y la piscina de montaña serán exclusivamente para ustedes, creando recuerdos inolvidables en un entorno natural privilegiado.",
    detailedDescription: "Reserva todo el complejo TreePod para tu familia y disfruta de una experiencia única con privacidad total en Valle Las Trancas. Todos los domos, las tinajas de agua mineralizada y la piscina de montaña alimentada por la cascada Velo de Novia serán exclusivamente para ustedes. El entorno perfecto para celebraciones familiares, reuniones especiales o simplemente disfrutar de tiempo de calidad con los tuyos en la tranquilidad del bosque nativo de la cordillera de los Andes.",
    price: 450000,
    originalPrice: 550000,
    image: "/lovable-uploads/c574bdd7-54e1-4251-a57f-c23a453896fe.png",
    interiorImage: "/lovable-uploads/e097d405-d6e7-4410-af4a-b2cb8d55c03b.png",
    size: "Todo el complejo",
    maxGuests: 16,
    features: ["2 noches de alojamiento", "Todos los domos del complejo", "Capacidad: hasta 16 personas", "Exclusividad total", "Personalización del servicio"],
    amenities: [
      { icon: createIcon(Coffee), text: "Desayuno familiar incluido" },
      { icon: createIcon(Droplets), text: "Uso exclusivo de tinajas termales" },
      { icon: createIcon(Wifi), text: "WiFi Starlink en todo el complejo" },
      { icon: createIcon(Flame), text: "Zonas de fogata para reuniones" },
      { icon: createIcon(BedDouble), text: "Domos completamente equipados" },
      { icon: createIcon(Mountain), text: "Acceso privado a senderos naturales" },
      { icon: createIcon(Home), text: "Privacidad total para tu familia" }
    ]
  }
];
