import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./StaffNavbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DonorStockController = () => {
  const [donorStockList, setDonorStockList] = useState([]);
  const [editingDonorStock, setEditingDonorStock] = useState(null);

  useEffect(() => {
    getDonorStocks();
  }, []);

  const getDonorStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/login/stf/ds');
      setDonorStockList(response.data);
    } catch (error) {
      console.error('Error fetching donor stocks:', error);
    }
  };

  const handleUpdateDonorStock = (donor_id) => {
    const donorStockToUpdate = donorStockList.find((item) => item.donor_id === donor_id);
    if (!donorStockToUpdate) {
      console.error('Donor stock not found for updating.');
      return;
    }

    // Set the editing donor
    setEditingDonorStock(donorStockToUpdate);
  };

  const handleCancelUpdate = () => {
    // Clear the editing donor
    setEditingDonorStock(null);
  };

  const handleSaveUpdate = () => {
    axios.put(`http://localhost:5000/login/stf/ds/update/${editingDonorStock.donor_id}`, editingDonorStock)
      .then((response) => {
        console.log('Donor stock updated successfully:', response.data);
        // Show success toast
        toast.success('Donor stock updated successfully');
        // Refresh the entire list from the server after update
        getDonorStocks();
        // Clear the editing donor
        setEditingDonorStock(null);
      })
      .catch((error) => {
        console.error('Error updating donor stock:', error);
        // Show error toast
        toast.error('Error updating donor stock');
      });
  };

  const handleDeleteDonorStock = (donor_id) => {
    axios.delete(`http://localhost:5000/login/stf/ds/delete/${donor_id}`)
      .then((response) => {
        console.log('Donor stock deleted successfully:', response.data);
        // Show success toast
        toast.success('Donor stock deleted successfully');
        // Refresh the entire list from the server after deletion
        getDonorStocks();
      })
      .catch((error) => {
        console.error('Error deleting donor stock:', error);
        // Show error toast
        toast.error('Error deleting donor stock');
      });
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="flex justify-between items-center px-4 py-2 ">
        <div className="hero-content bg-red max-w-2xl mx-auto">
          <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">Donor Management</h1>
          <p className="text-lg md:text-xl"><em>Empowering Lives, Saving Futures</em></p>
        </div>
      </div>
      <div className="container mx-auto p-4">
        {donorStockList.map((donorStock, index) => (
          <div key={donorStock.donor_id || index} className="flex flex-wrap bg-gray-200 p-4 mb-4">
            {/* Display donor details */}
            <div className="w-full md:w-1/6">
              <strong>Donor Name:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <input
                  type="text"
                  value={editingDonorStock.donor_name}
                  onChange={(e) => setEditingDonorStock({ ...editingDonorStock, donor_name: e.target.value })}
                />
              ) : (
                donorStock.donor_name
              )}
            </div>
            <div className="w-full md:w-1/6">
              <strong>Blood Group:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <input
                  type="text"
                  value={editingDonorStock.blood_group}
                  onChange={(e) => setEditingDonorStock({ ...editingDonorStock, blood_group: e.target.value })}
                />
              ) : (
                donorStock.blood_group
              )}
            </div>
            <div className="w-full md:w-1/6">
              <strong>Unit:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <input
                  type="text"
                  value={editingDonorStock.unit}
                  onChange={(e) => setEditingDonorStock({ ...editingDonorStock, unit: e.target.value })}
                />
              ) : (
                donorStock.unit
              )}
            </div>
            <div className="w-full md:w-1/6">
              <strong>Age:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <input
                  type="text"
                  value={editingDonorStock.age}
                  onChange={(e) => setEditingDonorStock({ ...editingDonorStock, age: e.target.value })}
                />
              ) : (
                donorStock.age
              )}
            </div>
            <div className="w-full md:w-1/6">
              <strong>Address:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <input
                  type="text"
                  value={editingDonorStock.address}
                  onChange={(e) => setEditingDonorStock({ ...editingDonorStock, address: e.target.value })}
                />
              ) : (
                donorStock.address
              )}
            </div>
            <div className="w-full md:w-1/6">
              <strong>Donation Time:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <input
                  type="text"
                  value={editingDonorStock.donation_time}
                  onChange={(e) => setEditingDonorStock({ ...editingDonorStock, donation_time: e.target.value })}
                />
              ) : (
                donorStock.donation_time
              )}
            </div>

            <div className="w-full md:w-1/6">
              <strong>Action:</strong> {editingDonorStock && editingDonorStock.donor_id === donorStock.donor_id ? (
                <>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={handleSaveUpdate}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                    onClick={handleCancelUpdate}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleUpdateDonorStock(donorStock.donor_id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteDonorStock(donorStock.donor_id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonorStockController;
