import React from 'react'
import {BrowserRouter as Router, Routes,Route,Navigate} from 'react-router-dom'
import Login from './componants/Login'
import Register from './componants/Register'
import UsersHome from './componants/usersHome'

const App = () => {
  return (
   <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/usersHome' element={<UsersHome />} />
      </Routes>
   </Router>
  )
}

export default App
