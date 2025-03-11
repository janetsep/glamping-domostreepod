import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  return (
    <nav className="bg-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-gray-800">
          TreePod
        </Link>

        <ul className="hidden lg:flex space-x-4 items-center">
          <li className="lg:ml-4">
            <a
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </a>
          </li>
          <li className="lg:ml-4">
            <a
              href="/units"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Glamping Units
            </a>
          </li>
          <li className="lg:ml-4">
            <a 
              href="/reservations/search"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Buscar Reserva
            </a>
          </li>
          {isLoggedIn ? (
            <>
              <li className="lg:ml-4">
                <Link
                  to="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Mi Cuenta
                </Link>
              </li>
              <li>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <li>
              <Button size="sm" onClick={onLogin}>
                Login
              </Button>
            </li>
          )}
        </ul>

        {/* Mobile Menu (Example - you might want a more complex solution) */}
        <div className="lg:hidden">
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Button size="sm" onClick={onLogin}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
