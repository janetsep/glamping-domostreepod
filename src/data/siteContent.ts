/**
 * Este archivo centraliza todo el contenido textual del sitio
 * para permitir su edición fácil a través de las herramientas visuales
 */

// Textos del encabezado y hero
export const heroContent = {
  title: "Experimenta la magia de dormir entre los árboles",
  subtitle: "Domos geodésicos en pleno corazón del Valle Las Trancas, Chile",
  ctaButton: "Reservar ahora",
  scrollButton: "Explorar"
};

// Textos para la sección de beneficios
export const benefitsContent = {
  title: "Una experiencia única en la naturaleza",
  subtitle: "Descubre por qué Domos TreePod es el destino perfecto para tu próxima escapada",
  cards: [
    {
      title: "Conexión con la naturaleza",
      description: "Ubicados en un bosque nativo, nuestros domos te permiten despertar con el sonido de las aves y dormir bajo un cielo estrellado."
    },
    {
      title: "Comodidad y lujo",
      description: "Cada domo está equipado con todas las comodidades modernas, incluyendo WiFi Starlink, calefacción eficiente y camas premium."
    },
    {
      title: "Experiencias únicas",
      description: "Disfruta de baños mineralizados en tinajas de ciprés, desayunos con productos locales y actividades en plena naturaleza."
    },
    {
      title: "Sostenibilidad",
      description: "Operamos con energía solar, utilizamos productos biodegradables y apoyamos la conservación del bosque nativo."
    }
  ]
};

// Textos para la sección de testimonios
export const testimonialsContent = {
  title: "Lo que dicen nuestros huéspedes",
  subtitle: "Experiencias reales de quienes han disfrutado de la magia de TreePod",
  testimonials: [
    {
      name: "Carolina Méndez",
      location: "Santiago, Chile",
      quote: "Una experiencia mágica. Los domos son hermosos, cómodos y la atención del equipo es excepcional. Las tinajas de agua mineralizada son imperdibles."
    },
    {
      name: "Martín Soto",
      location: "Buenos Aires, Argentina",
      quote: "Vinimos buscando desconexión y encontramos mucho más. La ubicación es perfecta, entre el bosque pero con todas las comodidades."
    },
    {
      name: "Ana García",
      location: "Concepción, Chile",
      quote: "El lugar ideal para escapar de la rutina. Los detalles en cada domo son increíbles y las vistas al bosque inigualables."
    }
  ]
};

// Textos para la sección de ubicación
export const locationContent = {
  title: "Ubicados en el corazón del Valle Las Trancas",
  subtitle: "A pocos kilómetros de las mejores atracciones naturales de la región",
  description: "Nuestros domos están estratégicamente ubicados en el Valle Las Trancas, región de Ñuble, Chile. Rodeados de bosque nativo y con fácil acceso a termas, senderos de montaña y atractivos naturales.",
  directionButton: "Cómo llegar"
};

// Textos para la sección de paquetes
export const packagesContent = {
  title: "Nuestros Domos y Paquetes",
  subtitle: "Encuentra la experiencia perfecta para tu próxima escapada",
  viewDetailsButton: "Ver detalles",
  reserveButton: "Reservar"
};

// Textos para la sección de galería
export const galleryContent = {
  title: "Galería de imágenes",
  subtitle: "Explora nuestros espacios y vive la experiencia TreePod",
  viewMoreButton: "Ver más fotos"
};

// Textos para el formulario de contacto
export const contactContent = {
  title: "¿Listo para vivir la experiencia TreePod?",
  subtitle: "Estamos aquí para resolver todas tus dudas",
  nameLabel: "Nombre",
  emailLabel: "Correo electrónico",
  messageLabel: "Mensaje",
  sendButton: "Enviar mensaje",
  contactInfo: {
    title: "Información de contacto",
    address: "Valle Las Trancas, Región de Ñuble, Chile",
    phone: "+56 9 8464 3307",
    email: "info@domostreepod.cl"
  }
};

