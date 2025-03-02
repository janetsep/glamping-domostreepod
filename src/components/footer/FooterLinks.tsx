
import { useNavigate } from "react-router-dom";

interface FooterLinksProps {
  navigateTo: (path: string) => void;
}

const FooterLinks = ({ navigateTo }: FooterLinksProps) => {
  return (
    <div className="border-t border-gray-200 pt-8 pb-6">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button onClick={() => navigateTo("#")} className="text-sm text-gray-600 hover:text-cyan-500">
          Términos y Condiciones
        </button>
        <button onClick={() => navigateTo("#")} className="text-sm text-gray-600 hover:text-cyan-500">
          Política de Privacidad
        </button>
        <button onClick={() => navigateTo("#")} className="text-sm text-gray-600 hover:text-cyan-500">
          Política de Cancelación
        </button>
        <button onClick={() => navigateTo("#")} className="text-sm text-gray-600 hover:text-cyan-500">
          Preguntas Frecuentes
        </button>
        <button onClick={() => navigateTo("/sobre-nosotros")} className="text-sm text-gray-600 hover:text-cyan-500">
          Sobre Nosotros
        </button>
        <button onClick={() => navigateTo("#")} className="text-sm text-gray-600 hover:text-cyan-500">
          Mapa del Sitio
        </button>
      </div>
    </div>
  );
};

export default FooterLinks;
