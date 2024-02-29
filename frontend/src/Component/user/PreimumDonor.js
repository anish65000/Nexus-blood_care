import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button'; // Import the custom Button component

const PremiumDonorList = () => {
  const [premiumDonors, setPremiumDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPremiumDonors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/donors'); // Adjust the endpoint URL as needed
        const data = await response.json();

        // Ensure data is an array before setting the state
        if (Array.isArray(data)) {
          setPremiumDonors(data);
        } else {
          setError('Invalid data format. Expected an array.');
        }
      } catch (error) {
        console.error('Error fetching premium donors:', error);
        setError('Unable to fetch premium donors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumDonors();
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  const handleContact = (donor) => {
    // Implement your logic for contacting the donor
    console.log('Contacting donor:', donor);
  };

  const handleViewProfile = (donor) => {
    // Implement your logic for viewing the donor's profile
    console.log('Viewing profile of donor:', donor);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-800">Premium Donor List</h2>
    </div>
    <div className="mt-4">
      <ul>
        {premiumDonors.map((donor) => (
          <li key={donor.id} className="mb-6">
            <div className="grid grid-cols-2 bg-green">
              <div className="col-span-1">
                <div className="text-gray-700 font-bold">Profile Picture</div>
  
                <div className="profile-picture-container" style={{   height: '100px', width: '350px' }}>
                  <img
                    src={`http://localhost:5000${donor.profile_picture}`}
                    alt={`${donor.first_name} ${donor.last_name} profile picture`}
                    className="profile-picture"
                    onError={(e) => console.error('Error loading image:', e)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <div className="text-gray-700 font-bold">Name</div>
                  <div>{donor.first_name} {donor.last_name}</div>
                  <div className="text-gray-700 font-bold">Availability</div>
                  <div>{donor.availability_time}</div>
                  <div className="text-gray-700 font-bold">Blood group</div>
                  <div>{donor.blood_type}</div>
                  <div className="text-gray-700 font-bold">Loaction</div>
                  <div>{donor.email}</div>
                  <div className="text-gray-700 font-bold">Donar health</div>
                  <div>{donor.address}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-gray-700 font-bold">Phone Number</div>
                  <div>{donor.phone_number}</div>
                  <div className="text-gray-700 font-bold">age</div>
                  <div>{donor.age}</div>
                  <div className="text-gray-700 font-bold">Previous donation</div>
                  <div>{donor.age}</div>
                  <div className="text-gray-700 font-bold">Latitude</div>
                  <div>{donor.latitude}</div>
                  <div className="text-gray-700 font-bold">Longitude</div>
                  <div>{donor.longitude}</div>
                  <br></br>
                  
  <Link to={`/donors/${donor.premium_donor_id}`}>
    <button type="button">View Profile</button>
  </Link>


                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
 );
};
  

export default PremiumDonorList;
