import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './Usercontext';
import UserNavbar from './UserNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faFlask } from '@fortawesome/free-solid-svg-icons';

const UserHome = () => {
  const { state } = useUser();
  const { isLoggedIn, userData } = state;

  return (
    <>
      <UserNavbar />

      <div className="container mx-auto px-4 py-8 bg-gray-100">
        {isLoggedIn && (
          <div className="welcome-message flex items-center justify-center bg-green-500 text-red py-4 px-6 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold">
              Welcome, {userData.userRole || 'User'}
            </h1>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 bg-gray-100">
          <p className="welcome-message flex items-center justify-center bg-green-500 text-white py-4 px-6 rounded-lg shadow-md">
            Saving lives, one donation at a time.
          </p>
        </div>

        <section className="hero-section mt-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Welcome to the Blood Donation System
          </h1>
          <p className="text-xl text-gray-700 max-w-md mx-auto">
            Saving lives, one donation at a time.
          </p>
        </section>

        <section className="donation-info-section mt-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-semibold mb-4">How Blood Donation Works</h2>
          <p className="text-lg text-gray-700 max-w-md mx-auto mb-4">
            Click "Become a Donor" to learn more about the eligibility criteria and donation process.
          </p>
          <Link to="/become-donor" className="btn btn-primary">
            <FontAwesomeIcon icon={faHospital} className="mr-2" /> Become a Donor
          </Link>
        </section>

        <section className="blood-bank-section mt-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-semibold mb-4">Find a Blood Bank</h2>
          <p className="text-lg text-gray-700 max-w-md mx-auto mb-4">
            Search for blood banks in your area to find the nearest location to donate blood or pick up blood requests.
          </p>
          <Link to="/blood-banks" className="btn btn-outline">
            <FontAwesomeIcon icon={faFlask} className="mr-2" /> Find a Blood Bank
          </Link>
        </section>
      </div>
    </>
  );
};

export default UserHome;
