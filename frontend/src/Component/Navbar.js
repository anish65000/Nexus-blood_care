import React from "react";
import { Link } from 'react-router-dom';
import logo from './../Assest/img/logo.png';

const Navbar = () => {


  return (
    <div className="bg-red p-4 sticky top-0 z-50 flex justify-between items-center">
  <Link to="/" className="flex items-center">
    <img className="logo" src={logo} alt="Logo" />
    <div className="text-white font-bold text-xl ml-2">blood care Nexus</div>
  </Link>

  <ul className="flex space-x-40">
    <li>
      <Link to="/homepage">Home</Link>
    </li>
    <li>
      <Link to="/events">Events</Link>
    </li>
    <li>
      <Link to="/donor">Donor</Link>
    </li>
    <li>
      <Link to="/AboutUs">Blog</Link>
    </li>
    <li>
      <Link to="/blood-recipient">Blood Recipient</Link>
    </li>
    <li>
      <Link to="/staff">Staff</Link>
    </li>
    <li>
      <Link to="/blood-bank">Blood Bank</Link>
    </li>
  </ul>
</div>

  );
};

export default Navbar;
