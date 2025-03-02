
import { useNavigation } from "./useNavigation";

interface LogoProps {
  isScrolled: boolean;
}

const Logo = ({ isScrolled }: LogoProps) => {
  const { navigateToHome } = useNavigation();

  return (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={navigateToHome}
    >
      <h1 className={`font-serif text-2xl md:text-3xl font-bold ${isScrolled ? 'text-cyan-700' : 'text-white text-shadow'}`}>
        DOMOtreepod
      </h1>
    </div>
  );
};

export default Logo;
