
import React from "react";
import { Droplets, Mountain, Book, Wifi } from "lucide-react";

interface CategoryIconsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CategoryIcons = ({ activeTab, setActiveTab }: CategoryIconsProps) => {
  return (
    <div className="flex justify-center items-center space-x-8 mb-10 text-center">
      <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("banos")}>
        <Droplets className={`w-8 h-8 mb-1 ${activeTab === "banos" ? "text-cyan-500" : "text-gray-500"}`} />
        <span className={`text-xs ${activeTab === "banos" ? "font-medium" : "text-gray-500"}`}>Baños de Agua Mineralizada</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("recorridos")}>
        <Mountain className={`w-8 h-8 mb-1 ${activeTab === "recorridos" ? "text-cyan-500" : "text-gray-500"}`} />
        <span className={`text-xs ${activeTab === "recorridos" ? "font-medium" : "text-gray-500"}`}>Recorridos y Paisajes</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("historias")}>
        <Book className={`w-8 h-8 mb-1 ${activeTab === "historias" ? "text-cyan-500" : "text-gray-500"}`} />
        <span className={`text-xs ${activeTab === "historias" ? "font-medium" : "text-gray-500"}`}>Historias y Cultura Local</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("comodidades")}>
        <Wifi className={`w-8 h-8 mb-1 ${activeTab === "comodidades" ? "text-cyan-500" : "text-gray-500"}`} />
        <span className={`text-xs ${activeTab === "comodidades" ? "font-medium" : "text-gray-500"}`}>Comodidades Extra</span>
      </div>
    </div>
  );
};
