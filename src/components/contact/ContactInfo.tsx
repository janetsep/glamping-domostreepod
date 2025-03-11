
import { MessageSquare, Phone, Mail } from "lucide-react";

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;
