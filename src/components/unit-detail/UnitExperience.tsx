
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, 
  Coffee,
  Heart,
  Leaf
} from "lucide-react";

const experiences = [
  {
    icon: <Droplets className="w-5 h-5 text-blue-600" />,
    title: "Tinajas termales",
    description: "Aguas mineralizadas de las termas de Chillán en tinajas de ciprés (previa reserva y pago extra)"
  },
  {
    icon: <Coffee className="w-5 h-5 text-amber-600" />,
    title: "Productos frescos",
    description: "Ingredientes orgánicos de nuestro invernadero para tu experiencia culinaria (previa reserva)"
  },
  {
    icon: <Leaf className="w-5 h-5 text-green-600" />,
    title: "Sostenibilidad",
    description: "Compromiso con el medioambiente y preservación del bosque nativo"
  }
];

export const UnitExperience = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Tu experiencia en domos TreePod
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Sumérgete en la tranquilidad del Valle Las Trancas con una experiencia glamping que combina naturaleza, comodidad y sostenibilidad.
        </p>

        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0 mt-1">
                {exp.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{exp.title}</h4>
                <p className="text-sm text-gray-600">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
