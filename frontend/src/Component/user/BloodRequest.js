import React, { useState } from 'react';
import axios from 'axios';

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unit: 0,
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/request', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error submitting the request. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg shadow-md p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Blood Donation Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col">
          <label htmlFor="bloodGroup" className="block text-sm font-medium mb-2">
            Blood Group:
          </label>
          <input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            required
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label htmlFor="unit" className="block text-sm font-medium mb-2">
            Number of Units:
          </label>
          <input
            type="number"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-white text-pink-500 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 active:bg-pink-200"
          >
            Submit Request
          </button>
        </div>
      </form>
      {message && (
        <p className="mt-4 text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default BloodRequestForm;
