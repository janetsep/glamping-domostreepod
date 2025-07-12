import React from "react";
import {
  Droplets, Mountain, Book, Wifi, Bath, Heart, 
  Star, Bike, Map, Coffee, Utensils, Car, SquareLibrary,
  TreePine, Gamepad, Dice1, TreeDeciduous, Thermometer,
  Sparkles, GlassWater, FlameKindling, BookOpen
} from "lucide-react";
import { LucideFlame } from "lucide-react";
import { ExperiencesData } from "./types";

// Icons
const WifiIcon = () => <Wifi className="w-12 h-12 text-accent" />;
const BathIcon = () => <Bath className="w-12 h-12 text-accent" />;
const HeartIcon = () => <Heart className="w-12 h-12 text-accent" />;
const StarIcon = () => <Star className="w-12 h-12 text-accent" />;
const BikeIcon = () => <Bike className="w-12 h-12 text-accent" />;
const MapIcon = () => <Map className="w-12 h-12 text-accent" />;
const CoffeeIcon = () => <Coffee className="w-12 h-12 text-accent" />;
const UtensilsIcon = () => <Utensils className="w-12 h-12 text-accent" />;
const CarIcon = () => <Car className="w-12 h-12 text-accent" />;
const SquareLibraryIcon = () => <SquareLibrary className="w-12 h-12 text-accent" />;
const DropletsIcon = () => <Droplets className="w-12 h-12 text-accent" />;
const MountainIcon = () => <Mountain className="w-12 h-12 text-accent" />;
const BookIcon = () => <Book className="w-12 h-12 text-accent" />;
const TreePineIcon = () => <TreePine className="w-12 h-12 text-accent" />;
const GamepadIcon = () => <Gamepad className="w-12 h-12 text-accent" />;
const DiceIcon = () => <Dice1 className="w-12 h-12 text-accent" />;
const TreeDeciduousIcon = () => <TreeDeciduous className="w-12 h-12 text-accent" />;
const ThermometerIcon = () => <Thermometer className="w-12 h-12 text-accent" />;
const FlameIcon = () => <LucideFlame className="w-12 h-12 text-accent" />;
const SparklesIcon = () => <Sparkles className="w-12 h-12 text-accent" />;
const GlassWaterIcon = () => <GlassWater className="w-12 h-12 text-accent" />;
const FlameKindlingIcon = () => <FlameKindling className="w-12 h-12 text-accent" />;
const BookOpenIcon = () => <BookOpen className="w-12 h-12 text-accent" />;

