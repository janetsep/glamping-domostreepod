
import { Coffee, Droplets, Wifi, Flame, BedDouble, Mountain, Users } from "lucide-react";
import { PackageItem } from "./PackageCard";
import React from "react";

// Function to create icon elements more safely
const createIcon = (Icon: React.ElementType) => {
  return React.createElement(Icon, { size: 18 });
};

export const packageData: PackageItem[] = [
  {
    id: "1",
    title: "Para el viajero en solitario 🌿",
    description: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. En la terraza, un buen libro y el sonido del bosque crean el ambiente ideal para un descanso profundo. Afuera, los senderos esperan ser explorados a tu propio ritmo.",
    detailedDescription: "El refugio perfecto para desconectarte del ruido y reencontrarte con la naturaleza. En la terraza, un buen libro y el sonido del bosque crean el ambiente ideal para un descanso profundo. Afuera, los senderos esperan ser explorados a tu propio ritmo.",
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
    id: "2",
    title: "Para la pareja en busca de tranquilidad 💙",
    description: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    detailedDescription: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    price: 135000,
    originalPrice: 180000,
    image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
    interiorImage: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
    size: "38m²",
    maxGuests: 2,
    features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Jacuzzi privado", "Wifi gratis"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina completamente equipada" },
      { icon: createIcon(Droplets), text: "Jacuzzi exterior privado" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Sistema de calefacción central" },
      { icon: createIcon(BedDouble), text: "Cama king size con ropa de cama premium" },
      { icon: createIcon(Mountain), text: "Terraza con vistas al valle" },
      { icon: createIcon(Users), text: "Ideal para parejas" }
    ]
  },
  {
    id: "3",
    title: "Para los aventureros 🥾",
    description: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso. Dejas las botas en la entrada, enciendes la estufa a pellet y disfrutas de la vista mientras recuperas energías para la próxima aventura.",
    detailedDescription: "Después de una jornada recorriendo la montaña, el domo se convierte en tu refugio de descanso. Dejas las botas en la entrada, enciendes la estufa a pellet y disfrutas de la vista mientras recuperas energías para la próxima aventura.",
    price: 125000,
    originalPrice: 160000,
    image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
    interiorImage: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
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
    id: "4",
    title: "Para la familia con niños 🏡",
    description: "Los más pequeños exploran el bosque mientras los adultos preparan un asado en la parrilla. La piscina de agua fría se convierte en el lugar favorito de la tarde, y al caer la noche, las historias junto a la estufa crean recuerdos que quedan para siempre.",
    detailedDescription: "Los más pequeños exploran el bosque mientras los adultos preparan un asado en la parrilla. La piscina de agua fría se convierte en el lugar favorito de la tarde, y al caer la noche, las historias junto a la estufa crean recuerdos que quedan para siempre.",
    price: 145000,
    originalPrice: 180000,
    image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png",
    interiorImage: "/lovable-uploads/badf4425-7a82-4330-9850-9dde76bc21eb.png",
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
    image: "/lovable-uploads/dbcd97fc-9467-44b8-af76-01592c156f3f.png",
    interiorImage: "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png",
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
    id: "6",
    title: "Para el fotógrafo de naturaleza 📷",
    description: "Cada amanecer trae un espectáculo de luces y sombras en la montaña. Desde la terraza del domo, la cámara capta el vuelo de un cóndor y el reflejo del sol en los árboles. La niebla matutina le da un toque mágico al paisaje.",
    detailedDescription: "Cada amanecer trae un espectáculo de luces y sombras en la montaña. Desde la terraza del domo, la cámara capta el vuelo de un cóndor y el reflejo del sol en los árboles. La niebla matutina le da un toque mágico al paisaje.",
    price: 130000,
    originalPrice: 165000,
    image: "/lovable-uploads/8d77f343-0ff2-4d41-a7dd-54af7e387725.png",
    interiorImage: "/lovable-uploads/b17d7f25-f4ae-4468-90bd-4aa15f4843a9.png",
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
  },
  {
    id: "7",
    title: "Para los amantes del trekking ⛰️",
    description: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales. El regreso es recompensado con una comida caliente en la cocina del domo y una noche de descanso profundo rodeado de bosque.",
    detailedDescription: "El sendero comienza a pocos metros del domo, llevando a cascadas escondidas y miradores naturales. El regreso es recompensado con una comida caliente en la cocina del domo y una noche de descanso profundo rodeado de bosque.",
    price: 125000,
    originalPrice: 155000,
    image: "/lovable-uploads/e07b0d00-f09b-4a23-b937-964931a152a6.png",
    interiorImage: "/lovable-uploads/0d4b95ab-56f3-4e89-9fb7-86f3f232bbdc.png",
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
    id: "8",
    title: "Para quienes buscan una escapada especial 🎉",
    description: "Celebrar en medio de la montaña tiene otro significado. Una cena especial bajo las estrellas, la calidez del domo y la sensación de estar lejos del mundo convierten cualquier ocasión en un recuerdo inolvidable.",
    detailedDescription: "Celebrar en medio de la montaña tiene otro significado. Una cena especial bajo las estrellas, la calidez del domo y la sensación de estar lejos del mundo convierten cualquier ocasión en un recuerdo inolvidable.",
    price: 150000,
    originalPrice: 190000,
    image: "/lovable-uploads/2cdb6a1d-3491-4fb5-afcf-6709006a940f.png",
    interiorImage: "/lovable-uploads/221f04ad-9f65-4671-866a-1844175adeb0.png",
    size: "40m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Botella de champagne", "Capacidad: 2 personas", "Decoración especial", "Cena romántica"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cocina gourmet" },
      { icon: createIcon(Droplets), text: "Jacuzzi con vista al bosque" },
      { icon: createIcon(Wifi), text: "WiFi de alta velocidad" },
      { icon: createIcon(Flame), text: "Ambientación romántica" },
      { icon: createIcon(BedDouble), text: "Cama king premium" },
      { icon: createIcon(Mountain), text: "Terraza privada para ocasiones especiales" },
      { icon: createIcon(Users), text: "Servicio de concierge" }
    ]
  },
  {
    id: "9",
    title: "Para quienes buscan simplicidad y descanso ☕",
    description: "Despertar sin prisa, con el aroma del bosque entrando por la ventana. Preparar un café y salir a la terraza a sentir la brisa fresca. Aquí, cada día comienza sin apuro, siguiendo el ritmo de la naturaleza.",
    detailedDescription: "Despertar sin prisa, con el aroma del bosque entrando por la ventana. Preparar un café y salir a la terraza a sentir la brisa fresca. Aquí, cada día comienza sin apuro, siguiendo el ritmo de la naturaleza.",
    price: 115000,
    originalPrice: 145000,
    image: "/lovable-uploads/ab978d5a-f892-4040-8138-26bc24a5e298.png",
    interiorImage: "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png",
    size: "30m²",
    maxGuests: 2,
    features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Hamaca en terraza", "Biblioteca minimalista"],
    amenities: [
      { icon: createIcon(Coffee), text: "Cafetera de especialidad" },
      { icon: createIcon(Droplets), text: "Ducha con productos naturales" },
      { icon: createIcon(Wifi), text: "WiFi (opcional)" },
      { icon: createIcon(Flame), text: "Calefacción a leña" },
      { icon: createIcon(BedDouble), text: "Cama confortable con vista al bosque" },
      { icon: createIcon(Mountain), text: "Terraza con hamaca" },
      { icon: createIcon(Users), text: "Ideal para desconexión" }
    ]
  },
  {
    id: "10",
    title: "Para el viajero que busca nuevas experiencias 🌎",
    description: "Cada detalle del domo está pensado para disfrutar el entorno sin interrupciones. Desde la comodidad de la cama, la vista del bosque es un recordatorio de que estás en un lugar especial, listo para descubrir lo que el valle tiene para ofrecer.",
    detailedDescription: "Cada detalle del domo está pensado para disfrutar el entorno sin interrupciones. Desde la comodidad de la cama, la vista del bosque es un recordatorio de que estás en un lugar especial, listo para descubrir lo que el valle tiene para ofrecer.",
    price: 135000,
    originalPrice: 170000,
    image: "/lovable-uploads/aeac7b47-8316-4eef-b586-34cc71ffa668.png",
    interiorImage: "/lovable-uploads/3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png",
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
