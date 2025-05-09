
import { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isScrolled: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  activeSection: 'home',
  setActiveSection: () => {},
  isScrolled: false,
  setIsScrolled: () => {}
});

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <ScrollContext.Provider value={{ 
      activeSection, 
      setActiveSection,
      isScrolled,
      setIsScrolled
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);

export default ScrollContext;
