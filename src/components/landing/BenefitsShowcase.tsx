import { Check, Wifi, Droplets, Mountain, Flame, Car, Shield } from "lucide-react";

export const BenefitsShowcase = () => {
  const benefits = [
    {
      icon: Mountain,
      title: "Ubicación Privilegiada",
      description: "Valle Las Trancas, rodeado de bosque nativo y la cordillera de los Andes"
    },
    {
      icon: Droplets,
      title: "Tinajas Termales",
      description: "Aguas mineralizadas de las termas de Chillán en tinajas de ciprés privadas"
    },
    {
      icon: Wifi,
      title: "WiFi Starlink",
      description: "Conexión de alta velocidad para mantenerte conectado cuando lo necesites"
    },
    {
      icon: Flame,
      title: "Calefacción Ecológica",
      description: "Sistema de calefacción eficiente y sostenible para tu máximo confort"
    },
    {
      icon: Car,
      title: "Fácil Acceso",
      description: "A solo 2 horas de Chillán y 4 horas de Santiago por carretera pavimentada"
    },
    {
      icon: Shield,
      title: "Experiencia Segura",
      description: "Protocolos de seguridad y limpieza para tu tranquilidad total"
    }
  ];

  const guarantees = [
    "Cancelación gratuita hasta 48 horas antes",
    "Mejor precio garantizado",
    "Atención personalizada 24/7",
    "Experiencia única o te devolvemos tu dinero"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            ¿Por Qué Elegir TreePod?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No somos solo otro alojamiento. Somos tu puerta de entrada a experiencias auténticas
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantees Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Nuestra Garantía para Ti
            </h3>
            <p className="text-gray-600">
              Estamos tan seguros de que amarás tu experiencia, que te ofrecemos estas garantías
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{guarantee}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};