// Textos para la sección de experiencias
export const experiencesContent = {
  title: "Experiencias TreePod",
  subtitle: "Actividades y servicios que hacen única tu estadía",
  categories: {
    recorridos: "Recorridos y Paisajes",
    historias: "Historias y Cultura Local",
    bosque: "Baño de Bosque",
    juegos: "Juegos y Entretenimiento"
  }
};

// Textos para la sección de reservas
export const reservationContent = {
  title: "Reserva tu experiencia",
  selectDatesLabel: "Selecciona las fechas",
  guestsLabel: "Huéspedes",
  adultsLabel: "Adultos",
  childrenLabel: "Niños",
  activitiesLabel: "Actividades disponibles",
  packagesLabel: "Paquetes temáticos",
  checkAvailabilityButton: "Verificar disponibilidad",
  quoteButton: "Cotizar estadía",
  confirmButton: "Confirmar reserva",
  newQuoteButton: "Nueva cotización",
  summaryTitle: "Resumen de tu estadía",
  totalLabel: "Total",
  policyLabel: "Política de reserva",
  policyText: "Pago total por adelantado para confirmar tu reserva. Check-in desde las 15:00, check-out hasta las 12:00.",
  domosDistribution: "Distribución de domos"
};

// Textos para la sección de políticas
export const policiesContent = {
  title: "Información Importante",
  checkInLabel: "Check-in",
  checkInTime: "15:00 hrs",
  checkOutLabel: "Check-out",
  checkOutTime: "12:00 hrs",
  petsLabel: "Mascotas",
  petsPolicy: "Máximo 2 mascotas pequeñas por domo",
  smokingLabel: "Fumar",
  smokingPolicy: "Permitido solo en áreas designadas",
  wifiLabel: "Internet",
  wifiInfo: "WiFi Starlink en todo el complejo",
  parkingLabel: "Estacionamiento",
  parkingInfo: "Estacionamiento gratuito en la propiedad"
};

// Textos para el pie de página
export const footerContent = {
  aboutTitle: "Sobre nosotros",
  aboutText: "Experimenta la magia de dormir entre los árboles en nuestros exclusivos domos suspendidos en pleno corazón de Valle Las Trancas, Chile.",
  linksTitle: "Enlaces rápidos",
  links: [
    { text: "Inicio", path: "/" },
    { text: "Domos", path: "/#packages" },
    { text: "Experiencias", path: "/experiences" },
    { text: "Sobre nosotros", path: "/about" },
    { text: "Contacto", path: "/contact" }
  ],
  contactTitle: "Contacto",
  address: "Camino a la Montaña km 5, Valle Las Trancas, Chile",
  phone: "+56 9 8464 3307",
  email: "info@domostreepod.cl",
  copyrightText: "© 2025 Domos Treepod. Todos los derechos reservados.",
  backToTopButton: "Volver arriba"
};

// Textos para la sección de experiencia en detalle de unidad
export const unitExperienceContent = {
  title: "Tu experiencia TreePod",
  stayIncludes: "¿Qué incluye tu estadía?",
  stayIncludesText: "Acceso a senderos exclusivos, desayuno con productos locales, tinajas de agua mineralizada proveniente de las termas de Chillán (previa reserva y pago extra) y la tranquilidad absoluta del bosque nativo en el Valle Las Trancas."
};

// Textos para la página de unidad en detalle
export const unitDetailContent = {
  backButton: "Volver a Domos",
  reserveButton: "Reservar ahora",
  featuresTitle: "Comodidades",
  policiesTitle: "Información Importante",
  experienceTitle: "Tu experiencia",
  reservationTitle: "Reserva tu estadía",
  availabilityCalendarTitle: "Calendario de disponibilidad",
  calendarSelectDateText: "Selecciona una fecha para comenzar",
  priceStartsAtText: "desde",
};

// Textos para la página de éxito de reserva
export const reservationSuccessContent = {
  title: "¡Reserva Confirmada!",
  subtitle: "Tu pago ha sido procesado con éxito",
  detailsTitle: "Detalles de tu reserva",
  clientInfoTitle: "Información de contacto",
  clientInfoText: "Para completar tu reserva, por favor ingresa tus datos de contacto:",
  nameLabel: "Nombre completo",
  emailLabel: "Correo electrónico",
  phoneLabel: "Teléfono",
  saveButton: "Guardar información",
  successMessage: "¡Gracias por completar tu información! Hemos enviado los detalles de tu reserva a tu correo electrónico.",
  newReservationButton: "Realizar otra reserva"
};

