// ... (previous imports)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { NotificationsNone, Settings } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faUsers, faVial,faTint  } from '@fortawesome/free-solid-svg-icons';

const StaffNavbar = () => {
  const [showDonorManagementDropdown, setShowDonorManagementDropdown] = useState(false);

  const toggleDonorManagementDropdown = () => {
    setShowDonorManagementDropdown(!showDonorManagementDropdown);
  };

  return (
    <nav className="bg-red sticky top-0 z-50">
      <div className="container mx-auto p-7 flex items-center justify-between">
        {/* Staff Home Page Link */}
        <div className="flex items-center ml-auto space-x-4">
          <Link to="/staff-home" className="text-white mr-4 font-bold">
            <FontAwesomeIcon icon={faHome} size="lg" />
            <span className="ml-2">Home</span>
          </Link>
        </div>

        <div className="flex items-center ml-auto space-x-20">
          {/* Notifications Icon */}
          <div className="relative cursor-pointer text-gray topbarIconContainer">
            <NotificationsNone className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red text-white rounded-full flex items-center justify-center text-xs topIconBadge">2</span>
            <span className="ml-2">Notifications</span>
          </div>

          {/* Blood Inventory Icon */}
<div className="relative cursor-pointer text-gray">
  <Link to="/bloodstock" className="text-white">
    <FontAwesomeIcon icon={faTint} size="lg" />
    <span className="ml-2">Blood Inventory</span>
  </Link>
</div>

          {/* Donor Management Icon */}
          <div className="relative cursor-pointer text-gray" onClick={toggleDonorManagementDropdown}>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUsers} size="lg" />
              <span className="ml-2">Donor Management</span>
            </div>
            {/* Donor Management Dropdown */}
            {showDonorManagementDropdown && (
              <div className="absolute mt-2 p-2 bg-white text-gray-800 shadow-lg rounded">
                <Link to="/register-donor" className="block py-2">
                  Register Donor
                </Link>
                <Link to="/view-donation-history" className="block py-2">
                  View Donation History
                </Link>
                <Link to="/donorstock" className="block py-2">
                  Manage Donor
                </Link>
              </div>
            )}
          </div>

          {/* Recipient Management Icon */}
          <div className="relative cursor-pointer text-gray">
            <Link to="/recipient-management" className="text-white">
              <FontAwesomeIcon icon={faUser} size="lg" />
              <span className="ml-2">Recipient Management</span>
            </Link>
          </div>

          {/* Blood Testing Icon */}
          <div className="relative cursor-pointer text-gray">
            <Link to="/blood-testing" className="text-white">
              <FontAwesomeIcon icon={faVial} size="lg" />
              <span className="ml-2">Blood Testing</span>
            </Link>
          </div>

          {/* Logout Icon */}
          <div className="relative cursor-pointer text-gray">
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            <span className="ml-2">Logout</span>
          </div>

          {/* Settings Icon */}
          <div className="relative cursor-pointer text-gray-500">
            <Settings className="h-6 w-6" />
            <span className="ml-2">Settings</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
