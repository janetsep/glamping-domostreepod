
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  Trees, 
  Droplets, 
  Star,
  Camera,
  Heart,
  Coffee
} from "lucide-react";

interface UnitExperienceProps {
  experience?: {
    title: string;
    description: string;
    highlights: string[];
  };
  experienceImages?: string[];
}

export const UnitExperience = ({ 
  experience = {
    title: "Experiencia única en TreePod",
    description: "Sumérgete en la tranquilidad del Valle Las Trancas y disfruta de una experiencia glamping inolvidable.",
    highlights: [
      "Despertar rodeado de naturaleza",
      "Aguas termales en tinajas de ciprés",
      "Productos frescos del invernadero",
      "Conexión WiFi Starlink",
      "Actividades al aire libre"
    ]
  },
  experienceImages = []
}: UnitExperienceProps) => {
  const experiences = [
    {
      icon: <Trees className="w-5 h-5 text-green-600" />,
      title: "Bosque Nativo",
      description: "Despierta rodeado de un bosque nativo de la cordillera de los Andes"
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-600" />,
      title: "Aguas Mineralizadas", 
      description: "Relájate en tinajas de ciprés con aguas termales de Chillán"
    },
    {
      icon: <Coffee className="w-5 h-5 text-amber-600" />,
      title: "Productos Frescos",
      description: "Disfruta de productos orgánicos de nuestro propio invernadero"
    },
    {
      icon: <Mountain className="w-5 h-5 text-gray-600" />,
      title: "Vista Panorámica",
      description: "Contempla las majestuosas montañas del Valle Las Trancas"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          {experience.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          {experience.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Lo que hace especial tu estadía
          </h4>
          <div className="flex flex-wrap gap-2">
            {experience.highlights.map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>

        {experienceImages.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              Galería de experiencias
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {experienceImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Experiencia ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
