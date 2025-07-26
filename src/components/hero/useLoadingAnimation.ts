import { useState, useEffect } from "react";

export const useLoadingAnimation = (delayMs: number = 300) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Optimización: Retraso en la animación para permitir cargas
    const timer = setTimeout(() => setIsLoaded(true), delayMs);
    
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoaded;
};
