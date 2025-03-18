
interface Policy {
  icon: React.ReactNode;
  text: string;
}

interface UnitPoliciesProps {
  policies: Policy[];
}

export const UnitPolicies = ({ policies }: UnitPoliciesProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">Información Importante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8">
        {policies.map((policy, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-700">
            <span className="text-primary">{policy.icon}</span>
            <span>{policy.text}</span>
          </div>
        ))}
      </div>
    </>
  );
};
