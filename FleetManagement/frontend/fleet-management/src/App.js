import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import BedrijfsAdminDashboard from './components/dashboard/BedrijfsAdminDashboard'; 
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import WerknemerDashboard from './components/dashboard/WerknemerDashboard';
import Taskbar from './components/utils/Taskbar';
import CompanyManagement from './components/superadmin/CompanyManagement';
import FleetManagement from './components/bedrijfsadmin/FleetManagement';
import EmployeeManagement from './components/bedrijfsadmin/EmployeeManagement';
import Statistics from './components/bedrijfsadmin/Statistics';
import CustomFieldsManagement from './components/bedrijfsadmin/CustomFieldsManagement';
import FleetList from './components/werknemer/FleetList';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  console.log("Protected Route - Auth State:", { isAuthenticated, loading, user }); // Debug log

  if (loading) {
    console.log("Protected Route - Loading"); // Debug log
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Protected Route - Not authenticated, redirecting to login"); // Debug log
    return <Navigate to="/login" />;
  }

  console.log("Protected Route - Rendering protected content"); // Debug log
  return (
    <>
      <Taskbar />
      {children}
    </>
  );
};

function App() {
  const { user } = useContext(AuthContext);
  const [customFields, setCustomFields] = useState([]);

  const handleCustomFieldAdded = (vehicleId, fieldName, fieldValue) => {
    setCustomFields(prevFields => [
      ...prevFields,
      { vehicleId, fieldName, fieldValue }
    ]);
    console.log('Custom field added:', { vehicleId, fieldName, fieldValue });
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bedrijfsadmin/dashboard" element={<ProtectedRoute><BedrijfsAdminDashboard /></ProtectedRoute>} />
        <Route path="/bedrijfsadmin/fleet-management" element={<ProtectedRoute><FleetManagement /></ProtectedRoute>} />
        <Route path="/bedrijfsadmin/employee-management" element={<ProtectedRoute><EmployeeManagement loggedInUser={user} tenantId={user?.tenantId} /></ProtectedRoute>} />          
        <Route path="/bedrijfsadmin/statistics" element={<ProtectedRoute><Statistics loggedInUser={user} tenantId={user?.tenantId} /></ProtectedRoute>} />
        <Route path="/bedrijfsadmin/custom-field-management" element={<ProtectedRoute><CustomFieldsManagement onCustomFieldAdded={handleCustomFieldAdded} /></ProtectedRoute>} />
        <Route path="/superadmin/dashboard" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
        <Route path="/superadmin/company-management" element={<ProtectedRoute><CompanyManagement /></ProtectedRoute>} />
        <Route path="/werknemer/dashboard" element={<ProtectedRoute><WerknemerDashboard /></ProtectedRoute>} />
        <Route path="/werknemer/fleet-list" element={<ProtectedRoute><FleetList /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;