// React Component: BloodRequestForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unit: 0,
    patientName: '',
    patientAddress: '',
    patientContact: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (
      !formData.bloodGroup ||
      formData.unit <= 0 ||
      !formData.patientName ||
      !formData.patientAddress ||
      !formData.patientContact
    ) {
      setError('Please fill in all fields with valid values.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login/stf/request', formData);
      setError(null); // Clear any previous errors
      toast.success(response.data.message); // Show toast notification for success
    } catch (error) {
      setError('Error submitting the request. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Blood Donation Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-600">
            Blood Group:
          </label>
          <input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="unit" className="block text-sm font-medium text-gray-600">
            Number of Units:
          </label>
          <input
            type="number"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-600">
            Patient Name:
          </label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="patientAddress" className="block text-sm font-medium text-gray-600">
            Patient Address:
          </label>
          <input
            type="text"
            id="patientAddress"
            name="patientAddress"
            value={formData.patientAddress}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="patientContact" className="block text-sm font-medium text-gray-600">
            Patient Contact:
          </label>
          <input
            type="text"
            id="patientContact"
            name="patientContact"
            value={formData.patientContact}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-800"
          >
            Submit Request
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BloodRequestForm;
