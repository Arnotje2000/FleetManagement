import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Taskbar = () => {
    const { logout } = useContext(AuthContext); // Get the logout function from context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call the logout function
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="py-2 px-4 bg-customDarkBlue shadow-lg flex items-center">
            <h1 className="text-white text-xl font-bold flex-grow text-center">Fleet Management</h1>
            <div className="flex-none">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Taskbar;