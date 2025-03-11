
import { MessageSquare, Phone, Mail, Share2 } from "lucide-react";
import { useEffect } from "react";

const SimplifiedContact = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.elfsight && typeof window.elfsight.initialize === 'function') {
        // This is a safeguard in case the script has initialization functions
      }
    };
  }, []);

  const faqs = [
    {
      question: "¿Qué incluye la estadía?",
      answer: "Todas las estadías incluyen alojamiento en domo geodésico completamente equipado, desayuno, acceso a senderos privados y tinaja de madera. Algunos paquetes incluyen servicios adicionales."
    },
    {
      question: "¿Cómo llegar?",
      answer: "Estamos ubicados en el Valle Las Trancas, a 1.5 horas de la ciudad de Chillán. Enviamos instrucciones detalladas y ubicación GPS al confirmar tu reserva."
    },
    {
      question: "¿Cuál es la política de cancelación?",
      answer: "Las cancelaciones realizadas con más de 7 días de anticipación reciben un reembolso del 85%. Con menos de 7 días, se reembolsa el 50%. Con menos de 48 horas no hay reembolso, pero puedes reprogramar tu estadía."
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Contáctanos
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Estamos aquí para responder tus preguntas y ayudarte a planificar tu experiencia
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Información de contacto */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6">¿Cómo podemos ayudarte?</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">WhatsApp</h4>
                  <a 
                    href="https://wa.me/56912345678" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-cyan-500 transition-colors"
                  >
                    +56 9 1234 5678
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Respuesta rápida de lunes a domingo</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Teléfono</h4>
                  <a 
                    href="tel:+56912345678" 
                    className="text-gray-600 hover:text-cyan-500 transition-colors"
                  >
                    +56 9 1234 5678
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Atención de 9:00 a 20:00 hrs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Correo electrónico</h4>
                  <a 
                    href="mailto:info@domostreepod.cl" 
                    className="text-gray-600 hover:text-cyan-500 transition-colors"
                  >
                    info@domostreepod.cl
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Te respondemos en máximo 24 horas</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-cyan-50 p-6 rounded-lg border border-cyan-100">
              <h4 className="font-semibold text-cyan-800 mb-2">Horario de atención</h4>
              <p className="text-sm text-cyan-700">
                Nuestro equipo está disponible para atenderte de lunes a domingo.
                Para consultas urgentes, te recomendamos contactarnos vía WhatsApp.
              </p>
            </div>
          </div>
          
          {/* FAQs */}
          <div>
            <h3 className="text-2xl font-display font-semibold mb-6">Preguntas frecuentes</h3>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            {/* Notas adicionales */}
            <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Nota importante</h4>
              <p className="text-sm text-green-700">
                Para garantizar la mejor experiencia posible, te recomendamos reservar con al menos 2 semanas de anticipación, 
                especialmente para fines de semana y temporada alta.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elfsight Social Media Button */}
      <button 
        className="fixed bottom-20 right-6 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 transition-colors z-50"
        aria-label="Ver redes sociales"
        onClick={() => {
          const elfsightElement = document.querySelector('.elfsight-app-997d64da-bc31-4252-aaea-4e030bfce7a5');
          if (elfsightElement) {
            elfsightElement.classList.toggle('active');
            if (window.elfsight && typeof window.elfsight.initialize === 'function') {
              window.elfsight.initialize();
            }
          }
        }}
      >
        <Share2 className="h-6 w-6" />
      </button>
      
      {/* Elfsight Social Feed Widget - initially hidden */}
      <div className="fixed bottom-32 right-6 z-50 hidden elfsight-app-997d64da-bc31-4252-aaea-4e030bfce7a5" data-elfsight-app-lazy></div>
      
      {/* Botón flotante de WhatsApp */}
      <a 
        href="https://wa.me/56912345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </section>
  );
};

export default SimplifiedContact;
