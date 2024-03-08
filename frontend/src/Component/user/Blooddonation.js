import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './Usercontext'; // Importing the useUser hook

const DonationForm = () => {
  const { state: { userRole } } = useUser(); // Extract userRole from the UserProvider context
  const [formData, setFormData] = useState({
    bankId: '',
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    units: '',
    disease: '',
    reason: '',
    status: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Unauthorized: Token missing');
      }
  
      const response = await axios.post(
        'http://localhost:5000/donation',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      toast.success('Donation successful');
      // Handle success
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized: Token missing or invalid format');
        // Handle token-related errors, e.g., redirect to login page
      } else {
        toast.error('An error occurred while submitting the donation.');
        // Handle other errors
      }
    }
  };
  

  return (
    <div className="max-w-xl mx-auto mt-10 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center py-4 bg-blue-500 text-white rounded-t-lg">Blood Donation Form</h2>
      {userRole === 'Donor' ? ( // Check if the user is a donor
        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bankId" className="block text-sm font-medium text-gray-700">Blood Bank ID:</label>
              <input type="text" id="bankId" name="bankId" placeholder="Blood Bank ID" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name:</label>
              <input type="text" id="name" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
              <input type="number" id="age" name="age" placeholder="Age" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
              <input type="text" id="gender" name="gender" placeholder="Gender" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group:</label>
              <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700">Units of Blood:</label>
              <input type="number" id="units" name="units" placeholder="Units of Blood" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">Medical Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="disease" className="block text-sm font-medium text-gray-700">Medical Condition:</label>
              <input type="text" id="disease" name="disease" placeholder="Medical Condition" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Donation:</label>
              <input type="text" id="reason" name="reason" placeholder="Reason for Donation" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status:</label>
              <input type="text" id="status" name="status" placeholder="Status" onChange={handleChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" />
            </div>
          </div>
          <button type="submit" className="bg-green hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Donate</button>
        </form>
      ) : (
        <p className="text-center text-red-600">You are not authorized to access this form.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default DonationForm;
