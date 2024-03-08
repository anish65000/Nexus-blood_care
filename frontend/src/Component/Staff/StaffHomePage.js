import React from 'react';
import Navbar from './StaffNavbar';
import { useStaff } from './StaffContext';
import { Link } from 'react-router-dom'; // Import Link for navigation

const StaffHomepage = () => {
  const { state } = useStaff();
  const { stfUserName, stfStaffType } = state;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div className="m-auto p-8 bg-white rounded shadow-md">
          <h1 className="text-3xl font-bold mb-4">Staff Homepage</h1>
          <div className="flex justify-between">
            <div className="w-1/2 p-4">
              <h2 className="text-xl font-semibold mb-2">Staff Information</h2>
              <p>Staff Name: {stfUserName}</p>
              <p>Staff Type: {stfStaffType}</p>
            </div>
            <div className="w-1/2 p-4 text-right bg-purple">
              {/* Add Link to ManageDonations */}
              <Link to="/managedonation" className="btn btn-primary">
                Manage Donations
              </Link>
            </div>
          </div>
          {/* Other content */}
        </div>
      </main>
    </div>
  );
};

export default StaffHomepage;
