import { useEffect } from "react";
import ContactInfo from "./contact/ContactInfo";
import FAQSection from "./contact/FAQSection";
import SocialButtons from "./contact/SocialButtons";
const SimplifiedContact = () => {
  const faqs = [{
    question: "¿Qué incluye la estadía?",
    answer: "Nuestras estadías incluyen alojamiento en domos geodésicos completamente equipados con todas las comodidades necesarias y acceso exclusivo a senderos privados en el bosque nativo. Servicios adicionales disponibles según el paquete seleccionado."
  }, {
    question: "¿Cómo llegar?",
    answer: "Estamos ubicados en el Valle Las Trancas, a 1.5 horas de la ciudad de Chillán. Enviamos instrucciones detalladas y ubicación GPS al confirmar tu reserva."
  }, {
    question: "¿Cuál es la política de cancelación?",
    answer: "Las cancelaciones realizadas con más de 7 días de anticipación reciben un reembolso del 85%. Con menos de 7 días, se reembolsa el 50%. Con menos de 48 horas no hay reembolso. En todos los casos de cancelación puedes reprogramar tu estadía (máximo 1 año)."
  }];
  return <section id="contact" className="py-20 bg-white">
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Contáctanos
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">Estamos aquí para responder tus preguntas y ayudarte a planificar tu viaje</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Información de contacto */}
          <ContactInfo />
          
          {/* FAQs */}
          <FAQSection faqs={faqs} />
        </div>
      </div>
      
      <SocialButtons />
    </section>;
};
export default SimplifiedContact;