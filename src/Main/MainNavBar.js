import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Services from './Services'
import Login from './Login'
import Signup from './Signup'
import '../style.css'
import Doctorlogin from '../Doctor/Doctorlogin'
import Adminlogin from '../Admin/Adminlogin'
import DoctorSignUp from '../Doctor/DoctorSignup'


export default function MainNavBar({onAdminLogin,onPatientLogin,onDoctorLogin}) {
  
  return (
    <div>
      <div className='header-container'>
        <header className='app-header'>
        <div className="app-logo">
      + SOUL MEDIC
      <p className="tagline">Multi Specialty Hospital</p>
    </div>
      <div className='nav-bar'>
        <Link to="/home">Home</Link>
        <Link to='/services'>Services</Link>
        <Link to="/login">Login</Link>
      </div>
      </header>
      </div>
      <Routes>
        <Route path='/' Component={Home} exact/>
        <Route path='/home' Component={Home} exact/>
        <Route path='/services' Component={Services} exact/>
        <Route path='/login' element={<Login onPatientLogin={onPatientLogin} />} exact/>
        <Route path='/signup' Component={Signup} exact/>
        <Route path='/doctorlogin' element={<Doctorlogin onDoctorLogin={onDoctorLogin}/>}exact/>
        <Route path='/adminlogin' element={<Adminlogin onAdminLogin={onAdminLogin}/>} exact/>
        <Route path='/doctorsignup' Component={DoctorSignUp} exact/>
        <Route path="*" element={<Login onPatientLogin={onPatientLogin} />} exact />

        
      </Routes>
    </div>
  )
}
