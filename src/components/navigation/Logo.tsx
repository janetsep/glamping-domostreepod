import { useNavigation } from "./useNavigation";

interface LogoProps {
  isScrolled: boolean;
}

const Logo = ({
  isScrolled
}: LogoProps) => {
  const {
    navigateToHome
  } = useNavigation();
  
  return <div className="flex items-center cursor-pointer" onClick={navigateToHome}>
      <img 
        alt="DOMOS TREEPOD" 
        className="h-12 md:h-16" 
        src="/lovable-uploads/9eae4d11-6229-4086-acbc-dcb83c2d25df.png" 
      />
    </div>;
};

export default Logo;
