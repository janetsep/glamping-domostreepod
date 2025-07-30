
import { Calendar, MapPin, CreditCard } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-accent" />,
      title: "Reserva Eco-Flexible",
      description: "Sistema de reservas sostenible y adaptable para tu experiencia de lujo en la naturaleza",
    },
    {
      icon: <MapPin className="w-8 h-8 text-accent" />,
      title: "Ubicación Pristina",
      description: "Inmersos en naturaleza virgen con vistas panorámicas a la Cordillera de los Andes",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-accent" />,
      title: "Pago Confiable",
      description: "Transacciones seguras y eco-responsables a través de Webpay Plus",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-12 text-center">
          ¿Por qué elegir nuestra experiencia eco-luxury?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fadeIn"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h4 className="text-xl md:text-2xl font-display font-bold mb-3">{feature.title}</h4>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
