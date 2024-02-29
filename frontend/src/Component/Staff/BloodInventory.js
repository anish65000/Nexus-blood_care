import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './BloodInventory.css';
import Navbar from '../Navbar'; 

const BloodStockComponent = () => {
  const [bloodStockList, setBloodStockList] = useState([]);
  const [newBloodStock, setNewBloodStock] = useState({
    blood_group: '',
    total_unit: 0,
    current_stock: 0,
    blood_status: '',
  });
  
  const [editingBloodStockId, setEditingBloodStockId] = useState(null);

  // Fetch blood stock data when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/login/stf/inv')
      .then(response => {
        setBloodStockList(response.data);
      })
      .catch(error => console.error('Error fetching blood stock:', error));
  }, []);
  const handleUpdateBloodStock = (id) => {
    const bloodStockToUpdate = bloodStockList.find(item => item.id === id);
    if (!bloodStockToUpdate) {
      console.error('Blood stock not found for updating.');
      return;
    }
  
    axios.put(`http://localhost:5000/login/stf/inv/update/${id}`, bloodStockToUpdate)
      .then(response => {
        console.log('Blood stock updated successfully:', response.data);
        // Fetch updated data from the server to ensure consistency
        axios.get('http://localhost:5000/login/stf/inv')
          .then(response => {
            setBloodStockList(response.data);
            setEditingBloodStockId(null);
          })
          .catch(error => console.error('Error fetching updated blood stock data:', error));
      })
      .catch(error => console.error('Error updating blood stock:', error));
  };
  
  

  const handleEditBloodStock = (id) => {
    setEditingBloodStockId(id);
  };

  const handleInsertBloodStock = () => {
    // Check if total_unit or current_stock is 0
    if (newBloodStock.total_unit === 0 || newBloodStock.current_stock === 0) {
      alert('Total Units and Current Stock must be greater than 0.');
      return;
    }

    // Update local state immediately
    setBloodStockList(prevList => [...prevList, newBloodStock]);
    // Clear the form
    setNewBloodStock({
      blood_group: '',
      total_unit: 0,
      current_stock: 0,
      blood_status: '',
    });

    // Make the network request in the background
    axios.post('http://localhost:5000/login/stf/inv/insert', newBloodStock)
      .then(response => {
        console.log('Blood stock inserted successfully:', response.data);
        // If needed, update the state again based on the response
        // setBloodStockList(prevList => [...prevList, response.data]);
      })
      .catch(error => console.error('Error inserting blood stock:', error));
  };

  const handleDeleteBloodStock = id => {
    axios.delete(`http://localhost:5000/login/stf/inv/delete/${id}`)
      .then(response => {
        console.log('Blood stock deleted successfully:', response.data);
        // Update the bloodStockList state by removing the deleted item
        setBloodStockList(prevList => prevList.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting blood stock:', error));
  };
  

  return (
    <div>
      <h1>Blood Stock Management</h1>
      <table>
        <thead>
          <tr>
            <th>Blood Group</th>
            <th>Total Units</th>
            <th>Current Stock</th>
            <th>Blood Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {bloodStockList.map((bloodStock, index) => (
    <tr key={bloodStock.id || index}>
      <td>{bloodStock.blood_group}</td>
      <td>
        {editingBloodStockId === bloodStock.id ? (
          <input
            type="number"
            value={bloodStock.total_unit}
            onChange={(e) => setBloodStockList(prevList =>
              prevList.map(item => (item.id === bloodStock.id ? { ...item, total_unit: Number(e.target.value) } : item))
            )}
          />
        ) : (
          bloodStock.total_unit
        )}
      </td>
      <td>
        {editingBloodStockId === bloodStock.id ? (
          <input
            type="number"
            value={bloodStock.current_stock}
            onChange={(e) => setBloodStockList(prevList =>
              prevList.map(item => (item.id === bloodStock.id ? { ...item, current_stock: Number(e.target.value) } : item))
            )}
          />
        ) : (
          bloodStock.current_stock
        )}
      </td>
      <td>
        {editingBloodStockId === bloodStock.id ? (
          <input
            type="text"
            value={bloodStock.blood_status}
            onChange={(e) => setBloodStockList(prevList =>
              prevList.map(item => (item.id === bloodStock.id ? { ...item, blood_status: e.target.value } : item))
            )}
          />
        ) : (
          bloodStock.blood_status
        )}
      </td>
      <td>
        {editingBloodStockId === bloodStock.id ? (
          <button onClick={() => handleUpdateBloodStock(bloodStock.id)}>
            Save
          </button>
        ) : (
          <button onClick={() => handleEditBloodStock(bloodStock.id)}>
            Edit
          </button>
        )}
        <button onClick={() => handleDeleteBloodStock(bloodStock.id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>


      </table>

    </div>
  );
};

export default BloodStockComponent;
