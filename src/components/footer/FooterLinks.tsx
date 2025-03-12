
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, DollarSign, ShieldCheck } from "lucide-react";

interface FooterLinksProps {
  navigateTo: (path: string) => void;
}

const FooterLinks = ({ navigateTo }: FooterLinksProps) => {
  return (
    <div className="border-t border-gray-200 pt-8 pb-6">
      {/* Payment Methods & Cancellation Policy */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm font-semibold text-gray-700 mr-3">Métodos de pago:</span>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-cyan-500" />
            <Wallet className="h-6 w-6 text-cyan-500" />
            <DollarSign className="h-6 w-6 text-cyan-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShieldCheck className="h-5 w-5 text-cyan-500" />
          <span>Cancelación gratuita hasta 7 días antes de la llegada</span>
        </div>
      </div>

      {/* Links */}
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
