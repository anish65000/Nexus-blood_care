const DonorInventoryController = (app, db) => {
  // Get all donor stocks
  app.get("/login/stf/ds", (req, res) => {
    const sqlSelect = "SELECT * FROM donor_inventory;";

    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    });
  });

  // Update donor stocks units and new field
  app.put("/login/stf/ds/update", (req, res) => {
    const { donor_id, age, address, blood_group, unitUpdate, donor_name, donation_time } = req.body;
    const sqlUpdate = "UPDATE donor_inventory SET name=?, blood_group=?, unit=?, age=?, address=?, donor_name=?, donation_time=?, blood_status=? WHERE donor_id= ?;";

    db.query(sqlUpdate, [age, address, blood_group, unitUpdate, donor_name, donation_time, donor_id], (err, result) => {
      if (err) {
        console.log("**ERROR IN UPDATING BLOOD STOCK**" + err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    });
  });

  // Insert new donor stocks
  app.post("/login/stf/ds/insert", (req, res) => {
    try {
      const { blood_group, unit, age, address, donor_name, donation_time } = req.body;

      if (!blood_group || !unit || !age || !address || !donor_name || !donation_time) {
        return res.status(400).send({ message: "All fields are required." });
      }

      const sqlInsert = "INSERT INTO donor_inventory (blood_group, unit, age, address, donor_name, donation_time) VALUES (?, ?, ?, ?, ?, ?);";

      db.query(sqlInsert, [blood_group, unit, age, address, donor_name, donation_time], (err, result) => {
        if (err) {
          console.error('Error in inserting blood stock:', err);
          res.status(500).send("Internal Server Error");
        } else {
          const donorId = result.insertId;
          console.log('Blood stock inserted successfully with ID:', donorId);

          // Include the donor ID and success message in the response
          res.json({ message: 'Blood stock inserted successfully', donorId });
        }
      });
    } catch (error) {
      console.error("Error during blood stock insertion:", error);
      res.status(400).send({ message: "ERROR IN BLOOD STOCK INSERTION!" });
    }
  });

  // Test blood endpoint
  app.post("/login/stf/ds/test-blood/:id", (req, res) => {
    const { donorId, generalHealth, disqualifyingMedications, recentTravel, recentTattoos, recentSexualActivity, drugUse } = req.body;
    const donor_id = req.params.id;

    const sqlTest = "SELECT * FROM donor_inventory WHERE donor_id = ?;";
    db.query(sqlTest, [donor_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if donor exists
        if (results.length === 0) {
            console.log('Donor not found');
            return res.status(404).json({ error: 'Donor not found' });
        }

        const donor = results[0];

        // Check blood safety conditions
        const conditionsMatch =
            donor.general_health === generalHealth &&
            donor.disqualifying_medications === disqualifyingMedications &&
            donor.recent_travel === recentTravel &&
            donor.recent_tattoos === recentTattoos &&
            donor.recent_sexual_activity === recentSexualActivity &&
            donor.drug_use === drugUse;

        const bloodTestResult = conditionsMatch ? 'safe' : 'unsafe';

        console.log(`Blood test result: ${bloodTestResult}`);

        // Update donor's health conditions and blood test result in the database
        const updateQuery = `
            UPDATE donor_inventory
            SET
                general_health = ?,
                disqualifying_medications = ?,
                recent_travel = ?,
                recent_tattoos = ?,
                recent_sexual_activity = ?,
                drug_use = ?,
                blood_test_result = ?
            WHERE donor_id = ?;
        `;

        db.query(updateQuery, [generalHealth, disqualifyingMedications, recentTravel, recentTattoos, recentSexualActivity, drugUse, bloodTestResult, donorId], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating donor health conditions:', updateErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (conditionsMatch) {
                return res.json({ result: 'safe', message: 'Blood is safe', donorId, donor });
            } else {
                console.log('Blood test result: Unsafe');
                return res.json({ result: 'unsafe', message: 'Blood is unsafe', donorId, donor });
            }
        });
    });
});

  
  // Delete donor stocks
  app.delete("/login/stf/ds/delete/:id", (req, res) => {
    const donor_id = req.params.id;
    const sqlDelete = "DELETE FROM donor_inventory WHERE donor_id = ?;";

    db.query(sqlDelete, [donor_id], (err, result) => {
      if (err) {
        console.log("**ERROR IN DELETING BLOOD STOCK**" + err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    });
  });
};
module.exports = DonorInventoryController;



