import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "¿Qué incluye exactamente el alojamiento en los domos?",
      answer: "Cada domo incluye cama cómoda para hasta 4 personas, baño privado, electricidad, calefacción, y acceso completo a las áreas comunes. También incluimos ropa de cama, toallas y productos de aseo básicos."
    },
    {
      question: "¿Es seguro alojarme en un domo en la montaña?",
      answer: "Absolutamente. Nuestros domos están diseñados para resistir condiciones climáticas adversas y cuentan con todas las medidas de seguridad necesarias. Además, tenemos personal disponible 24/7 y sistemas de comunicación de emergencia."
    },
    {
      question: "¿Qué actividades puedo hacer durante mi estadía?",
      answer: "Ofrecemos trekking, observación de flora y fauna, fotografía de naturaleza, baños termales en tinajas de ciprés, observación de estrellas, y experiencias gastronómicas con productos frescos de nuestro invernadero. También coordinamos actividades con operadores locales."
    },
    {
      question: "¿Hay internet y señal de celular?",
      answer: "Sí, contamos con conexión Starlink de alta velocidad para que puedas compartir tus experiencias. Sin embargo, también ofrecemos la opción de 'desconexión digital' si prefieres una experiencia más inmersiva en la naturaleza."
    },
    {
      question: "¿Cuál es la política de cancelación?",
      answer: "Ofrecemos cancelación gratuita hasta 48 horas antes de tu llegada. Para cancelaciones con menos tiempo, aplicamos un cargo del 50%. En caso de condiciones climáticas extremas, la cancelación es completamente gratuita."
    },
    {
      question: "¿Cómo llego hasta los domos TreePod?",
      answer: "Estamos ubicados en Valle Las Trancas, Ñuble. Proporcionamos instrucciones detalladas de acceso una vez confirmada tu reserva. El camino es accesible para vehículos convencionales y también ofrecemos servicio de traslado desde la ciudad más cercana."
    },
    {
      question: "¿Los domos son aptos para niños?",
      answer: "¡Por supuesto! Los domos son ideales para familias. Contamos con medidas de seguridad específicas para niños y actividades diseñadas para todas las edades. También podemos proporcionar equipamiento especial para bebés si lo necesitas."
    },
    {
      question: "¿Qué debo empacar para mi estadía?",
      answer: "Recomendamos ropa cómoda en capas, calzado para trekking, protector solar, gorra, y ropa de lluvia. En nuestra 'Guía del Escape Perfecto' encontrarás una lista completa según la temporada de tu visita."
    },
    {
      question: "¿Sirven comida o debo traer la mía?",
      answer: "Ofrecemos diferentes opciones gastronómicas según el paquete que elijas. Desde desayunos incluidos hasta experiencias culinarias completas con productos de nuestro invernadero. También puedes usar nuestras parrillas portátiles si prefieres cocinar."
    },
    {
      question: "¿Puedo hacer una reserva de último minuto?",
      answer: "Sí, aunque recomendamos reservar con anticipación especialmente en temporada alta. Para reservas de último minuto, contáctanos por WhatsApp y verificaremos disponibilidad inmediata."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resolvemos las dudas más comunes para que tengas una experiencia perfecta
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-border/50 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Bottom CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ¿Tienes otra pregunta?
            </h3>
            <p className="text-muted-foreground mb-6">
              Estamos aquí para ayudarte. Contáctanos y te responderemos en menos de 1 hora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/+56912345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                WhatsApp
              </a>
              <a 
                href="mailto:hola@domostreepod.cl"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};