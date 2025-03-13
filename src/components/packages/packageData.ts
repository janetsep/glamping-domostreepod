
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "./PackageCard";
import React from "react";

// Function to create icon elements more safely
const createIcon = (Icon: React.ElementType) => {
  return React.createElement(Icon, { size: 18 });
};

export const packageData: PackageItem[] = [
  {
    id: "48a7a330-ebae-4e79-8f53-31a84ac900d9",
    title: "Para el viajero en solitario 🌿",
    description: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. En la terraza, un buen libro y el sonido del bosque crean el ambiente ideal para un descanso profundo. Afuera, los senderos esperan ser explorados a tu propio ritmo.",
    detailedDescription: "Un espacio único entre araucarias centenarias donde la arquitectura se funde con la naturaleza. Nuestros domos completamente equipados cuentan con terminaciones de lujo y vistas panorámicas al bosque y cielo estrellado.",
    price: 120000,
    originalPrice: 150000,
    image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
    interiorImage: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
    size: "32m²",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 4 personas", "Vistas al bosque", "Acceso a senderos"],
    amenities: [
      { icon: createIcon(Coffee), text: "Mini cocina equipada" },
      { icon: createIcon(Droplets), text: "Ducha con agua caliente" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Calefacción ecológica" },
      { icon: createIcon(BedDouble), text: "Cama king size premium" },
      { icon: createIcon(Mountain), text: "Vistas panorámicas al bosque nativo" },
      { icon: createIcon(Users), text: "Capacidad para 4 personas" }
    ]
  },
  {
    id: "58a7a330-ebae-4e79-8f53-31a84ac900d8",
    title: "Para la pareja en busca de tranquilidad 💙",
    description: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    detailedDescription: "El Domo Canelo, llamado así por el árbol sagrado mapuche, ofrece una experiencia de conexión profunda con la naturaleza sin renunciar al confort. Su jacuzzi al aire libre te permite contemplar las estrellas mientras te relajas en agua temperada.",
    price: 135000,
    originalPrice: 180000,
    image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
    interiorImage: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
    size: "38m²",
    maxGuests: 4,
    features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 4 personas", "Jacuzzi privado", "Wifi gratis"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina completamente equipada" },
      { icon: createIcon(Droplets), text: "Jacuzzi exterior privado" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Sistema de calefacción central" },
      { icon: createIcon(BedDouble), text: "Cama king size con ropa de cama premium" },
      { icon: createIcon(Mountain), text: "Terraza con vistas al valle" },
      { icon: createIcon(Users), text: "Capacidad para 4 personas" }
    ]
  },
  {
    id: "68a7a330-ebae-4e79-8f53-31a84ac900d7",
    title: "Para los aventureros 🥾",
    description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso. Dejas las botas en la entrada, enciendes la estufa a pellet y disfrutas de la vista mientras recuperas energías para la próxima aventura.",
    detailedDescription: "El Domo Coihue se eleva entre los árboles nativos para brindarte una experiencia única. Su diseño suspendido y su ducha panorámica te permiten sentirte parte del bosque, mientras disfrutas de todas las comodidades de un alojamiento de lujo.",
    price: 125000,
    originalPrice: 160000,
    image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
    interiorImage: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
    size: "36m²",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 4 personas", "Ducha panorámica", "Mini cocina"],
    amenities: [
      { icon: createIcon(Coffee), text: "Mini bar y café de especialidad" },
      { icon: createIcon(Droplets), text: "Ducha panorámica con vista al bosque" },
      { icon: createIcon(Wifi), text: "Conexión WiFi" },
      { icon: createIcon(Flame), text: "Calefacción de bajo consumo" },
      { icon: createIcon(BedDouble), text: "Cama queen con vistas al amanecer" },
      { icon: createIcon(Mountain), text: "Terraza privada suspendida" },
      { icon: createIcon(Users), text: "Capacidad para 4 personas" }
    ]
  },
  {
    id: "78a7a330-ebae-4e79-8f53-31a84ac900d6",
    title: "Para la familia con niños 🏡",
    description: "Los más pequeños exploran el bosque mientras los adultos preparan un asado en la parrilla. La piscina de agua fría se convierte en el lugar favorito de la tarde, y al caer la noche, las historias junto a la estufa crean recuerdos que quedan para siempre.",
    detailedDescription: "El Domo Lenga, nombrado por una de las especies más emblemáticas del bosque patagónico, ofrece una experiencia inmersiva en la naturaleza con todas las comodidades modernas. Su ubicación privilegiada permite disfrutar del bosque desde una perspectiva única.",
    price: 130000,
    originalPrice: 170000,
    image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png",
    interiorImage: "/lovable-uploads/badf4425-7a82-4330-9850-9dde76bc21eb.png",
    size: "34m²",
    maxGuests: 4,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 4 personas", "Mirador panorámico", "Rincón de lectura"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina totalmente equipada" },
      { icon: createIcon(Droplets), text: "Ducha de lluvia" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Estufa de leña" },
      { icon: createIcon(BedDouble), text: "Cama king con vista panorámica" },
      { icon: createIcon(Mountain), text: "Terraza elevada con vistas 360°" },
      { icon: createIcon(Users), text: "Capacidad para 4 personas" }
    ]
  }
];
