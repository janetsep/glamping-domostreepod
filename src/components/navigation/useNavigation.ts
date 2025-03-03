
import { useNavigate, useLocation } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReserveClick = () => {
    navigate('/unit/0a69edfd-4f3a-40f9-a822-1b6f675043b2'); // Updated to use a valid ID from the logs
  };

  const scrollToSection = (id: string) => {
    // Check if we're on the main page
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
    // Handle navigation and ensure scroll to top
    navigate(path);
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  // Home navigation specific function
  const navigateToHome = () => {
    navigate('/');
    // Scroll to top after navigation to home
    window.scrollTo(0, 0);
  };

  return {
    handleReserveClick,
    scrollToSection,
    navigateToPage,
    navigateToHome
  };
};
