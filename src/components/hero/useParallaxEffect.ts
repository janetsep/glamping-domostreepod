import { useEffect, RefObject } from "react";

export const useParallaxEffect = (heroRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        // Ajustar la velocidad del parallax cambiando el divisor (un número menor = más rápido)
        const parallaxValue = scrollY * 0.8; 
        
        // Aplicar el desplazamiento a cada imagen de fondo
        const images = heroRef.current.querySelectorAll('.lazy-load-image-background');
        images.forEach(imgContainer => {
          (imgContainer as HTMLElement).style.transform = `translateY(${parallaxValue}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroRef]);
};
