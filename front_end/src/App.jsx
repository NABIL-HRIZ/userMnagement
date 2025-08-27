import React from 'react'
import {BrowserRouter as Router, Routes,Route,Navigate} from 'react-router-dom'
import Login from './componants/Login'
import Register from './componants/Register'
import UsersHome from './componants/UsersHome'
import Dashboard from './componants/Dashboard'

const App = () => {
  return (
   <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/usersHome' element={<UsersHome />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
   </Router>
  )
}

export default App
