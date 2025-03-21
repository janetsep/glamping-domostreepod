
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "../PackageCard";
import { createIcon } from "./utils";

export const couplePackages: PackageItem[] = [
  {
    id: "2",
    title: "Para la pareja en busca de tranquilidad",
    description: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    detailedDescription: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. En TreePod, las parejas encontrarán el escenario perfecto para reconectar, lejos del bullicio y las distracciones. Nuestros domos geodésicos combinan intimidad y confort, mientras que las tinajas de aguas mineralizadas provenientes de las termas de Chillán ofrecen una experiencia relajante única. El valle de Las Trancas se convierte en el telón de fondo para momentos que perdurarán en su memoria.",
    price: 135000,
    originalPrice: 180000,
    image: "/lovable-uploads/41791139-e499-40bf-89c0-cb5a2947b4eb.png", 
    interiorImage: "/lovable-uploads/46270626-ab65-40db-895a-8668daa5032b.png",
    size: "38m²",
    maxGuests: 2,
    features: ["3 noches de alojamiento", "Desayuno con productos locales", "Capacidad: 2 personas", "Tinaja de aguas mineralizadas (previa reserva)", "Wifi Starlink gratis"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina completamente equipada" },
      { icon: createIcon(Droplets), text: "Tinajas de ciprés privadas (previa reserva)" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Sistema de calefacción central" },
      { icon: createIcon(BedDouble), text: "Cama king size con ropa de cama premium" },
      { icon: createIcon(Mountain), text: "Terraza con vistas panorámicas al bosque" },
      { icon: createIcon(Users), text: "Ideal para parejas" }
    ]
  },
  {
    id: "8",
    title: "Para quienes celebran ocasiones especiales",
    description: "Celebrar en medio de la montaña tiene otro significado. Una cena especial bajo las estrellas, la calidez del domo iluminado y la sensación de estar lejos del mundo convierten cualquier ocasión en un recuerdo inolvidable.",
    detailedDescription: "Celebrar en medio de la montaña tiene otro significado. Los momentos especiales merecen escenarios extraordinarios, y nuestros domos en Valle Las Trancas ofrecen ese marco perfecto. Ya sea un aniversario, cumpleaños o simplemente una escapada romántica, TreePod transforma cada celebración en una experiencia memorable. Disfruten de la privacidad de su domo, la exclusividad de las tinajas de aguas mineralizadas bajo el cielo estrellado, y la posibilidad de complementar con experiencias gastronómicas utilizando productos frescos de nuestro propio invernadero.",
    price: 150000,
    originalPrice: 190000,
    image: "/lovable-uploads/ad46dae8-5b0a-4e4a-bf84-e0752b40f588.png",
    interiorImage: "/lovable-uploads/5e0363de-646e-4577-acad-afd2dda92291.png",
    size: "40m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Botella de champagne de bienvenida", "Capacidad: 2 personas", "Decoración especial", "Cena romántica (previa reserva y pago extra)"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina gourmet" },
      { icon: createIcon(Droplets), text: "Tinaja con aguas termales mineralizadas" },
      { icon: createIcon(Wifi), text: "WiFi Starlink de alta velocidad" },
      { icon: createIcon(Flame), text: "Ambientación romántica" },
      { icon: createIcon(BedDouble), text: "Cama king premium" },
      { icon: createIcon(Mountain), text: "Terraza privada para ocasiones especiales" },
      { icon: createIcon(Users), text: "Servicio de concierge personalizado" }
    ]
  }
];
