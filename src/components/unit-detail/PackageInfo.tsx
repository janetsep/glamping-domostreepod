interface PackageInfo {
  name: string;
  duration: string;
  price: string;
  basePrice: number;
  description: string;
}

export const getPackageInfo = (packageId: string): PackageInfo => {
  switch (packageId) {
    case 'mujeres-relax-package':
      return {
        name: 'Mujeres al Descanso y Relax',
        duration: '2 noches',
        price: '$520.000',
        basePrice: 520000,
        description: 'Paquete fijo por domo, incluye todas las comodidades para hasta 8 personas'
      };
    case 'cumpleanos-package':
      return {
        name: 'Cumpleaños en la Naturaleza',
        duration: '2 noches',
        price: '$580.000',
        basePrice: 580000,
        description: 'Paquete fijo por domo con decoración especial'
      };
    case 'aniversario-package':
      return {
        name: 'Aniversario Romántico',
        duration: '2 noches',
        price: '$650.000',
        basePrice: 650000,
        description: 'Paquete romántico fijo por domo con cena especial'
      };
    case 'familia-package':
      return {
        name: 'Fiesta Familiar en la Naturaleza',
        duration: '2 noches',
        price: '$550.000',
        basePrice: 550000,
        description: 'Paquete familiar fijo por domo con todas las comodidades'
      };
    default:
      return {
        name: 'Paquete de Celebración',
        duration: '2 noches',
        price: 'Precio fijo',
        basePrice: 520000,
        description: 'Paquete por domo'
      };
  }
};

interface PackageInfoDisplayProps {
  packageInfo: PackageInfo;
}

export const PackageInfoDisplay = ({ packageInfo }: PackageInfoDisplayProps) => {
  return (
    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
      <h3 className="font-semibold text-primary mb-2">{packageInfo.name}</h3>
      <div className="text-sm space-y-1">
        <p><span className="font-medium">Duración:</span> {packageInfo.duration}</p>
        <p><span className="font-medium">Precio:</span> {packageInfo.price} por domo</p>
        <p className="text-gray-600">{packageInfo.description}</p>
      </div>
    </div>
  );
};