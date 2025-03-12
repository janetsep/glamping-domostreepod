
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabHeader = () => {
  return (
    <TabsList className="grid grid-cols-3 mb-4">
      <TabsTrigger value="dates">Fechas y huéspedes</TabsTrigger>
      <TabsTrigger value="activities">Actividades</TabsTrigger>
      <TabsTrigger value="packages">Paquetes temáticos</TabsTrigger>
    </TabsList>
  );
};
