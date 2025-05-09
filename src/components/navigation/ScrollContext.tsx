
import { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  activeSection: 'home',
  setActiveSection: () => {},
});

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <ScrollContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);

export default ScrollContext;
