import { Button } from "@/components/ui/button";
import { Clock, Calendar, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UrgencySection = () => {
  const navigate = useNavigate();

  const urgencyFactors = [
    {
      icon: Calendar,
      number: "Solo 8",
      text: "domos disponibles"
    },
    {
      icon: TrendingUp,
      number: "95%",
      text: "ocupación este mes"
    },
    {
      icon: Users,
      number: "12",
      text: "reservas en las últimas 24h"
    },
    {
      icon: Clock,
      number: "48h",
      text: "promedio para agotar fechas"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Disponibilidad Limitada
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              ¡Las Fechas se Agotan Rápido!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              TreePod es una experiencia exclusiva y muy solicitada. 
              No te quedes sin tu fecha ideal.
            </p>
          </div>

          {/* Urgency Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {urgencyFactors.map((factor, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-3">
                  <factor.icon className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {factor.number}
                </div>
                <div className="text-sm text-gray-600">
                  {factor.text}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg" 
                alt="Cliente satisfecho"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "Intenté reservar la semana pasada y ya no había cupos para el fin de semana que quería. 
              Al final conseguí una fecha entre semana y fue increíble, pero aprendí que hay que reservar con tiempo."
            </blockquote>
            <cite className="text-gray-600 font-medium">María José, Santiago</cite>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/unit/1')}
            >
              Consultar Disponibilidad Ahora
            </Button>
            <p className="text-sm text-gray-600">
              Reserva ahora y asegura tu experiencia. Cancela gratis hasta 48 horas antes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};