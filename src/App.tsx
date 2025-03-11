
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/footer';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // You would typically add authentication logic here
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // You would typically add logout logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e0f11] dark:text-white transition-colors duration-300">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
