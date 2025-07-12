
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users, Home, Heart, Sparkles } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

// Importar imágenes reales mejoradas
import treepodExterior from "@/assets/treepod-exterior-real.jpg";
import treepodInterior from "@/assets/treepod-interior-real.jpg";
import treepodSiteOverview from "@/assets/treepod-site-overview.jpg";

export const specialtyPackages: PackageItem[] = [
  {
    id: "4",
    title: "Para familias que buscan exclusividad total",
    description: "Reserva todo el complejo para tu familia y disfruta de una experiencia única de privacidad total. Todos los domos, las tinajas y la piscina de montaña serán exclusivamente para ustedes, creando recuerdos inolvidables en un entorno natural privilegiado.",
    detailedDescription: "Reserva todo el complejo TreePod para tu familia y disfruta de una experiencia única con privacidad total en Valle Las Trancas. Todos los domos, las tinajas de agua mineralizada y la piscina de montaña alimentada por la cascada Velo de Novia serán exclusivamente para ustedes. El entorno perfecto para celebraciones familiares, reuniones especiales o simplemente disfrutar de tiempo de calidad con los tuyos en la tranquilidad del bosque nativo de la cordillera de los Andes.",
    price: 450000,
    originalPrice: 550000,
    image: treepodSiteOverview,
    interiorImage: treepodInterior,
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
    price: 520000,
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
  },
  {
    id: "cumpleanos-package",
    title: "Cumpleaños en la Naturaleza",
    description: "Una celebración diferente en medio de la naturaleza, perfecta para festejar tu cumpleaños con familia, amigos o en pareja en un entorno único y privado.",
    detailedDescription: "Una celebración diferente en medio de la naturaleza, perfecta para festejar tu cumpleaños con familia, amigos o en pareja en un entorno único y privado. Este paquete está diseñado para crear momentos inolvidables en tu día especial, combinando la tranquilidad del bosque nativo con todas las comodidades necesarias para una celebración perfecta. Incluye decoración especial, una torta artesanal y todo lo necesario para que tu cumpleaños sea una experiencia memorable rodeado de naturaleza.",
    price: 580000,
    originalPrice: 680000,
    image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png",
    interiorImage: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png",
    size: "1 domo",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Decoración especial de cumpleaños", "Torta artesanal", "Todas las comidas incluidas", "1 hora de tinajas incluida"],
    amenities: [
      { icon: createIcon(Heart), text: "Decoración especial de cumpleaños" },
      { icon: createIcon(Sparkles), text: "Torta artesanal + espumante" },
      { icon: createIcon(Droplets), text: "1 hora de tinajas de ciprés incluida" },
      { icon: createIcon(Coffee), text: "Todas las comidas + picoteo festivo" },
      { icon: createIcon(Mountain), text: "Terraza con mobiliario para celebrar" },
      { icon: createIcon(BedDouble), text: "Domo geodésico completo" },
      { icon: createIcon(Wifi), text: "WiFi Starlink disponible" }
    ]
  },
  {
    id: "aniversarios-package", 
    title: "Aniversarios Románticos",
    description: "Una celebración romántica en medio de la naturaleza, perfecta para conmemorar aniversarios de matrimonio, noviazgo o cualquier fecha especial en pareja en un entorno íntimo y privado.",
    detailedDescription: "Una celebración romántica en medio de la naturaleza, perfecta para conmemorar aniversarios de matrimonio, noviazgo o cualquier fecha especial en pareja en un entorno íntimo y privado. Este paquete está diseñado especialmente para parejas que buscan reconectar y celebrar su amor en un ambiente único, con detalles románticos cuidadosamente preparados. Incluye decoración especial, cena a la luz de las velas, masajes en pareja y todo lo necesario para crear recuerdos inolvidables en su fecha especial.",
    price: 650000,
    originalPrice: 750000,
    image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png",
    interiorImage: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png",
    size: "1 domo",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Decoración romántica completa", "Cena romántica a la luz de las velas", "Masaje en pareja incluido", "2 horas de tinajas incluidas"],
    amenities: [
      { icon: createIcon(Heart), text: "Decoración romántica completa" },
      { icon: createIcon(Sparkles), text: "Cena romántica a la luz de las velas" },
      { icon: createIcon(Droplets), text: "2 horas de tinajas de ciprés incluidas" },
      { icon: createIcon(Coffee), text: "Comidas gourmet + espumante premium" },
      { icon: createIcon(Mountain), text: "Masaje relajante en pareja (30 min)" },
      { icon: createIcon(BedDouble), text: "Terraza privada decorada" },
      { icon: createIcon(Wifi), text: "WiFi Starlink disponible" }
    ]
  },
  {
    id: "fiesta-familiar-package",
    title: "Fiesta Familiar en la Naturaleza", 
    description: "Una experiencia diseñada para reunir a toda la familia en un entorno natural donde grandes y pequeños pueden disfrutar de actividades al aire libre, comidas compartidas y momentos inolvidables bajo las estrellas.",
    detailedDescription: "Una experiencia diseñada para reunir a toda la familia en un entorno natural donde grandes y pequeños pueden disfrutar de actividades al aire libre, comidas compartidas y momentos inolvidables bajo las estrellas. Este paquete familiar incluye todo lo necesario para una celebración perfecta: desde la parrilla para el asado familiar hasta el fogón nocturno para compartir historias. Ideal para cumpleaños familiares, reuniones, celebraciones especiales o simplemente para pasar tiempo de calidad en familia rodeados de la tranquilidad del bosque nativo.",
    price: 550000,
    originalPrice: 650000,
    image: treepodExterior,
    interiorImage: treepodInterior,
    size: "1 domo",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Parrilla completa para asado", "Fogón nocturno", "Todas las comidas familiares", "1 hora de tinajas incluida"],
    amenities: [
      { icon: createIcon(Flame), text: "Parrilla completa + fogón nocturno" },
      { icon: createIcon(Users), text: "Decoración festiva familiar" },
      { icon: createIcon(Droplets), text: "1 hora de tinajas de ciprés incluida" },
      { icon: createIcon(Coffee), text: "Comidas + bebidas para toda la familia" },
      { icon: createIcon(Mountain), text: "Terraza amplia con mobiliario para grupos" },
      { icon: createIcon(BedDouble), text: "Domo geodésico completo" },
      { icon: createIcon(Wifi), text: "WiFi Starlink + leña incluida" }
    ]
  }
];
