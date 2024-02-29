import React, { useState } from 'react';

const RegisterBloodBankForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    phone: '',
    email: '',
    district: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    
    try {
      const response = await fetch('http://localhost:5000/api/register/bloodbank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Blood bank registered successfully!');
        setFormData({
          name: '',
          category: '',
          phone: '',
          district: '',
          email: '',
          address: '',
          latitude: '',
          longitude: '',
        });
      }
    } catch (error) {
      console.error('Error registering blood bank:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Register Blood Bank</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2 text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
          required
        >
          <option value="">Select...</option>
          {/* Provide available category options here */}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2 text-sm font-medium">
          Phone Number
        </label>
        <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
                    required
                  />
                </div>
              
                <div className="mb-4">
                  <label htmlFor="district" className="block mb-2 text-sm font-medium">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block mb-2 text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="latitude" className="block mb-2 text-sm font-medium">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="longitude" className="block mb-2 text-sm font-medium">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm p-2.5"
                    required
                  />
                </div>
                 {/* Display blood bank details */}
          
              </form>
            );
          };
          
          export default RegisterBloodBankForm;
          
