import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClock, FaMoon, FaSun,FaEnvelope, FaCalendar,FaUsers} from "react-icons/fa";
import { BiLogOutCircle } from 'react-icons/bi';
import "../styles/UsersHome.css";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const UsersHome = () => {

const { t, i18n } = useTranslation();
  
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


      <Navbar expand="lg" className={`px-3 ${darkMode ? "bg-dark" : "bg-light"}`} variant={darkMode ? "dark" : "light"}>
  <Container fluid className="d-flex justify-content-between align-items-center">


    <Navbar.Brand className="d-flex align-items-center gap-2 logo">
      <FaUsers /> {t('logo')}
    </Navbar.Brand>


    <Navbar.Toggle aria-controls="basic-navbar-nav" />

    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto d-flex align-items-center gap-3">


        <div className="traduction">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="lang-select"
          >
            <option value="fr">Français (FR)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

       

        <div className="user-profile d-flex align-items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${message}&background=random&size=32`}
            alt="avatar utilisateur"
          />
          <span>{message}</span>
        </div>

         <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>

        <BiLogOutCircle onClick={handleLogout} className="logout-btn" />
        
      </Nav>
    </Navbar.Collapse>

  </Container>
    </Navbar>


    
      <main className="users-main">
        <div className="welcome-section">
          <h2>{t('welcome')}, <span>{message}</span> </h2>
          <p>{t('overview')}</p>
        </div>

       
        <div className="stats-grid">

  <div className="stat-card">
  <div className="stat-icon"><FaEnvelope /></div>
  <div className="stat-content">
    <h3>{t('notifications')}</h3>
    <p>{t('unread')}</p>
  </div>
</div>


          <div className="stat-card">
  <div className="stat-icon">
    <FaCalendar />
  </div>
  <div className="stat-content">
    <h3>{t('created_date')}</h3>
    <p>{CreatedDate}</p>
  </div>
</div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{t('last_connection')}</h3>
              <p>{lastConnection}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UsersHome;
