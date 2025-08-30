import React, { useState } from 'react';
import '../styles/register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Beams from "./Beams";

const Register = () => {

    const navigate=useNavigate()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    Confirmpassword: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!values.name || !values.email || !values.password ) {
          toast.warning("Veuillez remplir tous les champs", {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
            transition: Bounce,
          });
          return;
        }
    try {
      const response = await axios.post('http://localhost:3000/auth/register', values);
      toast.success('Inscription réussie !', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
         onClose: () => navigate("/login")
      });

    } catch (err) {
      toast.error('Erreur lors de l’inscription', {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
        transition: Bounce
      });
      console.log(err);
    }
  };

  return (
    <section id='register-section'>
            <div className="beams-bg" aria-hidden="true">
  <Beams
    beamWidth={2}
    beamHeight={15}
    beamNumber={12}
    lightColor="#ffffff"
    speed={2}
    noiseIntensity={1.75}
    scale={0.2}
    rotation={0}
  />
</div>
      <div id="register-container">
        
        <div id="form-side">
          <h2>Inscription</h2>
          <p>Créez votre compte pour commencer</p>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div id="form-group">
                <label htmlFor="name">Nom complet</label>
                <div id="input-with-icon">
                  <i className="fa-solid fa-user"></i>
                  <input
                    type="text"
                    id="name"
                    name='name'
                    value={values.name}
                    placeholder="Entrez votre Nom Complet"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div id="form-group">
                <label htmlFor="email">Adresse e-mail</label>
                <div id="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name='email'
                    value={values.email}
                    placeholder="Entrez votre e-mail"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div id="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div id="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    name='password'
                    value={values.password}
                    placeholder="Entrez votre mot de passe"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div id="form-group">
                <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
                <div id="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name='Confirmpassword'
                    value={values.Confirmpassword}
                    placeholder="Confirmez votre mot de passe"
                    onChange={handleChange}
                  />
                </div>
              </div>
             
            </div>
           <button id='register-btn' className='button'> S'incrire
  <span></span>
</button>
          </form>
          <div id="signup-link">
            Déjà un compte ? <Link to='/login'>Connectez-vous</Link>
          </div>
        </div>
      </div>

      
      <ToastContainer />
    </section>
  );
};

export default Register;
