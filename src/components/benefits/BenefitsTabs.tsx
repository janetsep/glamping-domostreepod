
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CategoryContent } from "./CategoryContent";
import { ExperiencesData } from "./types";

interface BenefitsTabsProps {
  experiencesData: ExperiencesData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BenefitsTabs = ({
  experiencesData,
  activeTab,
  setActiveTab
}: BenefitsTabsProps) => {
  return <Tabs defaultValue="recorridos" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6 bg-gray-100 p-1 rounded-md">
        <TabsTrigger value="recorridos">Recorridos y Paisajes</TabsTrigger>
        <TabsTrigger value="historias">Historias y Cultura Local</TabsTrigger>
        <TabsTrigger value="bosque">Baño de Bosque</TabsTrigger>
        <TabsTrigger value="juegos">Juegos de Mesa</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recorridos" className="space-y-4">
        <CategoryContent category={experiencesData.recorridos} />
      </TabsContent>
      
      <TabsContent value="historias" className="space-y-4">
        <CategoryContent category={experiencesData.historias} />
      </TabsContent>
      
      <TabsContent value="bosque" className="space-y-4">
        <CategoryContent category={experiencesData.bosque} />
      </TabsContent>
      
      <TabsContent value="juegos" className="space-y-4">
        <CategoryContent category={experiencesData.juegos} />
      </TabsContent>
    </Tabs>;
};
