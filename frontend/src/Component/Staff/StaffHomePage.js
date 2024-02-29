// StaffHomepage.js
import React from 'react';
import Navbar from './StaffNavbar';


const StaffHomepage = () => {
  return (
    
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar /> {/* Assuming UserNavbar contains the top navigation */}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {/* Main content */}
          <div className="m-auto p-8 bg-white rounded shadow-md">
            <h1 className="text-3xl font-bold mb-4">Staff Homepage</h1>
            <div className="flex justify-between">
              {/* Add staff-related components or content here */}
              <div className="w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-2">Donor Management</h2>
                {/* Add Donor-related content or links */}
              </div>
              <div className="w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-2">Reports</h2>
                {/* Add Reports-related content or links */}
              </div>
            </div>
          </div>
        </main>
      </div>
    
  );
};

export default StaffHomepage;
