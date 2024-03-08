import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationsNone, Settings } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserAlt, faSignOutAlt, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from './Usercontext';

const UserNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { state: { isLoggedIn, userRole, username }, logout } = useUser();

  useEffect(() => {
    // Check user authentication status or load user data here
    // For example, fetch user data from an API or perform any asynchronous operation.
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <nav className="bg-red sticky top-0 z-50">
      <div className="container mx-auto p-7 flex items-center justify-between">
        <div className="flex items-center ml-auto space-x-4">
          <Link to="/" className="text-white mr-4 font-bold">
            <FontAwesomeIcon icon={faHome} size="lg" />
            <span className="ml-2">Home</span>
          </Link>
        </div>

        <div className="flex items-center ml-auto space-x-20">
          <div className="relative cursor-pointer text-gray topbarIconContainer">
            <NotificationsNone className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-5 h-5 bg-red text-white rounded-full flex items-center justify-center text-xs topIconBadge">2</span>
            <span className="ml-2">Notifications</span>
          </div>

          {isLoggedIn && (
            <div className="relative cursor-pointer text-gray" onClick={toggleDropdown}>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserAlt} size="lg" />
                <span className="ml-2">{username}</span>
              </div>
              {showDropdown && (
                <div className="absolute mt-2 p-2 bg-white text-gray-800 shadow-lg rounded">
                  {userRole && (
                    <>
                      {userRole.toLowerCase() === 'donor' && (
                        <>
                          <Link to="/donor-profile" className="block py-2">
                            Donor Profile
                          </Link>
                          <Link to="/donate" className="block py-2">
                            Blood Donation 
                          </Link>
                        </>
                      )}
                      {userRole.toLowerCase() === 'recipient' && (
                        <>
                          <Link to="/recipient-profile" className="block py-2">
                            Recipient Profile
                          </Link>
                          <Link to="/blood" className="block py-2">
                            Blood Request History
                          </Link>
                        </>
                      )}
                    </>
                  )}
                  <Link to="/appointments" className="block py-2">
                    My Appointments
                  </Link>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <>
              {(userRole && userRole.toLowerCase() === 'donor') && (
                <Link to="/blood-requests" className="text-white">
                  <FontAwesomeIcon icon={faListAlt} size="lg" />
                  <span className="ml-2">Blood Requests (Donors)</span>
                </Link>
              )}
              {(userRole && userRole.toLowerCase() === 'recipient') && (
                <Link to="/blood-requests" className="text-white">
                  <FontAwesomeIcon icon={faListAlt} size="lg" />
                  <span className="ml-2">Blood Donations (Recipients)</span>
                </Link>
              )}
            </>
          )}

          {isLoggedIn && (
            <div className="relative cursor-pointer text-gray">
              <button className="text-white" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          )}

          {isLoggedIn && (
            <div className="relative cursor-pointer text-gray-500">
              <Settings className="h-6 w-6" />
              <span className="ml-2">Settings</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
