import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ type }) => {
  const navigate = useNavigate();

  // Define links for different dashboard types
  const links = {
    bedrijfsAdmin: [
      { path: '/bedrijfsadmin/dashboard', label: 'Home', icon: 'fi-rr-home' },
      { path: '/bedrijfsadmin/fleet-management', label: 'Fleet Management', icon: 'fi-rr-car-side' },
      { path: '/bedrijfsadmin/employee-management', label: 'Employee Management', icon: 'fi-rr-employee-man-alt' },
      { path: '/bedrijfsadmin/statistics', label: 'Statistics', icon: 'fi-rr-stats' },
      { path: '/bedrijfsadmin/custom-field-management', label: 'Custom Field Management', icon: 'fi-rr-customize' },
    ],
    superAdmin: [
      { path: '/superadmin/dashboard', label: 'Home', icon: 'fi-rr-home' },
      { path: '/superadmin/company-management', label: 'Company Management', icon: 'fi-rr-car-side' },
    ],
    werknemer: [
      { path: '/werknemer/dashboard', label: 'Dashboard', icon: 'fi-rr-home' },
      { path: '/werknemer/fleet-list', label: 'Fleet List', icon: 'fi-rr-car-side' },
    ],
  };

  // Select the appropriate links based on the type
  const selectedLinks = links[type] || [];

  return (
    <div className="w-1/5 bg-customDarkBlue shadow-md border-t border-gray-600">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
      </div>
      <nav className="mt-4">
        <ul>
          {selectedLinks.map((link, index) => (
            <li
              key={index}
              className="flex items-center p-4 hover:bg-customBlue cursor-pointer text-white border-b border-gray-600"
              onClick={() => navigate(link.path)}
            >
              <i className={`fi ${link.icon} mr-2`} style={{ marginTop: '2px' }}></i> {link.label}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;