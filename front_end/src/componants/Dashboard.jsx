import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.jpeg'
import { 
  FaUsers, 
  FaUserShield, 
  FaSearch, 
  FaTrash
} from 'react-icons/fa';
import { SiAdminer } from 'react-icons/si';
import { BiLogOutCircle } from 'react-icons/bi';
import { FaPercent } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
 import swal from 'sweetalert'; 
import { 
  BarChart, Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';




const Dashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersByDay, setUsersByDay] = useState([]);
  const [lastUsers,setLastUsers]=useState([])




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


        const userCreated = await axios.get(
  "http://localhost:3000/auth/dashboard/users_day",
  { headers: { Authorization: `Bearer ${token}` } }
);
const formattedData = userCreated.data.map(item => ({
  day: item.day.split('T')[0],
  total: item.total
}));

setUsersByDay(formattedData);

        const usersResponse = await axios.get(
          "http://localhost:3000/auth/dashboard/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersResponse.data);

          const lastUser = await axios.get(
          "http://localhost:3000/auth/dashboard/last_3_users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLastUsers(lastUser.data);

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
      text: "Vous ne pourrez pas récupérer cet utilisateur !",
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
        swal("L'utilisateur toujours encore  !",{icon:"info"});
      }
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const adminRatio = stats.totalUsers
  ? Math.round((stats.totalAdmins / stats.totalUsers) * 100)
  : 0;

const chartData = [
  { category: 'Stats', users: stats.totalUsers, admins: stats.totalAdmins }
];

  if (loading) return <div className="dashboard-loading">Chargement...</div>;

  return (
    <div className="dashboard-container">

      
       <Navbar expand="lg" className={'px-3 fixed-top bg-body-tertiary'}>
        <Container fluid className="d-flex justify-content-between align-items-center">
      
      
          <Navbar.Brand className="d-flex align-items-center gap-2 logo">
            <h3 style={{color:'#4e074eff'}}>USER MANAGEMENT <SiAdminer style={{fontSize:"25px"}} /></h3>
          </Navbar.Brand>
      
      
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
      
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

      
             
      
             
      
             
      
              
      
             
              
            </Nav>
          </Navbar.Collapse>
      
        </Container>
          </Navbar>

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
          <div className="stat-card">
             <div className="stat-icon percentage">
              <FaPercent />
            </div>
  <div className="stat-info">
    <h3>{adminRatio}%</h3>
    <p style={{marginBottom:"10px"}}>Taux Admins / Utilisateurs</p>
    <div className="progress">
      <div className="progress-bar" style={{ width: `${adminRatio}%`}} />
    </div>
  </div>
</div>

        </div>

      
        <div className='last-3_users'>
  <div className="users-card">
    <div className="users-card-content">
      <div className="users-card-icon">
        <FaUsers />
      </div>
      <div className="stat-info">
        <h3>Les 3 dernieres utilisateurs</h3>
        <div className='last-users'>
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {lastUsers.length > 0 ? (
                lastUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
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
  </div>
</div>


       <div className="chart-section">
        <div className='chart_one'>
<h3 className="chart-title">Nombre d'utilisateurs et d'administrateurs</h3>
   <ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData} barGap={10}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="category" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="users" fill="#8884d8" name="Users" />
    <Bar dataKey="admins" fill="#82ca9d" name="Admins" />
    <Legend />
  </BarChart>
</ResponsiveContainer>


        </div>
        <div className='chart_two'>
<h3 className="chart-title">Utilisateurs par jour</h3>

            <ResponsiveContainer width="100%" height="100%">
  <LineChart data={usersByDay}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
  </LineChart>
</ResponsiveContainer>
            

        </div>



        </div>



        <div className="users-table-container">
          <h3>Gestion des utilisateurs</h3>
          <table className="users-table" >
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
  {user.role !== 'admin' && ( 
    <button 
      className="btn-delete"
      onClick={() => handleDeleteUser(user.id)}
    >
      <FaTrash />
    </button>
  )}
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
