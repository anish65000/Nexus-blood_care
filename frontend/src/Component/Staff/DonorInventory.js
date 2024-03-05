import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './StaffNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DonorInventoryComponent = () => {
  const [donorInventoryList, setDonorInventoryList] = useState([]);
  const [newDonorInventory, setNewDonorInventory] = useState({
    blood_group: '',
    unit: 0,
    age: 0,
    address: '',
    donor_name: '',
    donation_time: '',
  });

  const [editingDonorInventoryId, setEditingDonorInventoryId] = useState(null);

  // Fetch donor inventory data when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/login/stf/ds')
      .then(response => {
        setDonorInventoryList(response.data);
      })
      .catch(error => console.error('Error fetching donor inventory:', error));
  }, []);

  const showToast = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000, // Auto close the notification after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleUpdateDonorInventory = (id) => {
    const donorInventoryToUpdate = donorInventoryList.find(item => item.donor_id === id);
    if (!donorInventoryToUpdate) {
      console.error('Donor inventory not found for updating.');
      return;
    }

    axios.put('http://localhost:5000/login/stf/ds/update', donorInventoryToUpdate)
      .then(response => {
        console.log('Donor inventory updated successfully:', response.data);
        // Fetch updated data from the server to ensure consistency
        axios.get('http://localhost:5000/login/stf/ds')
          .then(response => {
            setDonorInventoryList(response.data);
            setEditingDonorInventoryId(null);
            showToast("success", "Donor inventory updated successfully");
          })
          .catch(error => console.error('Error fetching updated donor inventory data:', error));
      })
      .catch(error => {
        console.error('Error updating donor inventory:', error);
        showToast("error", "Error updating donor inventory");
      });
  };

  const handleEditDonorInventory = (id) => {
    setEditingDonorInventoryId(id);
  };

  const handleInsertDonorInventory = () => {
    // Check if unit or age is 0
    if (newDonorInventory.unit === 0 || newDonorInventory.age === 0) {
      alert('Unit and Age must be greater than 0.');
      return;
    }

    // Update local state immediately
    setDonorInventoryList(prevList => [...prevList, newDonorInventory]);
    // Clear the form
    setNewDonorInventory({
      blood_group: '',
      unit: 0,
      age: 0,
      address: '',
      donor_name: '',
      donation_time: '',
    });

    // Make the network request in the background
    axios.post('http://localhost:5000/login/stf/ds/insert', newDonorInventory)
      .then(response => {
        console.log('Donor inventory inserted successfully:', response.data);
        showToast("success", "Donor inventory inserted successfully");
        // If needed, update the state again based on the response
        // setDonorInventoryList(prevList => [...prevList, response.data]);
      })
      .catch(error => {
        console.error('Error inserting donor inventory:', error);
        showToast("error", "Error inserting donor inventory");
      });
  };

  const handleDeleteDonorInventory = id => {
    axios.delete(`http://localhost:5000/login/stf/ds/delete/${id}`)
      .then(response => {
        console.log('Donor inventory deleted successfully:', response.data);
        // Update the donorInventoryList state by removing the deleted item
        setDonorInventoryList(prevList => prevList.filter(item => item.donor_id !== id));
        showToast("success", "Donor inventory deleted successfully");
      })
      .catch(error => {
        console.error('Error deleting donor inventory:', error);
        showToast("error", "Error deleting donor inventory");
      });
  };

  return (
    <div className="container mx-auto p-4 text-lg">
      <Navbar />
      <h1 className="text-4xl font-bold mb-4">Donor Inventory Management</h1>
      <div className="overflow-x-auto">
        {/* Add the ToastContainer here */}
        <ToastContainer />

        <table className="min-w-full bg-red border border-gray-300 rounded-lg table-auto">
          <thead>
            <tr className="bg-green text-left text-sm font-medium uppercase tracking-wider">
              <th className="py-4 px-6 border border-gray">Blood Group</th>
              <th className="py-4 px-6 border border-gray">Unit</th>
              <th className="py-4 px-6 border border-gray">Age</th>
              <th className="py-4 px-6 border border-gray">Address</th>
              <th className="py-4 px-6 border border-gray">Donor Name</th>
              <th className="py-4 px-6 border border-gray">Donation Time</th>
              <th className="py-4 px-6 border border-gray">Action</th>
            </tr>
          </thead>
          <tbody>
            {donorInventoryList.map((donorInventory, index) => (
              <React.Fragment key={donorInventory.donor_id || index}>
                <tr>
                  <td>{donorInventory.blood_group}</td>
                  <td>
                    {editingDonorInventoryId === donorInventory.donor_id ? (
                      <input
                        type="number"
                        value={donorInventory.unit}
                        onChange={(e) => setDonorInventoryList(prevList =>
                          prevList.map(item => (item.donor_id === donorInventory.donor_id ? { ...item, unit: Number(e.target.value) } : item))
                        )}
                      />
                    ) : (
                      donorInventory.unit
                    )}
                  </td>
                  <td>
                    {editingDonorInventoryId === donorInventory.donor_id ? (
                      <input
                        type="number"
                        value={donorInventory.age}
                        onChange={(e) => setDonorInventoryList(prevList =>
                          prevList.map(item => (item.donor_id === donorInventory.donor_id ? { ...item, age: Number(e.target.value) } : item))
                        )}
                      />
                    ) : (
                      donorInventory.age
                    )}
                  </td>
                  <td>
                    {editingDonorInventoryId === donorInventory.donor_id ? (
                      <input
                        type="text"
                        value={donorInventory.address}
                        onChange={(e) => setDonorInventoryList(prevList =>
                          prevList.map(item => (item.donor_id === donorInventory.donor_id ? { ...item, address: e.target.value } : item))
                        )}
                      />
                    ) : (
                      donorInventory.address
                    )}
                  </td>
                  <td>
                    {editingDonorInventoryId === donorInventory.donor_id ? (
                      <input
                        type="text"
                        value={donorInventory.donor_name}
                        onChange={(e) => setDonorInventoryList(prevList =>
                          prevList.map(item => (item.donor_id === donorInventory.donor_id ? { ...item, donor_name: e.target.value } : item))
                        )}
                      />
                    ) : (
                      donorInventory.donor_name
                    )}
                  </td>
                  <td>
                    {editingDonorInventoryId === donorInventory.donor_id ? (
                      <input
                        type="text"
                        value={donorInventory.donation_time}
                        onChange={(e) => setDonorInventoryList(prevList =>
                          prevList.map(item => (item.donor_id === donorInventory.donor_id ? { ...item, donation_time: e.target.value } : item))
                        )}
                      />
                    ) : (
                      donorInventory.donation_time
                    )}
                  </td>
                  <td>
                    {editingDonorInventoryId === donorInventory.donor_id ? (
                      <button className="text-blue-600" onClick={() => handleUpdateDonorInventory(donorInventory.donor_id)}>
                        Save
                      </button>
                    ) : (
                      <>
                        <button className="text-blue-600 mr-2" onClick={() => handleEditDonorInventory(donorInventory.donor_id)}>
                          Edit
                        </button>
                        &nbsp; {/* Add a non-breaking space here */}
                        <button className="text-red-600" onClick={() => handleDeleteDonorInventory(donorInventory.donor_id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="7" className="border-b border-gray-300"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonorInventoryComponent;
