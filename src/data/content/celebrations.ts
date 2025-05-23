
// Datos para las diferentes celebraciones y experiencias especiales
export const celebrationsContent = {
  title: "Experiencias Especiales",
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
      id: "fiesta-amigos",
      name: "Fiesta con Amigos",
      description: "El lugar ideal para escapadas con amigos donde podrán disfrutar de parrillas al aire libre, tinajas compartidas y noches de estrellas en un ambiente relajado y acogedor.",
      image: "/lovable-uploads/72e3600d-5b7a-4218-82ac-b305c49e4aeb.png"
    },
    {
      id: "mujeres-relax",
      name: "Mujeres al Descanso y Relax",
      description: "Una experiencia diseñada para grupos de mujeres que buscan un momento de desconexión, bienestar y reconexión en un entorno natural seguro y revitalizante.",
      image: "/lovable-uploads/ec4a0c77-c6b5-4ec7-a6ab-f2ef933494c3.png"
    },
    {
      id: "eventos-empresa",
      name: "Eventos de Empresa",
      description: "Un espacio diferente para retiros corporativos, team buildings o celebraciones de equipo que combina la tranquilidad de la naturaleza con las comodidades necesarias.",
      image: "/lovable-uploads/113a2ea1-c91a-409e-afed-9484312a2563.png"
    }
  ]
};

// Función para obtener una celebración por su ID
export const getCelebrationById = (id: string) => {
  return celebrationsContent.celebrations.find(celebration => celebration.id === id);
};
