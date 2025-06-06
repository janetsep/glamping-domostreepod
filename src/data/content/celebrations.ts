
// Datos para las diferentes celebraciones y experiencias especiales
export const celebrationsContent = {
  title: "Celebraciones",
  subtitle: "Celebraciones únicas en un entorno natural incomparable",
  
  celebrations: [
    {
      id: "cumpleanos",
      name: "Cumpleaños",
      description: "Celebra tu día especial rodeado de naturaleza en un ambiente único y acogedor. Nuestros domos ofrecen el marco perfecto para un cumpleaños inolvidable con tus seres queridos.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "aniversarios",
      name: "Aniversarios",
      description: "Conmemora ese día tan especial con una escapada romántica a TreePod. Las tinajas con aguas mineralizadas y la tranquilidad del bosque crean el ambiente perfecto para celebrar el amor.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "fiesta-familiar",
      name: "Fiesta Familiar",
      description: "Reúne a toda la familia en un entorno natural donde grandes y pequeños pueden disfrutar de actividades al aire libre, comidas compartidas y momentos inolvidables bajo las estrellas.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "mujeres-relax",
      name: "Mujeres al Descanso y Relax",
      description: "Una experiencia diseñada para grupos de mujeres que buscan un momento de desconexión, bienestar y reconexión en un entorno natural seguro y revitalizante.",
      image: "/lovable-uploads/ec4a0c77-c6b5-4ec7-a6ab-f2ef933494c3.png"
    }
  ]
};

// Función para obtener una celebración por su ID
export const getCelebrationById = (id: string) => {
  return celebrationsContent.celebrations.find(celebration => celebration.id === id);
};

// Datos detallados para la página de Mujeres al Descanso y Relax
export const womenRelaxDetailContent = {
  title: "🌸 Mujeres al Descanso y Relax 🌸",
  subtitle: "Un tiempo para ti en medio del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué Incluye el Paquete?",
      content: "Diseñado especialmente para mujeres que buscan un respiro en la naturaleza, compartiendo momentos especiales entre amigas, madre-hija, hermanas o simplemente tiempo personal. Un tiempo para ti en medio del bosque nativo.",
      image: "/lovable-uploads/ec4a0c77-c6b5-4ec7-a6ab-f2ef933494c3.png"
    },
    {
      id: "alojamiento",
      name: "Alojamiento",
      title: "Alojamiento en Domos TreePod",
      content: "Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza, baño privado completo, calefacción para todas las estaciones, vista directa al bosque nativo y conexión Starlink disponible para quienes la necesiten.",
      image: "/lovable-uploads/7f6ccade-6dee-4a0c-9e1c-689a1a923b73.png"
    },
    {
      id: "experiencias",
      name: "Experiencias",
      title: "Experiencias Incluidas",
      content: "Piscina de agua fría del río Chillán con propiedades minerales, 1 hora de tinajas de ciprés con agua mineralizada incluida, picoteo gourmet con productos del invernadero, jugos naturales y smoothies frescos, espumante de bienvenida, infusiones especiales y terraza con mobiliario para charlar al aire libre bajo las estrellas.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "alimentacion",
      name: "Alimentación",
      title: "Alimentación del Invernadero",
      content: "Alimentación completa con productos frescos del invernadero propio: desayuno con productos frescos, almuerzo campestre con verduras y hierbas del huerto, cena con ingredientes locales y de temporada, y snacks saludables disponibles durante el día.",
      image: "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Mujeres al Descanso y Relax (2 noches, viernes a domingo): Domo completo hasta 4 personas por $520.000 CLP. Servicios adicionales opcionales: hora extra de tinajas $25.000, cena especial $25.000 por persona, kit de picnic $15.000 por grupo, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "incluye",
      name: "Lo que Incluye",
      title: "Lo que Incluye Cada Paquete",
      content: "Alojamiento en domo geodésico completo (2 noches), todas las comidas + snacks con productos del invernadero, espumante de bienvenida + jugos + infusiones, acceso a piscina de agua mineralizada, 1 hora de tinajas de ciprés incluida, terraza con mobiliario para charlar al aire libre, estacionamiento y conexión Starlink disponible.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    }
  ]
};

// Datos detallados para la página de Cumpleaños
export const birthdayDetailContent = {
  title: "🎂 Cumpleaños en la Naturaleza 🎂",
  subtitle: "Celebra tu día especial rodeado del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué Incluye el Paquete?",
      content: "Una celebración diferente en medio de la naturaleza, perfecta para festejar tu cumpleaños con familia, amigos o en pareja en un entorno único y privado.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "alojamiento",
      name: "Alojamiento",
      title: "Alojamiento en Domos TreePod",
      content: "Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza, baño privado completo, calefacción para todas las estaciones, vista directa al bosque nativo y conexión Starlink disponible para quienes la necesiten.",
      image: "/lovable-uploads/7f6ccade-6dee-4a0c-9e1c-689a1a923b73.png"
    },
    {
      id: "experiencias",
      name: "Experiencias",
      title: "Experiencias de Celebración Incluidas",
      content: "Piscina de agua fría del río Chillán con propiedades minerales, 1 hora de tinajas de ciprés con agua mineralizada incluida, decoración de cumpleaños en el domo y terraza, torta artesanal hecha con productos del invernadero, espumante para el brindis y picoteo festivo con productos frescos del huerto.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "alimentacion",
      name: "Alimentación",
      title: "Alimentación Completa del Invernadero",
      content: "Desayuno especial con productos frescos del invernadero propio, almuerzo de celebración con verduras y hierbas del huerto, cena festiva con ingredientes locales y de temporada, y jugos naturales y bebidas especiales durante el día.",
      image: "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png"
    },
    {
      id: "entorno",
      name: "Entorno Natural",
      title: "Entorno Natural para Celebrar",
      content: "Terraza con mobiliario para celebrar al aire libre, caminatas por el bosque nativo, observación de aves y naturaleza local, sesión de fotos en espacios naturales del glamping y noches bajo las estrellas.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Cumpleaños en la Naturaleza (2 noches, viernes a domingo): Domo completo hasta 4 personas por $580.000 CLP. Servicios adicionales opcionales: hora extra de tinajas $25.000, decoración temática especial $20.000, cena gourmet $35.000 por persona, kit de picnic $15.000 por grupo, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "incluye",
      name: "Lo que Incluye",
      title: "Lo que Incluye Cada Paquete",
      content: "Alojamiento en domo geodésico completo (2 noches), decoración especial de cumpleaños, torta artesanal + espumante para brindar, todas las comidas + picoteo festivo con productos del invernadero, acceso a piscina de agua mineralizada, 1 hora de tinajas de ciprés incluida, terraza con mobiliario para celebrar, estacionamiento y conexión Starlink disponible.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    }
  ]
};
