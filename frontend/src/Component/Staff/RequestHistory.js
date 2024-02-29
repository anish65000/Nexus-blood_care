import React, { useState, useEffect } from 'react';
import RequestHistory from '../../Assest/img/RequestHistory.png';

function BloodRequestHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/login/stf/history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (requestId) => {
    try {
      // Check if requestId is defined before making the request
      if (requestId === undefined) {
        console.error('Invalid requestId:', requestId);
        return;
      }
  
      const response = await fetch(`http://localhost:5000/login/stf/request/${requestId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Remove the deleted request from the local state
        setHistory(history.filter(request => request.request_id !== requestId));
      } else {
        setError('Failed to cancel blood request.');
      }
    } catch (error) {
      setError('An error occurred while canceling blood request.');
    }
  };
  
  
  


  return (
    <div className="container mx-auto px-4 pb-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Blood Request History</h1>

      <div className="flex justify-start mt-8">
        <img
          src={RequestHistory}
          alt="Importance of Blood Donation"
          className="w-48 h-48 object-cover rounded-md shadow-md mr-4"
        />
        <p className="text-lg leading-7">
          Donating blood saves lives. Every unit of blood can help up to three
          people in need. Please consider donating blood today and make a
          difference!
        </p>
      </div>

      {isLoading && (
        <div className="text-center">Loading history...</div>
      )}

      {error && (
        <div className="text-red-500 text-center font-bold mb-4">{error}</div>
      )}

      {history.length > 0 && (
        <table className="table-auto w-full rounded-md shadow-md overflow-hidden">
          <thead className="bg-teal-400">
            <tr>
              <th className="px-4 py-2 text-left text-black font-medium">
                Blood Group
              </th>
              <th className="px-4 py-2 text-left text-black font-medium">
                Units Requested
              </th>
              <th className="px-4 py-2 text-left text-black font-medium">
                Patient Name
              </th>
              <th className="px-4 py-2 text-left text-black font-medium">
                Patient Address
              </th>
              <th className="px-4 py-2 text-left text-black font-medium">
                Patient Contact
              </th>
              <th className="px-4 py-2 text-left text-black font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {history.map((request) => (
               <tr key={request.request_id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-left text-black">{request.blood_group}</td>
                <td className="px-4 py-2 text-left text-black">{request.unit}</td>
                <td className="px-4 py-2 text-left text-black">{request.patient_name}</td>
                <td className="px-4 py-2 text-left text-black">{request.patient_address}</td>
                <td className="px-4 py-2 text-left text-black">{request.patient_contact}</td>
                <td className="px-4 py-2 text-left">
                <button
        onClick={() => handleDelete(request.request_id)} // Use request.request_id
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {history.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mb-4">No blood requests found.</div>
      )}
    </div>
  );
}

export default BloodRequestHistory;
