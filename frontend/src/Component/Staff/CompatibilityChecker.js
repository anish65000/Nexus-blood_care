import React, { useState } from 'react';
import axios from 'axios';

const CompatibilityChecker = () => {
  const [formData, setFormData] = useState({
    donorType: '',
    recipientType: '',
    donorAge: '',
    recipientAge: '',
  });
  const [compatibilityResult, setCompatibilityResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/staff/checkCompatibility', formData);
      setCompatibilityResult(response.data);
    } catch (error) {
      console.error('Error checking compatibility:', error);
      setCompatibilityResult({ error: 'An error occurred while checking compatibility' });
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Compatibility Checker</h1>

      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Donor Blood Type */}
        <div className="flex flex-col">
          <label htmlFor="donorType" className="mb-2">Donor Blood Type:</label>
          <input
            type="text"
            id="donorType"
            name="donorType"
            value={formData.donorType}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Recipient Blood Type */}
        <div className="flex flex-col">
          <label htmlFor="recipientType" className="mb-2">Recipient Blood Type:</label>
          <input
            type="text"
            id="recipientType"
            name="recipientType"
            value={formData.recipientType}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Donor Age */}
        <div className="flex flex-col">
          <label htmlFor="donorAge" className="mb-2">Donor Age:</label>
          <input
            type="number"
            id="donorAge"
            name="donorAge"
            value={formData.donorAge}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Recipient Age */}
        <div className="flex flex-col">
          <label htmlFor="recipientAge" className="mb-2">Recipient Age:</label>
          <input
            type="number"
            id="recipientAge"
            name="recipientAge"
            value={formData.recipientAge}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Check Compatibility
        </button>
      </form>

      {/* Compatibility Result */}
      {compatibilityResult && (
        <div className="mt-6">
          {compatibilityResult.error ? (
            <p className="text-red-500">{compatibilityResult.error}</p>
          ) : (
            <div>
              <p className="text-green-500">Compatible: {String(compatibilityResult.compatible)}</p>
              {compatibilityResult.blood_group && (
                <div className="border border-gray-200 rounded-md p-4">
                  <p>Blood Group: {compatibilityResult.blood_group}</p>
                  <p>Total Unit: {compatibilityResult.total_unit}</p>
                  <p>Current Stock: {compatibilityResult.current_stock}</p>
                  <p>Blood Status: {compatibilityResult.blood_status}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompatibilityChecker;