export const experiencesData: ExperiencesData = {
  recorridos: {
    title: "Recorridos y Paisajes",
    description: "Explora los impresionantes paisajes del Valle Las Trancas, actividades al aire libre autoguiadas.",
    items: [
    {
      icon: <BikeIcon />,
      title: "Tours en Bicicleta",
      description: "Recorre los senderos del valle con nuestras bicicletas de montaña premium.",
      details: "Ofrecemos rutas guiadas y autoguiadas para todos los niveles de habilidad. Nuestras bicicletas cuentan con asistencia eléctrica opcional, perfectas para explorar los cerros circundantes. Incluye mapa, casco, botella de agua y kit de reparación.",
      image: "/lovable-uploads/daf4f24d-4485-4324-9991-3f7d52a79e0f.png"
    }, {
      icon: <MapIcon />,
      title: "Senderismo por Bosque Nativo",
      description: "Explora senderos exclusivos que atraviesan nuestro bosque de Ñirres, Coihues y Araucarias.",
      details: "Nuestros senderos ofrecen vistas panorámicas al Valle Las Trancas y los Nevados de Chillán. Cada ruta está cuidadosamente marcada y mantenida, con puntos de interés y áreas de descanso estratégicamente ubicadas para disfrutar de la flora y fauna local.",
      image: "/lovable-uploads/7202eec3-bd82-4939-90a9-0a6509fa2af0.png"
    }, {
      icon: <CarIcon />,
      title: "Excursiones a Parques Nacionales",
      description: "Visita los majestuosos Parques Nacionales cercanos con nuestras excursiones guiadas.",
      details: "Trabajamos con operadores turísticos locales que ofrecen excursiones a los parques nacionales más emblemáticos de la región. Incluyen transporte desde nuestra propiedad, almuerzo gourmet y guías bilingües apasionados por la conservación.",
      image: "/lovable-uploads/a12a8e24-f99f-48c6-9bc2-eea9e8df4ef5.png"
    }, {
      icon: <MountainIcon />,
      title: "Aventuras Guiadas en la Naturaleza",
      description: "Explora la belleza virgen del Valle Las Trancas de la mano de expertos operadores locales.",
      details: "Una aventura segura y fascinante para conectar profundamente con la biodiversidad única del sur de Chile. Trekking, senderismo interpretativo, avistamiento de fauna y más: descubre bosques encantados, paisajes volcánicos y senderos inolvidables que ofrecen la verdadera esencia cordillerana.",
      image: "/lovable-uploads/26544819-643d-4e3f-8599-74f7f3611221.png"
    }
    ],
  },
  historias: {
    title: "Historias y Cultura Local",
    description: "Descubre las fascinantes historias y tradiciones culturales que han dado forma al Valle Las Trancas y sus alrededores.",
    items: [
    {
      icon: <BookIcon />,
      title: "Ruta de los Pincheira",
      description: "Descubre la fascinante historia de los hermanos Pincheira, legendarios bandidos del siglo XIX.",
      details: "Esta experiencia combina senderismo suave con inmersión histórica. Visitarás los refugios naturales y puntos estratégicos utilizados por esta banda durante sus años de actividad. Un guía historiador te sumergirá en las leyendas y realidades de estos personajes que desafiaron al ejército chileno.",
      image: "/lovable-uploads/0aba3582-f7e0-478e-b316-3893d4cebacc.png"
    }, {
      icon: <BookOpenIcon />,
      title: "Leyendas del Volcán",
      description: "Conoce las historias ancestrales del Nevado de Chillán en una charla mágica alrededor del fuego.",
      details: "Una experiencia cultural enriquecedora que fortalece el respeto por nuestro patrimonio natural. Aprende sobre el poder curativo y la importancia cultural de las aguas volcánicas, tal como lo han descrito estudios históricos y científicos, mientras observas la silueta imponente del volcán en el horizonte.",
      image: "/lovable-uploads/8c94b429-4fba-49f4-a9e1-9d5970782bba.png"
    }, {
      icon: <SquareLibraryIcon />,
      title: "Artesanía Local",
      description: "Aprende sobre las técnicas ancestrales de artesanía en lana, madera y cerámica de la zona.",
      details: "Visitas a talleres de artesanos locales que mantienen vivas las tradiciones de la zona. Podrás participar en talleres prácticos donde aprenderás técnicas básicas y te llevarás una pieza hecha por ti. Incluye materiales, instrucción y una degustación de productos locales.",
      image: "/lovable-uploads/15e939f8-681c-4a2e-a19a-8cace70e9e38.png"
    }
    ],
  },
  bosque: {
    title: "Baño de Bosque y Bienestar",
    description: "Sumérgete en la tranquilidad del bosque nativo y disfruta de experiencias que nutren cuerpo, mente y espíritu.",
    items: [
    {
      icon: <TreePineIcon />,
      title: "Meditación Guiada en el Bosque",
      description: "Sesiones de meditación entre antiguos árboles nativos guiadas por expertos en mindfulness.",
      details: "La práctica de meditación en nuestro bosque ofrece beneficios demostrados para reducir el estrés y mejorar el bienestar. Las sesiones duran aproximadamente 1 hora y están diseñadas tanto para principiantes como para practicantes experimentados. Se incluyen esterillas, mantas y té de hierbas locales.",
      image: "/lovable-uploads/daf4f24d-4485-4324-9991-3f7d52a79e0f.png"
    }, {
      icon: <TreeDeciduousIcon />,
      title: "Terapia Forestal",
      description: "Experimenta el poder curativo de los bosques con nuestro programa de terapia forestal.",
      details: "Basado en la práctica japonesa del 'Shinrin-yoku' (baño de bosque), esta experiencia guiada te conecta profundamente con la naturaleza a través de tus sentidos. Estudios científicos han demostrado sus beneficios para el sistema inmunológico, la reducción de hormonas del estrés y la mejora del estado de ánimo.",
      image: "/lovable-uploads/7202eec3-bd82-4939-90a9-0a6509fa2af0.png"
    }, {
      icon: <ThermometerIcon />,
      title: "Baños Termales Volcánicos",
      description: "Sumérgete en las mágicas aguas termales provenientes directamente del volcán Nevados de Chillán.",
      details: "Estas aguas poseen propiedades reconocidas científicamente por aliviar dolores musculares, mejorar la piel y reducir el estrés. Reconocidas por siglos debido a sus propiedades terapéuticas, estas aguas volcánicas ricas en azufre, hierro y minerales esenciales revitalizarán tu cuerpo y espíritu. Déjate envolver por el vapor curativo en nuestras tinajas de ciprés, en medio de un entorno natural incomparable.",
      image: "/lovable-uploads/a12a8e24-f99f-48c6-9bc2-eea9e8df4ef5.png"
    }, {
      icon: <FlameIcon />,
      title: "Ritual de Sauna y Tinaja",
      description: "Purifica cuerpo y mente con nuestro ritual de sauna seguido de inmersión en tinaja de agua termal.",
      details: "Este ritual de contraste térmico es conocido por sus beneficios circulatorios y desintoxicantes. Comienza con 15 minutos en nuestra sauna seca construida con maderas aromáticas nativas, seguido de una breve inmersión en agua fría y finaliza con un relajante baño en nuestras tinajas de agua termal mineralizada.",
      image: "/lovable-uploads/26544819-643d-4e3f-8599-74f7f3611221.png"
    }, {
      icon: <GlassWaterIcon />,
      title: "Piscina Natural de Montaña",
      description: "Vive la experiencia única de bañarte en nuestra piscina natural alimentada con agua fresca de la montaña.",
      details: "Las aguas cristalinas y frías fortalecen tu sistema inmunitario y revitalizan tu mente. Equilibra tu cuerpo sumergiéndote en estas aguas puras y revitalizantes que nacen directamente de los deshielos cordilleranos. Ideal para recuperar energía después de un día lleno de aventuras al aire libre.",
      image: "/lovable-uploads/0aba3582-f7e0-478e-b316-3893d4cebacc.png"
    }
    ],
  },
  juegos: {
    title: "Juegos y Entretenimiento",
    description: "Disfruta de momentos de diversión y entretenimiento en un entorno único, perfecto para compartir con familia y amigos.",
    items: [
    {
      icon: <GamepadIcon />,
      title: "Juegos de Mesa Junto al Fuego",
      description: "Disfruta de nuestra selección de juegos de mesa premium en nuestra acogedora sala común.",
      details: "Nuestra colección incluye clásicos y nuevos juegos de estrategia, perfectos para noches frías. La sala cuenta con una chimenea a leña, cómodas butacas y un servicio de té, chocolate caliente y snacks disponible para complementar la experiencia.",
      image: "/lovable-uploads/8c94b429-4fba-49f4-a9e1-9d5970782bba.png"
    }, {
      icon: <DiceIcon />,
      title: "Torneo de Juegos Tradicionales Chilenos",
      description: "Participa en torneos de rayuela, trompo, emboque y otros juegos tradicionales chilenos.",
      details: "Aprende sobre el rico patrimonio cultural chileno a través de sus juegos tradicionales. Realizamos torneos semanales donde podrás competir amistosamente con otros huéspedes. Incluye instrucción básica para quienes no conocen los juegos y pequeños premios artesanales para los ganadores.",
      image: "/lovable-uploads/15e939f8-681c-4a2e-a19a-8cace70e9e38.png"
    }, {
      icon: <SparklesIcon />,
      title: "Observación de Estrellas",
      description: "Aprovecha nuestros cielos limpios para una sesión guiada de observación astronómica.",
      details: "Lejos de la contaminación lumínica, nuestro lugar ofrece condiciones ideales para la astronomía. Las sesiones incluyen telescopios profesionales, guía astronómico que te ayudará a identificar constelaciones, planetas y otros cuerpos celestes, y una selección de bebidas calientes para disfrutar bajo las estrellas.",
      image: "/lovable-uploads/daf4f24d-4485-4324-9991-3f7d52a79e0f.png"
    }, {
      icon: <FlameKindlingIcon />,
      title: "Parrilla bajo las Estrellas",
      description: "Comparte momentos inolvidables junto al fuego en nuestra zona de parrillas al aire libre.",
      details: "Una experiencia ideal para fortalecer lazos y crear recuerdos en medio de la naturaleza. Rodeado de bosques milenarios y bajo el cielo estrellado del Valle Las Trancas, prepara un asado memorable en familia o con amigos, conectando a través de los sabores y aromas de la gastronomía tradicional chilena.",
      image: "/lovable-uploads/7202eec3-bd82-4939-90a9-0a6509fa2af0.png"
    }, {
      icon: <UtensilsIcon />,
      title: "Sabores del Invernadero de Montaña",
      description: "Disfruta de una experiencia gastronómica auténticamente local, con ingredientes frescos cultivados en nuestro invernadero.",
      details: "Reserva tu menú especial y saborea la frescura auténtica en Valle Las Trancas en cada bocado. Cada plato rescata lo mejor de la tierra cordillerana, creando una experiencia culinaria saludable, sostenible y conectada profundamente con la naturaleza.",
      image: "/lovable-uploads/e28e0d4f-e1f0-43f6-afdc-6b31b64ac1d6.png"
    }
    ],
  },
};