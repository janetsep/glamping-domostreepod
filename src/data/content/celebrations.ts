
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
    },
    {
      id: "fiestas-patrias",
      name: "Fiestas Patrias",
      description: "Celebra las Fiestas Patrias con tradición chilena en medio de la naturaleza. Disfruta de empanadas, chicha y toda la alegría patria en un ambiente único rodeado del bosque nativo.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "navidad",
      name: "Navidad",
      description: "Vive una Navidad mágica en la naturaleza. Celebra esta fecha especial con tu familia en un entorno único donde la paz del bosque se combina con la alegría navideña.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "ano-nuevo",
      name: "Año Nuevo",
      description: "Recibe el Año Nuevo de manera especial en medio de la naturaleza. Una celebración íntima y memorable bajo las estrellas del bosque nativo para comenzar el año con renovadas energías.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    }
  ]
};

// Función para obtener una celebración por su ID
export const getCelebrationById = (id: string) => {
  return celebrationsContent.celebrations.find(celebration => celebration.id === id);
};

// Datos detallados para la página de Mujeres al Descanso y Relax
export const womenRelaxDetailContent = {
  title: "Mujeres al Descanso y Relax",
  subtitle: "Un tiempo para ti en medio del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una experiencia diseñada especialmente para mujeres que buscan un respiro en la naturaleza, compartiendo momentos especiales entre amigas, madre-hija, hermanas o simplemente tiempo personal. Este paquete ofrece la oportunidad perfecta para desconectar del estrés diario y reconectar con la naturaleza en un entorno seguro y revitalizante. Ideal para celebraciones especiales, retiros de bienestar o simplemente para disfrutar de un merecido descanso en compañía de las personas importantes en tu vida.",
      image: "/lovable-uploads/ec4a0c77-c6b5-4ec7-a6ab-f2ef933494c3.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Mujeres al Descanso y Relax** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $520.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Todas las comidas + snacks con productos del invernadero",
        "• Espumante de bienvenida + jugos + infusiones",
        "• Acceso a piscina de agua mineralizada",
        "• 1 hora de tinajas de ciprés incluida",
        "• Terraza con mobiliario para charlar al aire libre",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Cena especial: $25.000 por persona",
        "• Kit de picnic: $15.000 por grupo",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    }
  ]
};

// Datos detallados para la página de Cumpleaños
export const birthdayDetailContent = {
  title: "Cumpleaños en la Naturaleza",
  subtitle: "Celebra tu día especial rodeado del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una celebración diferente en medio de la naturaleza, perfecta para festejar tu cumpleaños con familia, amigos o en pareja en un entorno único y privado. Este paquete está diseñado para crear momentos inolvidables en tu día especial, combinando la tranquilidad del bosque nativo con todas las comodidades necesarias para una celebración perfecta. Incluye decoración especial, una torta artesanal y todo lo necesario para que tu cumpleaños sea una experiencia memorable rodeado de naturaleza.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Cumpleaños en la Naturaleza** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $580.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Decoración especial de cumpleaños",
        "• Torta artesanal + espumante para brindar",
        "• Todas las comidas + picoteo festivo con productos del invernadero",
        "• Acceso a piscina de agua mineralizada",
        "• 1 hora de tinajas de ciprés incluida",
        "• Terraza con mobiliario para celebrar",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Decoración temática especial: $20.000",
        "• Cena gourmet: $35.000 por persona",
        "• Kit de picnic: $15.000 por grupo",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    }
  ]
};

// Datos detallados para la página de Fiesta Familiar
export const familyPartyDetailContent = {
  title: "Fiesta Familiar en la Naturaleza",
  subtitle: "Celebra en familia rodeados del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una experiencia diseñada para reunir a toda la familia en un entorno natural donde grandes y pequeños pueden disfrutar de actividades al aire libre, comidas compartidas y momentos inolvidables bajo las estrellas. Este paquete familiar incluye todo lo necesario para una celebración perfecta: desde la parrilla para el asado familiar hasta el fogón nocturno para compartir historias. Ideal para cumpleaños familiares, reuniones, celebraciones especiales o simplemente para pasar tiempo de calidad en familia rodeados de la tranquilidad del bosque nativo.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Fiesta Familiar en la Naturaleza** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $550.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Decoración festiva familiar",
        "• Parrilla completa para asado + fogón nocturno",
        "• Todas las comidas + picoteo familiar con productos del invernadero",
        "• Bebidas para toda la familia (jugos + opciones adultos)",
        "• Acceso a piscina de agua mineralizada",
        "• 1 hora de tinajas de ciprés incluida",
        "• Terraza amplia con mobiliario para grupos",
        "• Leña incluida para fogón",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Decoración temática especial: $30.000",
        "• Carnes premium para el asado: $35.000 por grupo",
        "• Kit de juegos familiares: $20.000 por grupo",
        "• Leña extra para fogón: $8.000",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    }
  ]
};

