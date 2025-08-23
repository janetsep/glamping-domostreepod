import { AlertTriangle, Wifi, Car, Building2 } from "lucide-react";

export const ProblemSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Estrés y Agotamiento",
      description: "La rutina diaria nos tiene agotados y necesitamos una pausa real"
    },
    {
      icon: Wifi,
      title: "Desconexión Digital",
      description: "Vivimos hiperconectados pero desconectados de lo realmente importante"
    },
    {
      icon: Car,
      title: "Falta de Tiempo",
      description: "Necesitamos escapadas que maximicen el descanso en poco tiempo"
    },
    {
      icon: Building2,
      title: "Hoteles Impersonales",
      description: "Los alojamientos tradicionales no ofrecen experiencias auténticas"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            ¿Te Sientes Identificado?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sabemos exactamente lo que necesitas porque también lo hemos vivido
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <problem.icon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-gray-600">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 font-medium">
            Es hora de cambiar esto. TreePod es tu solución.
          </p>
        </div>
      </div>
    </section>
  );
};