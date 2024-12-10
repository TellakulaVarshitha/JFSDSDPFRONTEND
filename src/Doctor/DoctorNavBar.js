import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import DoctorHome from './DoctorHome';
import DoctorProfile from './DoctorProfile';
import ViewAppointments from './ViewAppointments';
import Home from '../Main/Home';
import '../style.css';
import UpcomingAppointments from './UpcomingAppointments';
import PrescriptionForm from './PrescriptionForm';
import ViewPrescriptions from './ViewPrescriptions';
import ViewPatients from './ViewPatients';
import MeetingForm from './MeetingForm';
import ApproveAppointments from './ApproveAppointments'

export default function DoctorNavBar() {
  const navigate = useNavigate();
  
  // Define docId at the top of the function
  const docId = localStorage.getItem('doctor') ? JSON.parse(localStorage.getItem('doctor')).id : null;

  const handleLogout = () => {
    localStorage.removeItem('isDoctorLoggedIn');
    localStorage.removeItem('doctor');
    navigate('/home');
    window.location.reload();
  };

  return (
    <div>
      {/* Header Section */}
      <div className='header-container'>
        <header className='app-header'>
          <div className="app-logo">
            + SOUL MEDIC
            <p className="tagline">Multi Specialty Hospital</p>
          </div>
          <div className='nav-bar'>
            <Link to='/profile'>Profile</Link>
           
          </div>
        </header>
      </div>

      {/* Sidebar Section */}
      <div className='sidebar'>
        <Link to='/doctorhome'>Home</Link>
        <Link to='/approveappointments'>Approve Appointments</Link>
        <Link to='/upcomingappointments'>Scheduled Appointments</Link>
        <Link to='/viewappointment'>View Appointments</Link>
      
        {/* <Link to='/viewprescriptions'>View Prescriptions</Link> */}
        <Link to='/viewpatients'>View Patients</Link>
       
        <Link><button className='logoutbutton' onClick={handleLogout}>Logout</button></Link>
      </div>

      {/* Routing Section */}
      <Routes>
        <Route path='/' element={<DoctorHome />} />
        <Route path='/doctorhome' element={<DoctorHome />} />
        <Route path='/profile' element={<DoctorProfile />} />
        <Route path='/viewappointment' element={docId ? <ViewAppointments docId={docId} /> : <p>Doctor ID not found</p>} />
        <Route path='/upcomingappointments' element={<UpcomingAppointments />} />
        <Route path='/addprescription' element={<PrescriptionForm />} />
        <Route path='/viewprescriptions' element={<ViewPrescriptions />} />
        <Route path='/viewpatients' element={<ViewPatients/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/meetingform' element={<MeetingForm/>}/>
        <Route path='/approveappointments' element={<ApproveAppointments/>}/>
      </Routes>
    </div>
  );
}