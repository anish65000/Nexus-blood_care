import axios from "axios";
import React, { useState } from "react";
import  Navbar from "./StaffNavbar"
// import { useParams, useNavigate } from "react-router-dom";



import { toast } from "sonner";


const AddDonor = () => {
    const [ setDonorStockList] = useState([]);
  const [newDonorStock, setNewDonorStock] = useState({
    blood_group: '',
    unit: 0,
    age: 0,
    address: '',
    donor_name: '',
    donation_time: '',
  });

  const handleInsertDonorStock = () => {
    const { blood_group, unit, age, address, donor_name, donation_time } = newDonorStock;
    if (!blood_group || !unit || !age || !address || !donor_name || !donation_time) {
      alert('All fields are required.');
      return;
    }

    setDonorStockList((prevList) => [...prevList, newDonorStock]);
    setNewDonorStock({
      blood_group: '',
      unit: 0,
      age: 0,
      address: '',
      donor_name: '',
      donation_time: '',
    });

    axios
      .post('http://localhost:5000/login/stf/ds/insert', newDonorStock)
      .then((response) => {
        console.log('Donor stock inserted successfully:', response.data);
      })
      .catch((error) => console.error('Error inserting donor stock:', error));
      toast.success("Donor added successfully");
  };

  
  return (
    <>
    <div>
      <Navbar/>
     
     
      <div className="flex justify-between items-center px-4 py-2 ">

      <div className="hero-content max-w-2xl mx-auto">
      <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">Donor Management</h1>
      <p className="text-lg md:text-xl"><em>Empowering Lives, Saving Futures</em></p>
    </div>
  </div>

      </div>
      <hr className="border-t border-gray-500 mx-4" />

      <form
      onSubmit={(e) => {
        e.preventDefault();
        handleInsertDonorStock();
      }}
      >
        <div className="flex p-10 flex-wrap justify-center w-full">
          
          <div className="w-full sm:w-1/2 p-4 ">
            {/* Name */}
            <div className="flex flex-col mb-4">
              <label
                htmlFor="donor_name"
                className="font-bold text-red hover:text-gray transition duration-400 ease-in-out"
              >
                Name:
              </label>
               <input
          type="text"
          value={newDonorStock.donor_name}
          onChange={(e) => setNewDonorStock({ ...newDonorStock, donor_name: e.target.value })}
          className="mt-6 py-2 px-6 border rounded-md text-sm leading-5 text-gray focus:outline-none focus:border-red-500 focus:ring focus:ring-red"
              />
            </div>

            
            <div className="flex flex-col mb-4">
              <label
                htmlFor="unit"
                className="font-bold text-red hover:text-gray transition duration-400 ease-in-out"
              >
                Unit:
              </label>
              <input
          type="number"
          value={newDonorStock.unit}
          onChange={(e) => setNewDonorStock({ ...newDonorStock, unit: Number(e.target.value) })}
          className="mt-6 py-2 px-6 border rounded-md text-sm leading-5 text-gray focus:outline-none focus:border-red-500 focus:ring focus:ring-red"
              />
            </div>

            
          
            <div className="flex flex-col mb-4">
  <label
    htmlFor="blood_group"
    className="font-bold text-red hover:text-gray transition duration-400 ease-in-out"
  >
    Blood Group:
  </label>
  <div className="flex mt-1">
    <select
      id="blood_group"
      value={newDonorStock.blood_group}
      onChange={(e) => setNewDonorStock({ ...newDonorStock, blood_group: e.target.value })}
      className="px-3 py-2 border rounded-md text-sm leading-5 text-gray-700 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-500"
    >
      <option value="">select</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
    </select>
  </div>
</div>


          
            <div className="flex flex-col mb-4">
              <label
                htmlFor="age"
                className="font-bold text-red hover:text-gray transition duration-400 ease-in-out"
              >
                Age:
              </label>
              <input
                type="text"
                value={newDonorStock.age}
                onChange={(e) => setNewDonorStock({ ...newDonorStock, age: e.target.value })}
                className="mt-6 py-2 px-6 border rounded-md text-sm leading-5 text-gray focus:outline-none focus:border-red-500 focus:ring focus:ring-red"
              />
                
            </div>

            <div className="flex flex-col mb-4">
              <label
                htmlFor="address"
                className="font-bold text-red hover:text-gray transition duration-400 ease-in-out"
              >
                Address:
              </label>
              <input
                type="text"
                value={newDonorStock.address}
                onChange={(e) => setNewDonorStock({ ...newDonorStock, address: e.target.value })}
                className="mt-6 py-2 px-6 border rounded-md text-sm leading-5 text-gray focus:outline-none focus:border-red-500 focus:ring focus:ring-red"
              />
                
            </div>

 
            
            <div className="flex flex-col mb-4">
              <label
                htmlFor="donation_time"
                className="font-bold text-red hover:text-gray transition duration-400 ease-in-out"
              >
                Donation:
              </label>
              <input
          type="text"
          value={newDonorStock.donation_time}
          onChange={(e) => setNewDonorStock({ ...newDonorStock, donation_time: e.target.value })}
                className="mt-1 py-2 px-3 border rounded-md text-sm leading-5 text-gray-700 focus:outline-none focus:border-pastel-green focus:ring focus:ring-pastel-green"
              />
            </div>
          

            {/* Submit Button */}
            <button
  type="submit"
  className="bg-blue text-gray px-8 py-2 rounded-md hover:bg-red focus:outline-none focus:ring focus:bg-yellow"
>
  Submit
</button>

          </div>
        </div>
      </form>
    
     </>
    
  );
};

export default AddDonor;