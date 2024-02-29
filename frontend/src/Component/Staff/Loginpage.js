import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginImage from '../../Assest/img/login.jpg';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/Staff/login', {
        stfUserName: credentials.username,
        stfPassword: credentials.password
      });

      const { token } = response.data;

      // Store token in local storage
      localStorage.setItem('token', token);

      // Redirect user to staff homepage
      navigate('/staffhomepage');

      // Show success toast
      toast.success('Login successful', { autoClose: 3000 });
    } catch (error) {
      console.error('Login Error:', error);
      setIsLoading(false);

      // Show error toast
      toast.error('Login failed. Please check your credentials.', { autoClose: 3000 });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col justify-center">
          <img src={LoginImage} alt="Login Image" className="w-full h-auto" />
          <div className="px-4 py-6 bg-white rounded shadow-md">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                className="w-full px-3 py-2 border rounded placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                className="w-full mt-2 px-3 py-2 border rounded placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="mt-4 bg-indigo-500 text-white rounded px-4 py-2 transition duration-300 ease-in-out hover:bg-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="mt-6 md:mt-0">
          <div className="text-center">
            Don't have an account? <a href="" className="text-indigo-500">Register here</a>
          </div>
        </div>
            </form>
          </div>
         
        </div>
      
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
