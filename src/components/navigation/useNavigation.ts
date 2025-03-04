
import { useNavigate, useLocation } from "react-router-dom";
import { packageData } from "../packages/packageData";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the first package ID from packageData for the main reservation button
  const defaultUnitId = packageData && packageData.length > 0 ? packageData[0].id : "48a7a330-ebae-4e79-8f53-31a84ac900d9";

  const handleReserveClick = () => {
    navigate(`/unit/${defaultUnitId}`);
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
