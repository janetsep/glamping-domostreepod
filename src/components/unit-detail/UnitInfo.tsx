
import React from "react";
import { EditableText } from "@/components/ui/EditableText";
import { unitDetailContent } from "@/data/content";
import { getUnitDetail, getDomoImages } from "./utils/unitHelpers";
import DomoDetail from "@/components/DomoDetail";

interface UnitInfoProps {
  unitName: string;
  name: string;
  unitId: string;
  travelerType?: string;
}

export const UnitInfo = ({ unitName, name, unitId, travelerType = "default" }: UnitInfoProps) => {
  const unitDetail = getUnitDetail(unitName);
  const domoImages = getDomoImages(unitName);
  
  // Determinar el título y descripción según el tipo de viajero
  let title = "Domo TreePod";
  let description = unitDetail.description;
  
  // Personalizar contenido según el tipo de viajero
  switch(travelerType) {
    case "solo":
      title = "Para el viajero en solitario";
      description = "Un refugio perfecto para reconectar contigo mismo en medio de la naturaleza.";
      break;
    case "couple":
      title = "Para la pareja en busca de tranquilidad";
      description = "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.";
      break;
    case "family":
      title = "Para familias que buscan exclusividad total";
      description = "Espacio privado donde toda la familia podrá disfrutar de la naturaleza con total libertad.";
      break;
    case "special":
      title = "Para quienes celebran ocasiones especiales";
      description = "Un lugar único para conmemorar momentos importantes en un entorno mágico.";
      break;
    case "adventure":
      title = "Para los aventureros de montaña";
      description = "Base perfecta para explorar senderos y vivir la aventura en la cordillera.";
      break;
    case "trekking":
      title = "Para los amantes del trekking";
      description = "Punto de partida ideal para recorrer los senderos más impresionantes del valle.";
      break;
    case "photographer":
      title = "Para el fotógrafo de naturaleza";
      description = "Escenarios únicos que capturarán tu lente y tu corazón en cada momento del día.";
      break;
    case "simplicity":
      title = "Para quienes buscan simplicidad y descanso";
      description = "Un espacio minimalista donde el descanso y la tranquilidad son prioridad.";
      break;
    default:
      title = "Domo TreePod";
      description = unitDetail.description;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <DomoDetail 
        images={domoImages}
        size={unitDetail.size}
        maxGuests={4}
        description={description}
      />
      
      <div className="p-6">
        <EditableText
          tag="h1"
          text={title}
          className="text-3xl font-semibold text-primary mb-4"
        />
        
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold text-primary">
            {unitDetailContent.experienceTitle}
          </h3>
          
          <ul className="list-disc pl-5 space-y-2">
            {unitDetail.experience.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
