
// Textos para la sección de testimonios
export const testimonialsContent = {
  title: "Lo que dicen nuestros huéspedes",
  subtitle: "Experiencias reales de quienes han disfrutado de la magia de TreePod",
  testimonials: [
    {
      name: "Carolina Méndez",
      location: "Santiago, Chile",
      rating: 5,
      quote: "Una experiencia mágica. Los domos son hermosos, cómodos y la atención del equipo es excepcional. Las tinajas de agua mineralizada son imperdibles."
    },
    {
      name: "Martín Soto", 
      location: "Buenos Aires, Argentina",
      rating: 5,
      quote: "Vinimos buscando desconexión y encontramos mucho más. La ubicación es perfecta, entre el bosque pero con todas las comodidades."
    },
    {
      name: "Ana García",
      location: "Concepción, Chile", 
      rating: 4,
      quote: "El lugar ideal para escapar de la rutina. Los detalles en cada domo son increíbles y las vistas al bosque inigualables."
    },
    {
      name: "José Luis Pérez",
      location: "Valparaíso, Chile",
      rating: 5,
      quote: "Celebramos nuestro aniversario aquí y fue perfecto. La experiencia romántica superó todas nuestras expectativas."
    },
    {
      name: "María González",
      location: "Temuco, Chile",
      rating: 5,
      quote: "Vinimos con amigas para el paquete de relajación y fue exactamente lo que necesitábamos. Un ambiente increíble para desconectar."
    },
    {
      name: "Carlos Rivera",
      location: "La Serena, Chile", 
      rating: 4,
      quote: "Excelente lugar para venir en familia. Los niños se divirtieron mucho y nosotros pudimos relajarnos. Muy recomendable."
    }
  ]
};

// Función para calcular la puntuación promedio real
export const getAverageRating = () => {
  const ratings = testimonialsContent.testimonials.map(testimonial => testimonial.rating);
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  const average = sum / ratings.length;
  return Math.round(average * 10) / 10; // Redondea a 1 decimal
};
