import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.jpeg'
import { 
  FaUsers, 
  FaUserShield, 
  FaSearch, 
  FaTrash
} from 'react-icons/fa';
import { BiLogOutCircle } from 'react-icons/bi';

import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

  import swal from 'sweetalert'; 

const Dashboard = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("lastConnection");
    navigate("/login"); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userResponse = await axios.get(
          "http://localhost:3000/auth/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(userResponse.data.message);

        const statsResponse = await axios.get(
          "http://localhost:3000/auth/dashboard/stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(statsResponse.data);

        const usersResponse = await axios.get(
          "http://localhost:3000/auth/dashboard/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersResponse.data);

        setLoading(false);

      } catch (err) {
        console.error(err);
        setMessage("Accès refusé. Veuillez vous connecter.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    swal({
      title: "Êtes-vous sûr ?",
      text: "Une fois supprimé, vous ne pourrez pas récupérer cet utilisateur !",
      icon: "warning",
      buttons: ["Annuler", "Supprimer"],
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3000/auth/dashboard/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const deletedUser = users.find(user => user.id === userId);

          setUsers(users.filter(user => user.id !== userId));
          setStats({
            ...stats,
            totalUsers: stats.totalUsers - 1,
            totalAdmins: deletedUser?.role === 'admin' ? stats.totalAdmins - 1 : stats.totalAdmins
          });

          swal("Utilisateur supprimé !", { icon: "success" });
        } catch (err) {
          console.error(err);
          swal("Échec de la suppression de l'utilisateur", { icon: "error" });
        }
      } else {
        swal("L'utilisateur est en sécurité !");
      }
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="dashboard-loading">Chargement...</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
         <img src={logo} style={{width:"150px"}} />
        </div>
        
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="navbar-actions">
          <div className="user-menu">
            <img 
              src={`https://ui-avatars.com/api/?name=${message}&background=random`} 
              alt="Admin" 
              className="user-avatar"
            />
            <span>{message}</span>
       
            <div className="logout">
              <BiLogOutCircle
                onClick={handleLogout}
                className="logout-btn"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total des utilisateurs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon admins">
              <FaUserShield />
            </div>
            <div className="stat-info">
              <h3>{stats.totalAdmins}</h3>
              <p>Total des administrateurs</p>
            </div>
          </div>
        </div>

        <div className="users-table-container">
          <h3>Gestion des utilisateurs</h3>
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
