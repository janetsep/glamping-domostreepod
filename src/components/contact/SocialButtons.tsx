
import { MessageSquare, Share2 } from "lucide-react";
import { useEffect } from "react";

const SocialButtons = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.elfsight && typeof window.elfsight.initialize === 'function') {
        // This is a safeguard in case the script has initialization functions
      }
    };
  }, []);

  return (
    <>
      {/* Elfsight Social Media Button */}
      <button 
        className="fixed bottom-34 right-6 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 transition-colors z-50"
        aria-label="Ver redes sociales"
        onClick={() => {
          const elfsightElement = document.querySelector('.elfsight-app-997d64da-bc31-4252-aaea-4e030bfce7a5');
          if (elfsightElement) {
            elfsightElement.classList.toggle('active');
            if (window.elfsight && typeof window.elfsight.initialize === 'function') {
              window.elfsight.initialize();
            }
          }
        }}
      >
        <Share2 className="h-6 w-6" />
      </button>
      
      {/* Elfsight Social Feed Widget - initially hidden */}
      <div className="fixed bottom-48 right-6 z-50 hidden elfsight-app-997d64da-bc31-4252-aaea-4e030bfce7a5" data-elfsight-app-lazy></div>
      
      {/* Botón flotante de WhatsApp */}
      <a 
        href="https://wa.me/56912345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </>
  );
};

export default SocialButtons;
