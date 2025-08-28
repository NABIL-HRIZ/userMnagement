import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClock, FaMoon, FaSun,FaEnvelope, FaCalendar,FaUsers} from "react-icons/fa";

import { BiLogOutCircle } from 'react-icons/bi';
import "../styles/UsersHome.css";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

const UsersHome = () => {
  const navigate=useNavigate()

  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [lastConnection, setLastConnection] = useState("");
  const [CreatedDate,setCreatedDate]=useState("")

 

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

        const start=response.data.created_at
        setCreatedDate(start)

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
        <div className="logo">
          <h3>User <FaUsers />  Infos</h3>
        </div>
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
  <div className="stat-icon"><FaEnvelope /></div>
  <div className="stat-content">
    <h3>Notifications</h3>
    <p>5 non lues</p>
  </div>
</div>


          <div className="stat-card">
  <div className="stat-icon">
    <FaCalendar />
  </div>
  <div className="stat-content">
    <h3>Date de création</h3>
    <p>{CreatedDate}</p>
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

        </div>
      </main>
    </div>
  );
};

export default UsersHome;
