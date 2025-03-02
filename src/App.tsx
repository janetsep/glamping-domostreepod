
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import Footer from "./components/footer";

const App = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
