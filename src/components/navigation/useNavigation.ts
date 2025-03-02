
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  const scrollToSection = (id: string) => {
    // Si estamos en la página principal, desplazamos a la sección
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, primero navegamos a la principal y luego al ID
      navigate(`/#${id}`);
    }
  };

  const navigateToPage = (path: string) => {
    navigate(path);
  };

  return {
    handleReserveClick,
    scrollToSection,
    navigateToPage
  };
};
