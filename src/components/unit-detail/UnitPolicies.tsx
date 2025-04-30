
import { Clock, Ban, PawPrint, Calendar } from "lucide-react";

interface Policy {
  icon: React.ReactNode;
  text: string;
}

interface UnitPoliciesProps {
  policies?: Policy[];
}

export const UnitPolicies = ({ policies = [] }: UnitPoliciesProps) => {
  // Si no se proporcionan políticas, usamos unas predeterminadas
  const defaultPolicies: Policy[] = [
    { icon: <Clock size={18} />, text: "Check-in: 15:00, Check-out: 12:00" },
    { icon: <Ban size={18} />, text: "No se permite fumar en el interior" },
    { icon: <PawPrint size={18} />, text: "Mascotas permitidas (con cargo adicional)" },
    { icon: <Calendar size={18} />, text: "Cancelación gratuita hasta 7 días antes" },
  ];
  
  const displayPolicies = policies.length > 0 ? policies : defaultPolicies;
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">Información Importante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8">
        {displayPolicies.map((policy, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-700">
            <span className="text-primary">{policy.icon}</span>
            <span>{policy.text}</span>
          </div>
        ))}
      </div>
    </>
  );
};
