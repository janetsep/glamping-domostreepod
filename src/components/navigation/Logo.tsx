
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
        src="/lovable-uploads/aeac7b47-8316-4eef-b586-34cc71ffa668.png" 
        alt="DOMOS TREEPOD" 
        className={`h-12 ${isScrolled ? 'filter-none' : 'brightness-125'}`} 
      />
    </div>
  );
};

export default Logo;
