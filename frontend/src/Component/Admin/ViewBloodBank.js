import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BankDetails() {
  const { id } = useParams();
  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/bloodbank/${id}`);
      setBankDetails(response.data);
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  if (!bankDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mt-5 mb-8 text-center text-red-600">Bank Details</h1>
      <div className="border p-6 bg-green rounded-lg shadow-md">
        <p><strong>Name:</strong> {bankDetails.name}</p>
        <p><strong>Category:</strong> {bankDetails.category}</p>
        <p><strong>Phone:</strong> {bankDetails.phone}</p>
        <p><strong>District:</strong> {bankDetails.district}</p>
        <p><strong>Email:</strong> {bankDetails.email}</p>
        <p><strong>Address:</strong> {bankDetails.address}</p>
        <p><strong>Latitude:</strong> {bankDetails.latitude}</p>
        <p><strong>Longitude:</strong> {bankDetails.longitude}</p>
        {/* You can include additional bank details here */}
      </div>
    </div>
  );
}

export default BankDetails;
