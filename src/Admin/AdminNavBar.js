import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import '../style.css'
import { useNavigate } from 'react-router-dom'

import PageNotFound from '../Main/PageNotFound'
import AdminHome from './AdminHome'
import ViewPatients from './ViewPatients'
import ViewDoctors from './ViewDoctors'



export default function AdminNavBar() {
  const navigate=useNavigate()

  
  
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin');

    navigate('/login');
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
        {/* <Link to='profile'>Profile</Link> */}
       
      </div>
      </header>
      </div>
      <div className='sidebar'>
      <Link to='/adminhome'>Home</Link>
      <Link to='/viewpatients'>View Patients</Link>
      <Link to='/viewdoctors'>View Doctors</Link>
      {/* <Link to='/deletedoctor'>Delete Doctors</Link>
      <Link to='/deletepatient'>Delete Patients</Link> */}
       <Link><button className='logoutbutton' onClick={handleLogout}>Logout</button></Link>
      </div>
      <Routes>
        <Route path='/'Component={AdminHome}  exact/>
        <Route path='/adminhome' Component={AdminHome}  exact/>
        <Route path='/viewpatients' element={<ViewPatients/>} exact/>
        <Route path='/viewdoctors' element={<ViewDoctors/>} exact/>
        {/* <Route path='/deletedoctor' element={<DeleteDoctor/>} exact/>
        <Route path='/deletepatient' element={<DeletePatient/>} exact/> */}
        <Route path="*" element={<PageNotFound/>} exact />
        
        
      </Routes>
    </div>
  )
}