// Datos detallados para la página de Aniversarios
export const anniversaryDetailContent = {
  title: "Aniversarios Románticos",
  subtitle: "Celebra el amor rodeados del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una celebración romántica en medio de la naturaleza, perfecta para conmemorar aniversarios de matrimonio, noviazgo o cualquier fecha especial en pareja en un entorno íntimo y privado. Este paquete está diseñado especialmente para parejas que buscan reconectar y celebrar su amor en un ambiente único, con detalles románticos cuidadosamente preparados. Incluye decoración especial, cena a la luz de las velas, masajes en pareja y todo lo necesario para crear recuerdos inolvidables en su fecha especial.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Aniversario Romántico** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $650.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Decoración romántica completa",
        "• Cena romántica a la luz de las velas",
        "• Todas las comidas gourmet con productos del invernadero",
        "• Espumante premium + chocolates",
        "• Acceso a piscina de agua mineralizada",
        "• 2 horas de tinajas de ciprés incluidas",
        "• Masaje relajante en pareja (30 min)",
        "• Terraza privada decorada",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Masaje completo en pareja (60 min): $80.000",
        "• Cena gourmet de 5 tiempos: $60.000 por pareja",
        "• Decoración premium con globos y flores: $40.000",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    }
  ]
};

// Datos detallados para la página de Fiestas Patrias
export const fiestasPatriasDetailContent = {
  title: "Fiestas Patrias en la Naturaleza",
  subtitle: "Celebra la tradición chilena rodeado del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una celebración patria única en medio de la naturaleza, perfecta para disfrutar de las tradiciones chilenas en un entorno especial rodeado del bosque nativo. Este paquete está diseñado para vivir las Fiestas Patrias de manera diferente, combinando la alegría de nuestras tradiciones con la tranquilidad de la naturaleza. Incluye empanadas artesanales, chicha en rama, música folclórica y todas las comodidades necesarias para una celebración patria memorable en familia o con amigos.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Fiestas Patrias en la Naturaleza** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $570.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Decoración patria temática",
        "• Empanadas artesanales + sopaipillas + chicha en rama",
        "• Parrilla completa para asado + anticucho",
        "• Todas las comidas + picoteo patrio con productos del invernadero",
        "• Acceso a piscina de agua mineralizada",
        "• 1 hora de tinajas de ciprés incluida",
        "• Música folclórica ambiente",
        "• Terraza con mobiliario para celebrar",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Show de cueca y folclore: $80.000",
        "• Carnes premium para el asado: $40.000 por grupo",
        "• Kit de juegos criollos: $25.000 por grupo",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    }
  ]
};

// Datos detallados para la página de Navidad
export const navidadDetailContent = {
  title: "Navidad Mágica en la Naturaleza",
  subtitle: "Celebra la Navidad rodeado del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una Navidad mágica en medio de la naturaleza, perfecta para celebrar esta fecha especial con tu familia en un entorno único donde la paz del bosque se combina con la alegría navideña. Este paquete está diseñado para crear una experiencia navideña inolvidable, alejada del bullicio de la ciudad pero con toda la magia de la época. Incluye decoración navideña especial, cena navideña tradicional, intercambio de regalos bajo las estrellas y todas las comodidades para una Navidad diferente y memorable.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Navidad Mágica en la Naturaleza** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $650.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Decoración navideña completa",
        "• Cena navideña tradicional (pavo + acompañamientos)",
        "• Cola de mono + chocolate caliente + ponche navideño",
        "• Todas las comidas + dulces navideños con productos del invernadero",
        "• Acceso a piscina de agua mineralizada",
        "• 1 hora de tinajas de ciprés incluida",
        "• Villancicos ambiente + fogón navideño",
        "• Espacio decorado para intercambio de regalos",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Visita del Viejito Pascuero: $50.000",
        "• Cena navideña gourmet: $45.000 por persona",
        "• Kit de postres navideños: $30.000 por grupo",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    }
  ]
};

// Datos detallados para la página de Año Nuevo
export const anoNuevoDetailContent = {
  title: "Año Nuevo Bajo las Estrellas",
  subtitle: "Recibe el nuevo año rodeado del bosque nativo",
  
  tabs: [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué es este Paquete?",
      content: "Una celebración de Año Nuevo íntima y memorable bajo las estrellas del bosque nativo para comenzar el año con renovadas energías. Este paquete está diseñado para quienes buscan una forma especial y tranquila de recibir el nuevo año, alejados del bullicio pero con toda la emoción de la fecha. Incluye cena de gala, brindis a medianoche, fuegos artificiales privados y una experiencia única para reflexionar sobre el año que termina y dar la bienvenida al que comienza en un entorno natural extraordinario.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: [
        "**Paquete Año Nuevo Bajo las Estrellas** (2 noches)",
        "**Precio:** Domo completo hasta 4 personas por $680.000 CLP",
        "",
        "### EL PAQUETE INCLUYE:",
        "• Alojamiento en domo geodésico completo (2 noches)",
        "• Decoración de Año Nuevo elegante",
        "• Cena de gala de Año Nuevo",
        "• Espumante premium para brindis de medianoche",
        "• Fuegos artificiales privados a las 00:00",
        "• Todas las comidas gourmet con productos del invernadero",
        "• Acceso a piscina de agua mineralizada",
        "• 2 horas de tinajas de ciprés incluidas",
        "• Música ambiente + fogón de medianoche",
        "• Terraza especial para recibir el nuevo año",
        "• Estacionamiento y conexión Starlink disponible",
        "",
        "### SERVICIOS ADICIONALES OPCIONALES:",
        "• Hora extra de tinajas: $25.000",
        "• Show de fuegos artificiales extendido: $100.000",
        "• Cena de gala de 7 tiempos: $80.000 por persona",
        "• Masaje relajante de inicio de año: $60.000 por persona",
        "• Transporte desde Las Trancas: $12.000 por viaje"
      ],
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    }
  ]
};
