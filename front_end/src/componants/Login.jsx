import React, { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email:"", password: "" });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      toast.warning("Veuillez remplir tous les champs", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", values);
      localStorage.setItem("token", response.data.token);

      toast.success("Connexion réussie !", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
        onClose: () => navigate("/usersHome")
      });

    
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Échec de la connexion", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    } 
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="brand-side">
        </div>

        <div className="form-side">
          <h2>Connexion</h2>
          <p>Entrez vos identifiants pour continuer ! </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  placeholder="Entrez votre e-mail"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                />
              </div>
            </div>

            <div className="remember-forgot">
              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Se souvenir de moi</label>
              </div>
            </div>

            <button type="submit" className="login-btn">
             Connexion
            </button>
          </form>

          <div className="signup-link">
            Pas de compte ? <Link to="/register">Inscrivez-vous maintenant</Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default Login;
