//import logo from './logo.svg';
//import './App.css';
import { useState,useEffect } from "react";
import AdminNavBar from "./Admin/AdminNavBar";
import { BrowserRouter } from "react-router-dom";
import MainNavBar from "./Main/MainNavBar";
import PatientNavBar from "./Patient/PatientNavBar";
import DoctorNavBar from "./Doctor/DoctorNavBar";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(false);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
     const PatientLoggedIn = localStorage.getItem('isPatientLoggedIn') === 'true';
     const DoctorLoggedIn = localStorage.getItem('isDoctorLoggedIn') === 'true';
    
     setIsAdminLoggedIn(adminLoggedIn);
     setIsPatientLoggedIn(PatientLoggedIn);
    setIsDoctorLoggedIn(DoctorLoggedIn);
   }, []);

   const onAdminLogin = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
    setIsAdminLoggedIn(true);
  };

  const onPatientLogin = () => {
    localStorage.setItem('isPatientLoggedIn', 'true');
    setIsPatientLoggedIn(true);
  };

  const onDoctorLogin = () => {
    localStorage.setItem('isDoctorLoggedIn', 'true');
    setIsDoctorLoggedIn(true);
  };

  return (
    <div className="App">
     <BrowserRouter>
     {isAdminLoggedIn ? (
          <AdminNavBar />
        ) : isPatientLoggedIn ? (
          <PatientNavBar />
        ) : isDoctorLoggedIn ? (
          <DoctorNavBar />
        ) : (
          <MainNavBar
            onAdminLogin={onAdminLogin}
            onPatientLogin={onPatientLogin}
            onDoctorLogin={onDoctorLogin}
          />
        )}
     </BrowserRouter>
    </div>
  );
}

export default App;
