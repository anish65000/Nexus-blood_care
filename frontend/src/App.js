import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserRegister from './Component/user/UserRegister';
import UserLoginPage from './Component/user/UserLogin';  
import HomePage from './Component/Homepage';
import StaffRegistration from './Component/Staff/StaffRegister';
import BloodStock from './Component/Staff/BloodInventory';
import DonorStockComponent from './Component/Staff/DonorInventory'; 
import BloodTestForm from './Component/Staff/BloodTesting';
import AddDonor from './Component/Staff/RegisterDonor';
import BloodRequestComponent from './Component/user/BloodRequest';


import PremiumDonorManagement from './Component/user/PreimumDonor' 
import DonorDetailsPage from './Component/user/DonorDetails';
import AboutUs from './Component/AboutUs';
import StaffHomepage from './Component/Staff/StaffHomePage';
import BloodRequestHistory from './Component/Staff/RequestHistory';
import CampBloodDonation from './Component/Camp/Camp';
import CampSearch from './Component/Camp/CampSearch ';
import RegisterBloodBankForm from './Component/Admin/RegisterBloodBank';
import BankDetails from './Component/Admin/ViewBloodBank';
import BloodBankManagement from './Component/Admin/bank';
import { UserProvider } from './Component/user/Usercontext';
import NearbyDonorsMap from './Component/user/NearbyDonor';

import BloodDonationForm from './Component/Camp/CampDonation';
import LoginPage from './Component/Staff/Loginpage';
import UserHome from './Component/user/UserHomePage';
import UserNavbar from './Component/user/UserNavbar';
import BloodStockForm from './Component/Staff/BloodStockForm';

function App() {
  return (
    <BrowserRouter>
    <UserProvider>
      <Routes>
      <Route path="/user/login" element={<UserLoginPage />} />
      <Route path="/Navbar" element={<UserNavbar />} />
        <Route path="/staff/login" element={<LoginPage />} />
        <Route path="/register" element={<UserRegister />} />
       
        <Route path="/" element={<HomePage />} />
        <Route path="/staff" element={<StaffRegistration />} />
        <Route path="/bloodstock" element={<BloodStock />} />
        <Route path="/donorstock" element={<DonorStockComponent />} />
        <Route path="/testingblood" element={<BloodTestForm />} />
        <Route path="/blood" element={<  BloodRequestComponent />} />
        <Route path="/AddBlood" element={< BloodStockForm/>} />
        <Route path="/campmanagement" element={<  CampBloodDonation  />} /> 
        <Route path="/camp" element={<CampSearch/>} />
        <Route path="/BloodRequestHistory" element={<BloodRequestHistory/>} />
        <Route path="/Adddonor" element={<AddDonor />} />
        <Route path="/CampComponent" element={< BloodDonationForm  />} />
        <Route path="/donors" element={< PremiumDonorManagement  />} />
        <Route path="/RegisterBank" element={< RegisterBloodBankForm  />} />
        <Route path="/BloodBankManagement" element={< BloodBankManagement/>} />
       
        <Route path="/bloodbank/:id" element={<BankDetails  />} />
        <Route path="/donors/:id" element={<DonorDetailsPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/staffhomepage" element={<StaffHomepage />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/nearbydonor" element={<NearbyDonorsMap />} />

      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
