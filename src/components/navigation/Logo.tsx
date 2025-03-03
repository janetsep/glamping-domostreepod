
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
      <img 
        src="/lovable-uploads/badf4425-7a82-4330-9850-9dde76bc21eb.png" 
        alt="DOMOtreepod" 
        className={`h-12 ${isScrolled ? 'filter-none' : 'brightness-125'}`} 
      />
      <h1 className={`font-serif text-2xl md:text-3xl font-bold ml-2 ${isScrolled ? 'text-cyan-700' : 'text-white text-shadow'}`}>
        DOMOtreepod
      </h1>
    </div>
  );
};

export default Logo;
