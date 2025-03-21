
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const individualPackages: PackageItem[] = [
  {
    id: "1",
    title: "Para el viajero en solitario",
    description: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. En la terraza, un buen libro y el sonido del bosque crean el ambiente ideal para un descanso profundo. Afuera, los senderos esperan ser explorados a tu propio ritmo.",
    detailedDescription: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. Sumérgete en la belleza del bosque nativo de Valle Las Trancas, dejando atrás el estrés de la rutina. Nuestros domos están diseñados para brindarte tranquilidad y conexión genuina con el entorno natural, sin comprometer la comodidad ni la calidad.",
    price: 120000,
    originalPrice: 150000,
    image: "/lovable-uploads/113a2ea1-c91a-409e-afed-9484312a2563.png",
    interiorImage: "/lovable-uploads/9d029773-a360-431b-a1b6-681971e6fb24.png",
    size: "32m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Desayuno con productos locales", "Capacidad: 2 personas", "Vistas al bosque nativo", "Acceso a senderos exclusivos"],
    amenities: [
      { icon: createIcon(Coffee), text: "Mini cocina equipada" },
      { icon: createIcon(Droplets), text: "Baños mineralizados (previa reserva)" },
      { icon: createIcon(Wifi), text: "WiFi Starlink de alta velocidad" },
      { icon: createIcon(Flame), text: "Calefacción ecológica" },
      { icon: createIcon(BedDouble), text: "Cama individual premium" },
      { icon: createIcon(Mountain), text: "Vistas panorámicas al bosque nativo" },
      { icon: createIcon(Users), text: "Ideal para viajeros solitarios" }
    ]
  },
  {
    id: "9",
    title: "Para quienes buscan simplicidad y descanso",
    description: "Despertar sin prisa, con el aroma del bosque entrando por la ventana. Preparar un café y salir a la terraza a sentir la brisa fresca. Aquí, cada día comienza sin apuro, siguiendo el ritmo de la naturaleza.",
    detailedDescription: "Despertar sin prisa, con el aroma del bosque entrando por la ventana. En Glamping Domos TreePod, el tiempo transcurre a otro ritmo. Disfruta de la simplicidad y la desconexión en un entorno sostenible, donde podrás reconectar contigo mismo mientras te rodea la belleza natural de Valle Las Trancas y la cordillera de los Andes. Un espacio para quienes valoran la tranquilidad y el descanso auténtico.",
    price: 115000,
    originalPrice: 145000,
    image: "/lovable-uploads/c951eccc-c6f1-4744-8bc8-fca101105107.png",
    interiorImage: "/lovable-uploads/0e4d1495-87f2-4608-8685-caddc7925222.png",
    size: "30m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Desayuno con productos de nuestro invernadero", "Capacidad: 2 personas", "Hamaca en terraza", "Biblioteca con libros de naturaleza"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cafetera de especialidad" },
      { icon: createIcon(Droplets), text: "Acceso a tinajas con agua mineralizada" },
      { icon: createIcon(Wifi), text: "WiFi Starlink (opcional)" },
      { icon: createIcon(Flame), text: "Calefacción a leña sostenible" },
      { icon: createIcon(BedDouble), text: "Cama confortable con vista al bosque" },
      { icon: createIcon(Mountain), text: "Terraza con hamaca" },
      { icon: createIcon(Users), text: "Ideal para desconexión" }
    ]
  }
];
