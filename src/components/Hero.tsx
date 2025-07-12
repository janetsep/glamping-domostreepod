import { useState, useEffect, useRef } from "react";
import { useNavigation } from "./navigation/useNavigation";
import ScrollArrow from "./ScrollArrow";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

// Importar las nuevas imágenes reales mejoradas
import treepodExterior from "@/assets/treepod-exterior-real.jpg";
import treepodInterior from "@/assets/treepod-interior-real.jpg";
import forestCanopy from "@/assets/forest-canopy-real.jpg";
import treepodSiteOverview from "@/assets/treepod-site-overview.jpg";

// Declaración para TypeScript
declare global {
  interface Window {
    elfsight?: {
      initialize: () => void;
    };
  }
}
const Hero = () => {
  const {
    handleReserveClick
  } = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const benefitsRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null); // Referencia a la sección hero

  // Usar las imágenes reales auténticas de TreePod
  const images = [
    {
      src: "/lovable-uploads/a12a8e24-f99f-48c6-9bc2-eea9e8df4ef5.png", // Domo al atardecer
      placeholder: "/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg"
    },
    {
      src: "/lovable-uploads/26544819-643d-4e3f-8599-74f7f3611221.png", // Domo en bosque verde
      placeholder: "/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg"
    },
    {
      src: "/lovable-uploads/0aba3582-f7e0-478e-b316-3893d4cebacc.png", // Interior acogedor
      placeholder: "/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg"
    },
    {
      src: "/lovable-uploads/7202eec3-bd82-4939-90a9-0a6509fa2af0.png", // Domo en invierno
      placeholder: "/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg"
    }
  ];

  // Optimización: Precarga de la siguiente imagen 
  useEffect(() => {
    const preloadNextImage = () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const preloadLink = document.createElement('link');
      preloadLink.href = images[nextIndex].src;
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      document.head.appendChild(preloadLink);
    };
    preloadNextImage();
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    // Optimización: Retraso en la animación para permitir cargas
    setTimeout(() => setIsLoaded(true), 300);

    // Find the benefits section for the scroll arrow
    const benefitsElement = document.getElementById("benefits");
    if (benefitsElement && benefitsRef.current !== benefitsElement) {
      benefitsRef.current = benefitsElement as HTMLElement;
    }
    return () => {
      clearInterval(interval);
      // Limpieza de elementos de precarga
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, [currentImageIndex, images.length]);

  // Efecto para parallax
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        // Ajustar la velocidad del parallax cambiando el divisor (un número menor = más rápido)
        const parallaxValue = scrollY * 0.8; 
        
        // Aplicar el desplazamiento a cada imagen de fondo
        const images = heroRef.current.querySelectorAll('.lazy-load-image-background');
        images.forEach(imgContainer => {
          (imgContainer as HTMLElement).style.transform = `translateY(${parallaxValue}px) scale(1.05)`; // Combinar con el zoom existente
        });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Dependencia vacía para que solo se ejecute una vez

  // Efecto para cargar el script de Elfsight
  useEffect(() => {
    // Check if the script is already added to prevent duplicates
    if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Manually trigger Elfsight to load widgets if their platform JS is already loaded
    if (window.elfsight) {
      window.elfsight.initialize();
    }
  }, []);
  return <section id="hero" ref={heroRef} className="h-screen relative overflow-hidden -mt-[76px]">
      {/* Background images carousel with overlay - Optimizado para lazy loading */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentImageIndex === index ? "opacity-100" : "opacity-0"}`} style={{
        visibility: Math.abs(currentImageIndex - index) <= 1 || currentImageIndex === 0 && index === images.length - 1 || currentImageIndex === images.length - 1 && index === 0 ? 'visible' : 'hidden'
      }}>
            <LazyLoadImage src={image.src} alt={`Bosque y naturaleza ${index + 1}`} effect="blur" placeholderSrc={image.placeholder} wrapperClassName="w-full h-full" className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-in-out" visibleByDefault={index === currentImageIndex} threshold={500} />
          </div>)}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center pt-[76px]">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-shadow tracking-wide leading-tight">
            Glamping Sostenible en Chile
          </h1>
          <p className="text-base md:text-lg font-body text-white/90 mb-8 text-shadow max-w-xl mx-auto leading-relaxed">Domos geodésicos con wifi Starlink y vista al bosque en la Cordillera de los Andes.</p>
          
          {/* Widget Elfsight de reseñas - Reemplaza el botón */}
          <div className="mb-6 elfsight-app-58776635-7259-470b-9077-f838d052ebab" data-elfsight-app-lazy></div>
          
          {/* ScrollArrow positioned below the button */}
          <ScrollArrow targetRef={benefitsRef} />
        </div>
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => <button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? "bg-cyan-400 w-6" : "bg-white/50 hover:bg-white/80"}`} onClick={() => setCurrentImageIndex(index)} aria-label={`Ver imagen ${index + 1}`} />)}
      </div>
    </section>;
};
export default Hero;
