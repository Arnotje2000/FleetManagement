import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Navigating to register');
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await axios.post('http://localhost:5054/api/user/login', { 
        Email: username, 
        Password: password 
      });
      
      const data = response.data;
      console.log("Response data:", data);

      if (data && data.success) {
        const userData = data.user;
        console.log("User data:", userData);
        const user = { 
          username: userData.userName, 
          userId: userData.userId, 
          clearanceId: userData.clearanceId,
          tenantId: userData.tenantId
        };
        console.log("Created user object:", user);
        login(user);
        console.log("After login call");

        console.log("Attempting navigation with clearanceId:", userData.clearanceId);
        
        switch (userData.clearanceId) {
          case 1:
            console.log("Navigating to superadmin");
            navigate('/superadmin/dashboard');
            break;
          case 2:
            console.log("Navigating to bedrijfsadmin");
            navigate('/bedrijfsadmin/dashboard');
            break;
          case 3:
            console.log("Navigating to werknemer");
            navigate('/werknemer/dashboard');
            break;
          default:
            console.log("Navigating to default");
            navigate('/');
            break;
        }
        console.log("After navigation attempt");
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Failed to login');
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/raivis-razgals-ostLWBW4hsw-unsplash.jpg')" }}
    >
      <div className="bg-white bg-opacity-70 p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
              Forgot Password?
            </a>
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={handleRegister}
            >
              Not Yet Registered?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;