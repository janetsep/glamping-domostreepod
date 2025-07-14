
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  XCircle, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Shield
} from "lucide-react";

interface UnitPoliciesProps {
  policies?: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    rules: string[];
    important: string[];
  };
}

export const UnitPolicies = ({ 
  policies = {
    checkIn: "16:00",
    checkOut: "12:00",
    cancellation: "Cancelación flexible hasta 24 horas antes",
    rules: [
      "No se permiten mascotas",
      "No fumar en el interior",
      "Respetar el entorno natural",
      "Máximo 4 huéspedes por domo"
    ],
    important: [
      "Traer ropa abrigada para la noche",
      "Calzado cómodo para caminar",
      "Respetar la fauna local"
    ]
  }
}: UnitPoliciesProps) => {
  const policyItems = [
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: "Horarios",
      content: [
        `Check-in: ${policies.checkIn}`,
        `Check-out: ${policies.checkOut}`
      ]
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      title: "Política de cancelación",
      content: [policies.cancellation]
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: "Normas de la propiedad",
      content: policies.rules
    },
    {
      icon: <Info className="w-5 h-5 text-amber-600" />,
      title: "Información importante",
      content: policies.important
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Políticas y normas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {policyItems.map((policy, index) => (
          <div key={index}>
            <div className="flex items-center gap-3 mb-3">
              {policy.icon}
              <h4 className="font-medium text-gray-900">{policy.title}</h4>
            </div>
            <ul className="space-y-2 ml-8">
              {policy.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {index < policyItems.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">¿Tienes preguntas?</h4>
              <p className="text-sm text-blue-800">
                Contáctanos por WhatsApp si necesitas información adicional sobre nuestras políticas o servicios.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
