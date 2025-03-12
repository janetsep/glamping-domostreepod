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
      <img alt="DOMOS TREEPOD" className="" src="/lovable-uploads/a429c718-e0ce-41c4-833d-44c999dff5f3.png" />
    </div>;
};
export default Logo;