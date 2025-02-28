
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SimplifiedContact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Solicitud recibida!", {
      description: "Nos pondremos en contacto contigo pronto"
    });
    
    // Navegar a una unidad después de enviar el formulario
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Reserva Tu Experiencia
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Completa el formulario y nos pondremos en contacto contigo a la brevedad
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Formulario */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Fecha aproximada
                  </label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium mb-1">
                    Cantidad de personas
                  </label>
                  <div className="relative">
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="6"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="2"
                      required
                    />
                    <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                Solicitar Reserva
              </Button>
            </form>
            
            {/* Opciones de contacto */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold mb-4">¿Prefieres contactarnos directamente?</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="https://wa.me/56912345678" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-accent"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp: +56 9 1234 5678
                </a>
                <a 
                  href="tel:+56912345678" 
                  className="inline-flex items-center text-sm text-gray-600 hover:text-accent"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Teléfono: +56 9 1234 5678
                </a>
              </div>
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
