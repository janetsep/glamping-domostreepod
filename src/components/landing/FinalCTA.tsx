import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const FinalCTA = () => {
  const navigate = useNavigate();
  return <section id="contacto" className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            ¿Listo para tu Experiencia TreePod?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Tu aventura en la naturaleza está a solo un clic de distancia
          </p>

          {/* Main CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">
              Reserva Directa - Sin Comisiones
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Mejor precio garantizado al reservar directamente con nosotros
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold" onClick={() => navigate('/unit/1')}>
              Reservar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Llámanos</h4>
              <p className="opacity-90">+56 9 8765 4321</p>
              <p className="text-sm opacity-75">Lun-Dom 8:00-22:00</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">WhatsApp</h4>
              <p className="opacity-90">Respuesta inmediata</p>
              <p className="text-sm opacity-75">24/7 disponible</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Email</h4>
              <p className="opacity-90">reservas@treepod.cl</p>
              <p className="text-sm opacity-75">Respuesta en 2 horas</p>
            </div>
          </div>

          {/* Bottom Message */}
          
        </div>
      </div>
    </section>;
};