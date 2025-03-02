
import { Link } from "react-router-dom";

interface LogoProps {
  isScrolled: boolean;
}

const Logo = ({ isScrolled }: LogoProps) => {
  return (
    <div className="flex items-center">
      <Link to="/">
        <img 
          src="/lovable-uploads/21690294-058b-4ab7-9d01-fcf2bd94b8b3.png" 
          alt="Domos Treepod" 
          className={`h-14 transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}
        />
      </Link>
    </div>
  );
};

export default Logo;
