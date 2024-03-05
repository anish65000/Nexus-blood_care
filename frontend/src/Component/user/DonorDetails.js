import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PremiumDonorDetails = () => {
  const { id } = useParams();
  const [donorDetails, setDonorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonorDetails = async () => {
      // Check if id is undefined
      if (!id) {
        setError('Donor ID is not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/donors/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch donor details');
        }
        const data = await response.json();
        setDonorDetails(data.premium_donor); // Extracting premium_donor from response
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch donor details based on the ID from your API or server
    fetchDonorDetails();
  }, [id]); // Dependency on 'id' ensures useEffect runs when the ID changes

  if (!id) {
    return <p>Error: Donor ID is not provided</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Donor Details</h2>
      </div>

      <div className="grid grid-cols-8 bg-green gap-10">
        {/* Profile Picture */}
        <div className="col-span-1">
          <div className="mb-2 text-gray-700 font-bold">Profile Picture</div>
          <div className="profile-picture-container rounded-full overflow-hidden">
            <img
              src={`http://localhost:5000${donorDetails.profile_picture}`}
              alt={`${donorDetails.user_name}'s profile picture`}
              className="profile-picture w-400 h-300 object-cover"
              onError={(e) => console.error('Error loading image:', e)}
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="col-span-4 p-20">
          <p className="text-base font-semibold mb-1">Basic Information</p>
          <p>ID: {donorDetails.premium_donor_id}</p>
          <p> Name: {donorDetails.userName}</p>
          <p>Email: {donorDetails.userEmail}</p>
          <p>Blood Type: {donorDetails.userBloodGroup}</p>
          <p>Age: {donorDetails.userAge}</p>
        </div>
      </div>

      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Request Blood</button>
    </div>
  );
};

export default PremiumDonorDetails;
