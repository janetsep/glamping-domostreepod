import { useRef, useEffect } from "react";

export const useSectionReferences = () => {
  const benefitsRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find the benefits section for the scroll arrow
    const benefitsElement = document.getElementById("benefits");
    if (benefitsElement && benefitsRef.current !== benefitsElement) {
      benefitsRef.current = benefitsElement as HTMLElement;
    }
  }, []);

  return {
    benefitsRef,
    heroRef
  };
};
