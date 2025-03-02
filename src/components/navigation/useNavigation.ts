
import { useNavigate, useLocation } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  const scrollToSection = (id: string) => {
    // Check if we're on the main page (either "/" or "/index")
    const isMainPage = location.pathname === '/' || location.pathname === '/index';
    
    if (isMainPage) {
      // If on main page, scroll to section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home with hash
      navigate(`/#${id}`);
    }
  };

  const navigateToPage = (path: string) => {
    navigate(path);
  };

  // Home navigation specific function
  const navigateToHome = () => {
    navigate('/');
  };

  return {
    handleReserveClick,
    scrollToSection,
    navigateToPage,
    navigateToHome
  };
};
