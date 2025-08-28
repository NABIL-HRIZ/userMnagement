import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componants/Login';
import Register from './componants/Register';
import UsersHome from './componants/UsersHome';
import Dashboard from './componants/Dashboard';
import CircularText from './componants/CircularText';
import './i18n';
const App = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("introShown");

    if (!alreadyShown) {
      setShowIntro(true);

      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("introShown", "true");
      },4000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (showIntro) {
    return (
      <div className="intro-screen">
        <CircularText
          text="USERS*MANAGEMENT*"
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usersHome" element={<UsersHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
