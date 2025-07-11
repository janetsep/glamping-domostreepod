
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
      content: "Diseñado especialmente para mujeres que buscan un respiro en la naturaleza, compartiendo momentos especiales entre amigas, madre-hija, hermanas o simplemente tiempo personal. Un tiempo para ti en medio del bosque nativo. Incluye: Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza, baño privado completo, calefacción para todas las estaciones, vista directa al bosque nativo, conexión Starlink disponible, piscina de agua fría del río Chillán con propiedades minerales, 1 hora de tinajas de ciprés con agua mineralizada incluida, picoteo gourmet con productos del invernadero, jugos naturales y smoothies frescos, espumante de bienvenida, infusiones especiales y terraza con mobiliario para charlar al aire libre bajo las estrellas. ALIMENTACIÓN COMPLETA: Desayuno con productos frescos del invernadero, almuerzo campestre con verduras y hierbas del huerto, cena con ingredientes locales y de temporada, snacks saludables durante el día. Todas las comidas incluyen productos orgánicos cultivados en nuestro invernadero. Opciones vegetarianas y veganas disponibles.",
      image: "/lovable-uploads/ec4a0c77-c6b5-4ec7-a6ab-f2ef933494c3.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Mujeres al Descanso y Relax (2 noches, viernes a domingo): Domo completo hasta 4 personas por $520.000 CLP. El paquete incluye alojamiento en domo geodésico completo (2 noches), todas las comidas + snacks con productos del invernadero, espumante de bienvenida + jugos + infusiones, acceso a piscina de agua mineralizada, 1 hora de tinajas de ciprés incluida, terraza con mobiliario para charlar al aire libre, estacionamiento y conexión Starlink disponible. Servicios adicionales opcionales: hora extra de tinajas $25.000, cena especial $25.000 por persona, kit de picnic $15.000 por grupo, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
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
      content: "Una celebración diferente en medio de la naturaleza, perfecta para festejar tu cumpleaños con familia, amigos o en pareja en un entorno único y privado. Incluye: Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza, baño privado completo, calefacción para todas las estaciones, vista directa al bosque nativo, conexión Starlink disponible, piscina de agua fría del río Chillán con propiedades minerales, 1 hora de tinajas de ciprés con agua mineralizada incluida, decoración de cumpleaños en el domo y terraza, torta artesanal hecha con productos del invernadero, espumante para el brindis y picoteo festivo con productos frescos del huerto. ALIMENTACIÓN COMPLETA: Desayuno especial con productos frescos del invernadero, almuerzo de celebración con verduras y hierbas del huerto, cena festiva con ingredientes locales y de temporada, torta artesanal personalizada, jugos naturales y bebidas especiales durante el día. Todas las comidas están preparadas con productos orgánicos de nuestro invernadero.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Cumpleaños en la Naturaleza (2 noches, viernes a domingo): Domo completo hasta 4 personas por $580.000 CLP. El paquete incluye alojamiento en domo geodésico completo (2 noches), decoración especial de cumpleaños, torta artesanal + espumante para brindar, todas las comidas + picoteo festivo con productos del invernadero, acceso a piscina de agua mineralizada, 1 hora de tinajas de ciprés incluida, terraza con mobiliario para celebrar, estacionamiento y conexión Starlink disponible. Servicios adicionales opcionales: hora extra de tinajas $25.000, decoración temática especial $20.000, cena gourmet $35.000 por persona, kit de picnic $15.000 por grupo, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    }
  ]
};

