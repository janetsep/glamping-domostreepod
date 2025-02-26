
import { Calendar, MapPin, CreditCard } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-accent" />,
      title: "Reserva Flexible",
      description: "Sistema de reservas fácil y flexible para tu comodidad",
    },
    {
      icon: <MapPin className="w-8 h-8 text-accent" />,
      title: "Ubicación Privilegiada",
      description: "Ubicados en medio de la naturaleza con vistas increíbles",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-accent" />,
      title: "Pago Seguro",
      description: "Proceso de pago seguro a través de Webpay",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-display font-bold text-primary mb-12 text-center">
          ¿Por qué elegirnos?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg text-center animate-fadeIn"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h4 className="text-xl font-display font-bold mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
