import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodDonationForm = () => {
  const [formData, setFormData] = useState({
    camp_id: '',
    donorName: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    bloodUnit: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your server endpoint
      await axios.post('http://localhost:5000/camp/collect', formData);

      // Display success toast
      toast.success('Blood donation collected successfully');
    } catch (error) {
      // Handle error, display error message, etc.
      console.error('Error collecting blood donation:', error.message);

      // Display error toast
      toast.error('Error collecting blood donation');
    }
  };

  return (
    <div className="container mx-auto mt-8">
    <form onSubmit={handleSubmit} className="max-w-md mx-auto  p-8 rounded-md shadow-md bg-bermuda">
        <h2 className="text-2xl font-semibold mb-6">Blood Donation Form</h2>

        <div className="mb-4 ">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="camp_id">
            Camp ID
          </label>
          <input
            type="text"
            id="camp_id"
            name="camp_id"
            value={formData.camp_id}
            onChange={handleChange}
            className="border rounded-md py-2 px-3 w-full"
            placeholder="Enter Camp ID"
            required
          />
        </div>

     

<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donorName">
    Donor Name
  </label>
  <input
    type="text"
    id="donorName"
    name="donorName"
    value={formData.donorName}
    onChange={handleChange}
    className="border rounded-md py-2 px-3 w-full"
    placeholder="Enter Donor Name"
    required
  />
</div>

<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodGroup">
    Blood Group
  </label>
  <input
    type="text"
    id="bloodGroup"
    name="bloodGroup"
    value={formData.bloodGroup}
    onChange={handleChange}
    className="border rounded-md py-2 px-3 w-full"
    placeholder="Enter Blood Group"
    required
  />
</div>

<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationDate">
    Donation Date
  </label>
  <input
    type="date"
    id="donationDate"
    name="donationDate"
    value={formData.donationDate}
    onChange={handleChange}
    className="border rounded-md py-2 px-3 w-full"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationTime">
    Donation Time
  </label>
  <input
    type="time"
    id="donationTime"
    name="donationTime"
    value={formData.donationTime}
    onChange={handleChange}
    className="border rounded-md py-2 px-3 w-full"
    required
  />
</div>

<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodUnit">
    Blood Unit
  </label>
  <input
    type="number"
    id="bloodUnit"
    name="bloodUnit"
    value={formData.bloodUnit}
    onChange={handleChange}
    className="border rounded-md py-2 px-3 w-full"
    placeholder="Enter Blood Unit"
    required
  />
</div>

<div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          >
            Collect Blood Donation
          </button>
        </div>
      </form>

      <ToastContainer />
      
    </div>
  );
};

export default BloodDonationForm;
