import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StaffRegistration() {
  const [staff, setStaff] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    stafftype: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/reg/stf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(staff)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error during staff registration:", error);
      toast.error("Internal Server Error");
    }
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Staff Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
          <input type="text" id="name" value={staff.name} onChange={(e) => setStaff({ ...staff, name: e.target.value })} required className="border border-gray-400 rounded py-2 px-3 w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
          <input type="email" id="email" value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} required className="border border-gray-400 rounded py-2 px-3 w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone:</label>
          <input type="text" id="phone" value={staff.phone} onChange={(e) => setStaff({ ...staff, phone: e.target.value })} required className="border border-gray-400 rounded py-2 px-3 w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address:</label>
          <input type="text" id="address" value={staff.address} onChange={(e) => setStaff({ ...staff, address: e.target.value })} required className="border border-gray-400 rounded py-2 px-3 w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
          <input type="text" id="username" value={staff.username} onChange={(e) => setStaff({ ...staff, username: e.target.value })} required className="border border-gray-400 rounded py-2 px-3 w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
          <input type="password" id="password" value={staff.password} onChange={(e) => setStaff({ ...staff, password: e.target.value })} required className="border border-gray-400 rounded py-2 px-3 w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userRole">
            Staff Role
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userRole"
            value={staff.stafftype}
            onChange={(e) => setStaff({ ...staff, stafftype: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Staff">Staff</option>
            <option value="Doctor">Doctor</option>
            <option value="Rider">Doctor</option>
            <option value="Admin">Doctor</option>
          
          </select>
        </div>

        <div className="mb-4">
          <input type="submit" value="Register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </div>
      </form>
      
      <ToastContainer />
    </div>
  );
}

export default StaffRegistration;