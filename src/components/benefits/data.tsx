
import { ReactNode } from "react";
import { 
  Droplets, Mountain, Book, Wifi, Bath, Heart, 
  Star, Bike, Map, Coffee, Utensils, Car, SquareLibrary,
  TreePine, Gamepad, Dice1, TreeDeciduous
} from "lucide-react";
import { LucideFlame } from "lucide-react";
import { ExperiencesData } from "./types";

// Create icon components separately outside of the data structure
const BathIcon = () => <Bath className="w-12 h-12 text-accent" />;
const HeartIcon = () => <Heart className="w-12 h-12 text-accent" />;
const StarIcon = () => <Star className="w-12 h-12 text-accent" />;
const MountainIcon = () => <Mountain className="w-12 h-12 text-accent" />;
const BikeIcon = () => <Bike className="w-12 h-12 text-accent" />;
const MapIcon = () => <Map className="w-12 h-12 text-accent" />;
const CoffeeIcon = () => <Coffee className="w-12 h-12 text-accent" />;
const UtensilsIcon = () => <Utensils className="w-12 h-12 text-accent" />;
const BookIcon = () => <Book className="w-12 h-12 text-accent" />;
const WifiIcon = () => <Wifi className="w-12 h-12 text-accent" />;
const CarIcon = () => <Car className="w-12 h-12 text-accent" />;
const FlameIcon = () => <LucideFlame className="w-12 h-12 text-accent" />;
const LibraryIcon = () => <SquareLibrary className="w-12 h-12 text-accent" />;
const TreeIcon = () => <TreePine className="w-12 h-12 text-accent" />;
const GamepadIcon = () => <Gamepad className="w-12 h-12 text-accent" />;
const DiceIcon = () => <Dice1 className="w-12 h-12 text-accent" />;
const TreeDeciduousIcon = () => <TreeDeciduous className="w-12 h-12 text-accent" />;
const DropletsIcon = () => <Droplets className="w-12 h-12 text-accent" />;

