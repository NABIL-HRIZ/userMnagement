# User Management Project

Une application web full-stack pour l’enregistrement des utilisateurs, l’authentification et le tableau de bord d’administration.

## Project Structure

```
user_management/
├── back_end/        # Node.js + Express REST API
│   ├── index.js
│   ├── package.json
│   ├── lib/
│   │   └── db.js
│   ├── middlewares/
│   │   └── auth.js
│   └── router/
│       └── authRoutes.js
├── front_end/       # React + Vite frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── i18n.js
│   │   ├── componants/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── UsersHome.jsx
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── fr.json
│   │   └── styles/
│   │       ├── Login.css
│   │       ├── Register.css
│   │       └── UsersHome.css
│   └── public/
│       └── assets, images, etc.
```

## Features

- Enregistrement et connexion des utilisateurs (authentification JWT)
- Connexion avec Google (OAuth 2.0)
- Accès basé sur les rôles (utilisateur/admin)
- Tableau de bord administrateur : voir les utilisateurs, statistiques, supprimer des utilisateurs
- Internationalisation (i18n) avec anglais et français
- Interface réactive avec React, CSS et Bootstrap
- Notifications Toast et alertes Sweet pour le retour utilisateur

## Technologies Used

### Backend

- Node.js
- Express.js
- MySQL (with mysql2)
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- dotenv (environment variables)
- CORS
- passport-google-oauth20 (Google OAuth 2.0)

### Frontend

- React (with Vite)
- React Router
- Axios (HTTP requests)
- React Toastify (notifications)
- Sweet Alerts (notification)
- i18next (internationalization)
- CSS Modules
- Bootstrap

## Getting Started

### Prerequisites

- Node.js and npm
- MySQL server

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/NABIL-HRIZ/userMnagement.git
   ```
2. Set up the database and update `.env` in `back_end/` with your DB credentials.
3. Install backend dependencies:
   ```bash
   cd back_end
   npm install
   ```
4. Install frontend dependencies:
   ```bash
   cd ../front_end
   npm install
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
6. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Author

- NABIL HRIZ

---