// Textos para la página de "Sobre nosotros"
export const aboutUsContent = {
  heroTitle: "Nuestra Historia y Compromiso",
  heroSubtitle: "Conoce a las personas detrás de Domos Treepod y nuestra pasión por la naturaleza y la sustentabilidad.",
  storyTitle: "Nuestra Historia",
  storyText: "Domos Treepod nació en 2019 de la visión de Janet Mariel Sepúlveda Correa y Jaime Antonio Echeverría Migryk, dos aventureros apasionados por la naturaleza y el turismo sostenible. Después de años trabajando en el sector turístico convencional, decidieron crear algo diferente: una experiencia de hospedaje que conectara profundamente a las personas con la naturaleza sin renunciar a la comodidad.",
  storyText2: "El Valle Las Trancas, con su impresionante bosque nativo y sus paisajes montañosos, fue el lugar perfecto para materializar este sueño. Inspirados por la arquitectura geodésica y sus beneficios ecológicos, decidieron construir domos que se integraran armónicamente con el entorno natural.",
  storyText3: "Hoy, Domos Treepod es un referente en glamping sustentable en Chile, ofreciendo una experiencia única que combina lujo, confort y respeto por el medio ambiente.",
  missionTitle: "Nuestra Misión y Valores",
  missionSubtitle: "En Domos Treepod creemos en un turismo que respete y proteja los entornos naturales mientras crea experiencias memorables.",
  valueTitle1: "Pasión por la Naturaleza",
  valueText1: "Nuestro amor por los espacios naturales nos impulsa a protegerlos y a invitar a otros a apreciar su belleza y valor.",
  valueTitle2: "Comunidad Local",
  valueText2: "Trabajamos estrechamente con las comunidades locales, generando empleo y apoyando a productores y artesanos de la zona.",
  valueTitle3: "Innovación Sostenible",
  valueText3: "Buscamos constantemente nuevas formas de reducir nuestro impacto ambiental sin comprometer la calidad de la experiencia.",
  sustainabilityTitle: "Nuestro Compromiso con la Sostenibilidad",
  sustainabilitySubtitle: "La sostenibilidad no es solo una palabra para nosotros, es el núcleo de nuestra operación diaria."
};

// Textos para la página de contacto
export const contactPageContent = {
  title: "Contáctanos",
  subtitle: "Estamos aquí para ayudarte con cualquier consulta o reserva",
  formTitle: "Envíanos un mensaje",
  nameLabel: "Nombre completo",
  emailLabel: "Correo electrónico",
  messageLabel: "Mensaje",
  sendButton: "Enviar mensaje",
  contactInfoTitle: "¿Cómo podemos ayudarte?",
  whatsappLabel: "WhatsApp",
  whatsappText: "Respuesta rápida de lunes a domingo",
  phoneLabel: "Teléfono",
  phoneText: "Atención de 9:00 a 18:00 hrs",
  emailLabel: "Correo electrónico",
  emailText: "Te respondemos en máximo 24 horas",
  scheduleTitle: "Horario de atención",
  scheduleText: "Nuestro equipo está disponible para atenderte de lunes a domingo. Para consultas urgentes, te recomendamos contactarnos vía WhatsApp.",
  faqTitle: "Preguntas frecuentes",
  notesTitle: "Nota importante",
  notesText: "Para garantizar la mejor experiencia posible, te recomendamos reservar con al menos 2 semanas de anticipación, especialmente para fines de semana y temporada alta."
};

// Textos para la página 404
export const notFoundContent = {
  title: "404",
  subtitle: "Página no encontrada",
  message: "Lo sentimos, la página que buscas no existe o ha sido movida.",
  unitDetailMessage: "Si estás intentando ver detalles de una unidad, asegúrate de que el ID sea válido. Los IDs deben ser identificadores únicos proporcionados por el sistema.",
  homeButton: "Ir al inicio",
  backButton: "Volver atrás"
};