// Datos detallados para la página de Fiesta Familiar
export const familyPartyDetailContent = {
  title: "👨‍👩‍👧‍👦 Fiesta Familiar en la Naturaleza 👨‍👩‍👧‍👦",
  subtitle: "Celebra en familia rodeados del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué Incluye el Paquete?",
      content: [
        "🏠 **Alojamiento:** Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza",
        "🚿 **Comodidades:** Baño privado completo, calefacción para todas las estaciones",
        "🌲 **Ubicación:** Vista directa al bosque nativo con conexión Starlink disponible",
        "🏊 **Piscina:** Agua fría del río Chillán con propiedades minerales",
        "🛁 **Tinajas:** 1 hora de tinajas de ciprés con agua mineralizada incluida",
        "🎉 **Decoración:** Festiva en el domo y terraza",
        "🔥 **Parrilla:** Completa para asado familiar",
        "🥤 **Bebidas:** Jugos naturales y opciones para adultos",
        "🥗 **Picoteo:** Productos frescos del huerto",
        "🪵 **Fogón:** Nocturno con leña para compartir historias",
        "",
        "### 🍽️ ALIMENTACIÓN COMPLETA:",
        "• **Desayuno:** Productos frescos del invernadero",
        "• **Almuerzo:** Campestre con verduras y hierbas del huerto",
        "• **Asado:** Carnes y acompañamientos frescos",
        "• **Snacks:** Jugos durante el día",
        "",
        "*Todas las verduras y hierbas provienen de nuestro invernadero orgánico*"
      ],
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Fiesta Familiar en la Naturaleza (2 noches, viernes a domingo): Domo completo hasta 4 personas por $550.000 CLP. El paquete incluye alojamiento en domo geodésico completo (2 noches), decoración festiva familiar, parrilla completa para asado + fogón nocturno, todas las comidas + picoteo familiar con productos del invernadero, bebidas para toda la familia (jugos + opciones adultos), acceso a piscina de agua mineralizada, 1 hora de tinajas de ciprés incluida, terraza amplia con mobiliario para grupos, leña incluida para fogón, estacionamiento y conexión Starlink disponible. Servicios adicionales opcionales: hora extra de tinajas $25.000, decoración temática especial $30.000, carnes premium para el asado $35.000 por grupo, kit de juegos familiares $20.000 por grupo, leña extra para fogón $8.000, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    }
  ]
};

// Datos detallados para la página de Aniversarios
export const anniversaryDetailContent = {
  title: "💕 Aniversarios Románticos 💕",
  subtitle: "Celebra el amor rodeados del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué Incluye el Paquete?",
      content: "Una celebración romántica en medio de la naturaleza, perfecta para conmemorar aniversarios de matrimonio, noviazgo o cualquier fecha especial en pareja en un entorno íntimo y privado. Incluye: Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza, baño privado completo, calefacción para todas las estaciones, vista directa al bosque nativo, conexión Starlink disponible, ambiente romántico preparado especialmente, piscina de agua fría del río Chillán con propiedades minerales, 2 horas de tinajas de ciprés con agua mineralizada incluidas, decoración romántica en el domo y terraza, cena romántica a la luz de las velas, espumante premium para el brindis, pétalos de rosa y velas aromáticas, y masaje relajante en pareja (30 minutos). ALIMENTACIÓN GOURMET: Desayuno romántico servido en la terraza con productos frescos del invernadero, almuerzo ligero con productos del huerto, cena romántica de 3 tiempos con ingredientes locales gourmet, champagne y chocolates incluidos. Todas las comidas están preparadas con ingredientes orgánicos de nuestro invernadero. Menú personalizable según preferencias dietéticas.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Aniversario Romántico (2 noches, viernes a domingo): Domo completo hasta 4 personas por $650.000 CLP. El paquete incluye alojamiento en domo geodésico completo (2 noches), decoración romántica completa, cena romántica a la luz de las velas, todas las comidas gourmet con productos del invernadero, espumante premium + chocolates, acceso a piscina de agua mineralizada, 2 horas de tinajas de ciprés incluidas, masaje relajante en pareja (30 min), terraza privada decorada, estacionamiento y conexión Starlink disponible. Servicios adicionales opcionales: hora extra de tinajas $25.000, masaje completo en pareja (60 min) $80.000, cena gourmet de 5 tiempos $60.000 por pareja, decoración premium con globos y flores $40.000, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    }
  ]
};
