import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
//import '../style.css'
import './Patientcss/Patient.css'
import PatientHome from './PatientHome'
import PatientProfile from './PatientProfile'
import BookAppointment from './BookAppointment'
import MyAppointments from './MyAppointments'
import Home from '../Main/Home';


import { useNavigate } from 'react-router-dom'

import PageNotFound from '../Main/PageNotFound'
import Dietplan from './DietPlan'


export default function PatientNavBar() {
  const navigate=useNavigate()

  
  
  const handleLogout = () => {
    localStorage.removeItem('isPatientLoggedIn');
    localStorage.removeItem('patient');

    navigate('/');
    window.location.reload()
  };
  return (

    <div>
      <div className='header-container'>
        <header className='app-header'>
        <div className="app-logo">
      + SOUL MEDIC
      <p className="tagline">Multi Specialty Hospital</p>
    </div>
      <div className='nav-bar'>

        {/* <Link to="patienthome">Home</Link> */}
        <Link to='profile'>Profile</Link>
       
      </div>
      </header>
      </div>
      <div className='sidebar'>
      <Link to='/patienthome'>Home</Link>
      <Link to='/BookAppointment'>Book Appointment</Link>
      <Link to='/MyAppointments'>My Appointments</Link>
      <Link to='/dietplan'>Diet Plan</Link>
       <Link><button className='logoutbutton' onClick={handleLogout}>Logout</button></Link>
      </div>
      <Routes>
        <Route path='/'Component={PatientHome}  exact/>
        <Route path='/patienthome' Component={PatientHome} exact/>
        <Route path='/profile' Component={PatientProfile} exact/>
        <Route path='/BookAppointment' Component={BookAppointment} exact/>
        <Route path='/MyAppointments' Component={MyAppointments} exact/>
        <Route path='/dietplan' Component={Dietplan} exact/>
        <Route path='/' Component={Home}/>
        <Route path="*" element={<PageNotFound/>} exact />
        {/* <Route path='/home' Component={Home} exact/>
        <Route path='/login' Component={Login}/> */}
        
      </Routes>
    </div>
  )
}
