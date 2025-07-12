
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users, Home, Heart, Sparkles } from "lucide-react";
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
  },
  {
    id: "mujeres-relax-package",
    title: "Mujeres Relax - Retiro de Bienestar",
    description: "Un paquete especial diseñado para mujeres que buscan relajación y bienestar. Incluye acceso a tinajas termales con aguas mineralizadas, actividades de relajación y un ambiente tranquilo para reconectar contigo misma.",
    detailedDescription: "Escápate del estrés diario y regálate un momento de paz y tranquilidad en TreePod. Nuestro paquete Mujeres Relax está especialmente diseñado para crear un espacio de sanación y renovación. Disfruta de las propiedades terapéuticas de nuestras aguas mineralizadas en tinajas de ciprés, rodeada de la serenidad del bosque nativo. El ambiente perfecto para meditar, leer, practicar yoga o simplemente conectar contigo misma.",
    price: 180000,
    originalPrice: 220000,
    image: "/lovable-uploads/ba985569-8f29-4da1-af9c-2aba9a5a886b.png",
    interiorImage: "/lovable-uploads/9c5dac9d-9528-439a-9d1c-2257f501f821.png",
    size: "1-2 domos",
    maxGuests: 8,
    features: ["2 noches de alojamiento", "Hasta 2 domos disponibles", "Capacidad: hasta 8 personas", "Ambiente tranquilo", "Actividades de bienestar"],
    amenities: [
      { icon: createIcon(Heart), text: "Ambiente de relajación y bienestar" },
      { icon: createIcon(Droplets), text: "Acceso prioritario a tinajas termales" },
      { icon: createIcon(Sparkles), text: "Kit de bienvenida especial" },
      { icon: createIcon(Mountain), text: "Senderos para meditación al aire libre" },
      { icon: createIcon(Coffee), text: "Infusiones relajantes incluidas" },
      { icon: createIcon(BedDouble), text: "Domos acondicionados para el descanso" },
      { icon: createIcon(Wifi), text: "WiFi disponible (uso opcional)" }
    ]
  }
];
