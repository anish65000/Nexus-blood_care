import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodTestForm = () => {
  const [donorStockList, setDonorStockList] = useState([]);
  const [selectedDonorIndex, setSelectedDonorIndex] = useState(null);
  const [formValues, setFormValues] = useState({
    generalHealth: 'good',
    disqualifyingMedications: '',
    recentTravel: '',
    recentTattoos: '',
    recentSexualActivity: '',
    drugUse: '',
  });
  const [bloodTestResult, setBloodTestResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/login/stf/ds');
        setDonorStockList(response.data);
      } catch (error) {
        console.error('Error fetching donor stock:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleCheckBlood = async (donorId, formValues) => {
    try {
      const response = await axios.post(`http://localhost:5000/login/stf/ds/test-blood/${donorId}`, formValues);

      if (response.data.result === 'safe') {
        console.log('Blood is safe:', response.data.donor);
      } else {
        console.log('Blood is unsafe:', response.data.donor);
      }

      // Update donorStockList with the latest information
      const updatedDonorStockList = donorStockList.map((donorStock, index) => {
        if (donorStock.donor_id === donorId) {
          // Update the blood_status for the selected donor
          setSelectedDonorIndex(index);
          return { ...donorStock, blood_status: response.data.result };
        }
        return donorStock;
      });

      setDonorStockList(updatedDonorStockList);

      // Set the blood test result
      setBloodTestResult(response.data.result);
    } catch (error) {
      console.error('Error testing blood:', error.message);
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (selectedDonorIndex !== null) {
        const selectedDonor = donorStockList[selectedDonorIndex];
        await handleCheckBlood(selectedDonor.donor_id, formValues);
        setFormValues({
          generalHealth: 'good',
          disqualifyingMedications: '',
          recentTravel: '',
          recentTattoos: '',
          recentSexualActivity: '',
          drugUse: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Donor details</h1>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Donor Name</th>
            <th className="py-2 px-4 border">Blood Group</th>
            <th className="py-2 px-4 border">Unit</th>
            <th className="py-2 px-4 border">Blood Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donorStockList && donorStockList.length > 0 ? (
            donorStockList.map((donorStock, index) => (
              <tr key={donorStock.donor_id || index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{donorStock.donor_name}</td>
                <td className="py-2 px-4 border">{donorStock.blood_group}</td>
                <td className="py-2 px-4 border">{donorStock.unit}</td>
                <td className="py-2 px-4 border">
                  {donorStock.blood_status !== null && donorStock.blood_status !== undefined ? (
                    donorStock.blood_status === 'safe' ? (
                      <span className="text-green-600">Safe</span>
                    ) : (
                      <span className="text-red-600">Unsafe</span>
                    )
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="py-2 px-4 border">
                  <button onClick={() => setSelectedDonorIndex(index)}>Check Blood</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No donor stock available</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedDonorIndex !== null && (
        <div>
          <h2>Check Blood Conditions for {donorStockList[selectedDonorIndex].donor_name}</h2>
          <form>
            <label>
              General Health:
              <select value={formValues.generalHealth} onChange={(e) => setFormValues({ ...formValues, generalHealth: e.target.value })}>
                <option value="good">Good</option>
              </select>
            </label>
            <label>
              Disqualifying Medications:
              <input
                type="text"
                value={formValues.disqualifyingMedications}
                onChange={(e) => setFormValues({ ...formValues, disqualifyingMedications: e.target.value })}
              />
            </label>

            <label>
              Recent Travel:
              <input
                type="text"
                value={formValues.recentTravel}
                onChange={(e) => setFormValues({ ...formValues, recentTravel: e.target.value })}
              />
            </label>

            <label>
              Recent Tattoos:
              <input
                type="text"
                value={formValues.recentTattoos}
                onChange={(e) => setFormValues({ ...formValues, recentTattoos: e.target.value })}
              />
            </label>

            <label>
              Recent Sexual Activity:
              <input
                type="text"
                value={formValues.recentSexualActivity}
                onChange={(e) => setFormValues({ ...formValues, recentSexualActivity: e.target.value })}
              />
            </label>

            <label>
              Drug Use:
              <input
                type="text"
                value={formValues.drugUse}
                onChange={(e) => setFormValues({ ...formValues, drugUse: e.target.value })}
              />
            </label>

            <button type="button" onClick={handleFormSubmit}>
              Submit
            </button>
          </form>
        </div>
      )}

      {bloodTestResult && (
        <div>
          <h2>Blood Test Result</h2>
          {bloodTestResult === 'safe' ? (
            <p>Blood is safe</p>
          ) : (
            <p>Blood is unsafe</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BloodTestForm;
