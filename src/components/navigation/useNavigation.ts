import { useNavigate, useLocation } from "react-router-dom";
import { packageData } from "../packages/packageData";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the first package ID from packageData for the main reservation button
  const defaultUnitId = packageData && packageData.length > 0 ? packageData[0].id : "48a7a330-ebae-4e79-8f53-31a84ac900d9";

  const handleReserveClick = () => {
    navigate(`/unit/${defaultUnitId}`);
    // Hacer scroll al principio de la página después de la navegación
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
    // Check if this is a hash link to a section on the homepage
    if (path.startsWith('/#')) {
      const sectionId = path.substring(2);
      
      // If already on homepage, just scroll to section
      if (location.pathname === '/' || location.pathname === '/index') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      
      // Otherwise navigate to homepage with the hash
      navigate(path);
      // We'll let the URL hash handle the scroll
      return;
    }
    
    // Regular page navigation
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
