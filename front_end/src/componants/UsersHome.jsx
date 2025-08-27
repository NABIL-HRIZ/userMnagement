import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaClock, FaMoon, FaSun, FaUser, FaEnvelope, FaCalendar} from "react-icons/fa";
import { BiLogOutCircle } from 'react-icons/bi';
import "../styles/UsersHome.css";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersHome = () => {
  const navigate=useNavigate()

  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [lastConnection, setLastConnection] = useState("");

 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("lastConnection");
    navigate("/login"); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3000/auth/usersHome",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(response.data.message);

        const now = new Date().toLocaleString("fr-FR");
        setLastConnection(now);
        localStorage.setItem("lastConnection", now);

      } catch (err) {
        console.error(err);
        setMessage("Accès refusé. Veuillez vous connecter.");
      }
    };

    fetchData();

    const savedConnection = localStorage.getItem("lastConnection");
    if (savedConnection) {
      setLastConnection(savedConnection);
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);


  return (
    <div className={`users-home-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="users-header">
        <div className="header-right">
          


          
          <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div>

         
          <div className="user-profile">
            <img
              src={`https://ui-avatars.com/api/?name=${message}&background=random&size=32`}
              alt="avatar utilisateur"
            />
            <span>{message}</span>
          </div>


          <div className="logout">

<div className="logout">
  <BiLogOutCircle
    onClick={handleLogout}
    className="logout-btn"
  />
</div>
        
          </div>
        </div>
      </header>

      


      <main className="users-main">
        <div className="welcome-section">
          <h2>Bon retour, <span>{message}</span> </h2>
          <p>Voici un aperçu de votre compte aujourd'hui.</p>
        </div>

       
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaEnvelope />
            </div>
            <div className="stat-content">
              <h3>Messages</h3>
              <p>12 non lus</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUser />
            </div>
            <div className="stat-content">
              <h3>Progression du profil</h3>
              <p>60% complété</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>Dernière connexion</h3>
              <p>{lastConnection}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendar />
            </div>
            <div className="stat-content">
              <h3>Événements à venir</h3>
              <p>2 événements cette semaine</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersHome;