export const experiencesData: ExperiencesData = {
  tinajas: {
    title: "Tinajas de Ciprés",
    description: "Renueva cuerpo y mente con nuestras tinajas de agua mineralizada en un entorno natural único",
    items: [{
      icon: <BathIcon />,
      title: "Tinajas de Ciprés con Agua Mineralizada",
      description: "Nuestras tinajas artesanales están fabricadas con madera de ciprés patagónico y se llenan con agua mineralizada tratada que se calienta a una temperatura ideal de 38-40°C. Esta experiencia única proporciona beneficios como relajación muscular, mejor circulación sanguínea y reducción del estrés.",
      details: "Las tinajas son preparadas exclusivamente para tu reserva y cuentan con vistas privilegiadas al bosque nativo. El agua mineralizada está enriquecida con sales naturales que favorecen la desintoxicación y el bienestar general.",
      image: "/lovable-uploads/0b9c17ba-d458-4eb9-be71-bf6d6efd9f37.png"
    }, {
      icon: <HeartIcon />,
      title: "Masajes y Terapias Alternativas",
      description: "Ofrecemos sesiones de masajes terapéuticos y técnicas de relajación con terapeutas certificados que utilizan productos naturales de la zona.",
      details: "Puedes reservar con anticipación una sesión en la privacidad de tu domo o en nuestro espacio dedicado con vistas al valle. Trabajamos con aceites esenciales de plantas nativas que potencian los beneficios curativos.",
      image: "/lovable-uploads/29224f80-2202-44a2-ab2c-51f6ae9baaae.png"
    }, {
      icon: <FlameIcon />,
      title: "Parrilla Privada y Leña",
      description: "Disfruta de un asado al estilo patagónico con nuestra parrilla exclusiva y leña seleccionada para un sabor óptimo.",
      details: "Proveemos kit de asador, leña seca y carbón para que disfrutes de la experiencia completa. Si lo prefieres, podemos coordinar un asador profesional que prepare el fuego y te aconseje sobre los mejores cortes y técnicas de cocción.",
      image: "/lovable-uploads/717e7999-5c62-4fc9-a165-917b692351f9.png"
    }]
  },
  recorridos: {
    title: "Recorridos y Paisajes",
    description: "Explora la naturaleza patagónica con nuestras experiencias de aventura y senderismo",
    items: [{
      icon: <MountainIcon />,
      title: "Trekking en Senderos Exclusivos",
      description: "Rutas de senderismo para todos los niveles en colaboración con guías locales certificados que conocen cada rincón del territorio.",
      details: "Contamos con alianzas con los mejores guías de montaña de la región que te llevarán a descubrir lagos ocultos, miradores panorámicos y bosques centenarios. Cada ruta está clasificada por dificultad y duración para que elijas la que mejor se adapte a tus preferencias.",
      image: "/lovable-uploads/46cd7d70-4f1c-46b5-8309-ade38a6c32a0.png"
    }, {
      icon: <BikeIcon />,
      title: "Cicloturismo y Mountain Bike",
      description: "Recorridos en bicicleta por los alrededores, con rutas especialmente diseñadas para disfrutar del paisaje a tu ritmo.",
      details: "Disponemos de bicicletas de montaña de alta gama para alquilar y mapas detallados de las mejores rutas. Nuestros socios locales ofrecen tours guiados que incluyen paradas en miradores increíbles y productores artesanales de la zona.",
      image: "/lovable-uploads/5e659144-32c4-419c-aa12-1d8d51ee81b5.png"
    }, {
      icon: <MapIcon />,
      title: "Excursiones a Parques Nacionales",
      description: "Tours organizados a los parques nacionales cercanos, con transporte incluido y guías especializados en flora y fauna nativa.",
      details: "Trabajamos con operadores turísticos locales que ofrecen excursiones a los parques nacionales más emblemáticos de la región. Incluyen transporte desde nuestra propiedad, almuerzo gourmet y guías bilingües apasionados por la conservación.",
      image: "/lovable-uploads/4221fa8d-c975-4277-bedf-a8ff6218c48d.png"
    }]
  },
  historias: {
    title: "Historias y Cultura Local",
    description: "Descubre las tradiciones y sabores de la cultura patagónica",
    items: [{
      icon: <CoffeeIcon />,
      title: "Gastronomía Típica Chilena",
      description: "Cada mañana recibirás una canasta con pan recién horneado, mermeladas caseras, frutas de temporada y productos lácteos de granjas cercanas.",
      details: "Nuestro desayuno es preparado al amanecer con ingredientes cuidadosamente seleccionados. Incluye opciones para todas las preferencias alimentarias, incluyendo alternativas veganas y sin gluten. El café orgánico proviene de una cooperativa regional que practica comercio justo.",
      image: "/lovable-uploads/3c154ff6-0916-450e-8515-dc48d7f232fd.png"
    }, {
      icon: <UtensilsIcon />,
      title: "Cocina Local y Tradiciones",
      description: "Para ocasiones especiales, contrata a nuestro chef que preparará una cena romántica en tu domo o un picnic para llevar en tus excursiones.",
      details: "Nuestro chef crea menús personalizados utilizando hierbas frescas de nuestro invernadero orgánico y productos de temporada. Los picnics incluyen embutidos artesanales, quesos locales, conservas caseras y vinos de pequeñas bodegas de la región.",
      image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png"
    }, {
      icon: <BookIcon />,
      title: "Historias del Valle Las Trancas",
      description: "Conoce la historia y cultura del valle a través de relatos de sus habitantes y visitas a lugares emblemáticos.",
      details: "Organizamos charlas con lugareños que llevan generaciones viviendo en el valle, quienes comparten sus conocimientos sobre la flora medicinal nativa, leyendas locales y la evolución del turismo en la zona. También puedes visitar pequeños museos y centros culturales cercanos.",
      image: "/lovable-uploads/1f579fd8-1af0-4397-9254-2cd8cbb54410.png"
    }]
  },
  bosque: {
    title: "Baño de Bosque",
    description: "Conecta con la naturaleza a través de la terapia japonesa 'shinrin-yoku' en nuestro bosque nativo",
    items: [{
      icon: <TreeIcon />,
      title: "Baño de Bosque Guiado",
      description: "Practica 'shinrin-yoku', la terapia japonesa de inmersión en el bosque, con caminatas conscientes en nuestro entorno natural.",
      details: "Un guía especializado te llevará por senderos exclusivos dentro de nuestro terreno, donde realizarás ejercicios de respiración y meditación para conectar profundamente con la naturaleza. Estudios científicos demuestran que esta práctica reduce el cortisol y fortalece el sistema inmunológico.",
      image: "/lovable-uploads/cd46dec0-e3e5-400a-aa1e-03c20428cfb1.png"
    }, {
      icon: <DropletsIcon />,
      title: "Tinaja de Ciprés",
      description: "Disfruta de un relajante baño en nuestras tinajas de ciprés rodeado por el bosque nativo, una experiencia única de bienestar.",
      details: "Nuestras tinajas de ciprés están ubicadas estratégicamente para que disfrutes de la privacidad y las vistas al bosque mientras te sumerges en aguas mineralizadas a temperatura ideal. La combinación del aroma natural del ciprés, el calor del agua y el entorno boscoso crea una experiencia sensorial completa.",
      image: "/lovable-uploads/0b9c17ba-d458-4eb9-be71-bf6d6efd9f37.png"
    }, {
      icon: <TreeDeciduousIcon />,
      title: "Meditación entre Árboles Nativos",
      description: "Sesiones de meditación guiada entre árboles centenarios que te ayudarán a reconectar con tu esencia y desconectar del estrés diario.",
      details: "Nuestros guías espirituales te enseñarán técnicas ancestrales de meditación adaptadas al entorno natural. Cada sesión dura aproximadamente 90 minutos y está diseñada para aprovechar la energía vital de nuestro bosque nativo patagónico.",
      image: "/lovable-uploads/cd46dec0-e3e5-400a-aa1e-03c20428cfb1.png"
    }, {
      icon: <StarIcon />,
      title: "Terapia Holística Natural",
      description: "Combina el baño de bosque con otras terapias naturales como aromaterapia, cromoterapia y escucha consciente de los sonidos del bosque.",
      details: "Este enfoque integral busca equilibrar tus sentidos a través de experiencias multisensoriales. Utilizamos aceites esenciales de árboles locales, visualizaciones guiadas con los colores naturales del entorno y técnicas de escucha profunda de los sonidos del bosque.",
      image: "/lovable-uploads/cd46dec0-e3e5-400a-aa1e-03c20428cfb1.png"
    }]
  },
  juegos: {
    title: "Juegos de Mesa",
    description: "Disfruta de momentos especiales con nuestra selección de juegos de mesa para todas las edades",
    items: [{
      icon: <GamepadIcon />,
      title: "Biblioteca de Juegos de Mesa",
      description: "Una selección cuidada de juegos clásicos y modernos para compartir momentos especiales con familia y amigos.",
      details: "Nuestra colección incluye desde juegos familiares como Monopoly, Scrabble y Jenga hasta opciones más estratégicas como Catan, Carcassonne y Ticket to Ride. También contamos con juegos chilenos que te permitirán acercarte a la cultura local de manera lúdica.",
      image: "/lovable-uploads/932878e8-583c-4ca7-91d9-4c8183c525e3.png"
    }, {
      icon: <DiceIcon />,
      title: "Noches de Juegos Temáticas",
      description: "Organizamos sesiones especiales de juegos con snacks y bebidas para crear una experiencia memorable en tu estadía.",
      details: "Nuestro anfitrión puede guiarte con los mejores juegos según la ocasión, ya sea una noche romántica en pareja, una reunión familiar o una competencia amistosa entre amigos. Incluimos aperitivos locales y bebidas para hacer la experiencia aún más especial.",
      image: "/lovable-uploads/932878e8-583c-4ca7-91d9-4c8183c525e3.png"
    }, {
      icon: <LibraryIcon />,
      title: "Biblioteca y Rincón de Lectura",
      description: "Un espacio acogedor con libros sobre la región, literatura chilena y revistas especializadas en naturaleza y viajes.",
      details: "El rincón de lectura cuenta con una vista privilegiada al bosque y sillones cómodos donde podrás sumergirte en historias locales, aprender sobre la flora y fauna nativa o simplemente disfrutar de un buen libro acompañado del sonido de las aves y el viento entre los árboles.",
      image: "/lovable-uploads/932878e8-583c-4ca7-91d9-4c8183c525e3.png"
    }]
  }
};
