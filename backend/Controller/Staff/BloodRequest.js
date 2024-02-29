const BloodRequestController = (app, db) => {
  app.post("/login/stf/request", async (req, res) => {
    const { bloodGroup, unit, patientName, patientAddress, patientContact } = req.body;

    if (!bloodGroup || !unit || !patientName || !patientAddress || !patientContact) {
      return res.status(400).send({ message: "Invalid request. Missing required fields." });
    }

    try {
      const connection = await db.promise();
      await connection.beginTransaction();

      try {
        const [bloodInventory] = await connection.execute('SELECT * FROM blood_inventory WHERE blood_group = ?', [bloodGroup]);

        if (bloodInventory.length > 0 && unit <= bloodInventory[0].current_stock) {
          await connection.execute('UPDATE blood_inventory SET current_stock = current_stock - ? WHERE blood_group = ?', [unit, bloodGroup]);

          await connection.execute('INSERT INTO blood_request (blood_group, unit, patient_name, patient_address, patient_contact) VALUES (?, ?, ?, ?, ?)', [bloodGroup, unit, patientName, patientAddress, patientContact]);

          await connection.commit();

          if (!res.headersSent) {
            res.send({ message: "REQUEST ACCEPTED. COLLECT IT FROM THE BLOOD BANK" });
          }
        } else {
          if (!res.headersSent) {
            res.send({ message: "INSUFFICIENT STOCKS!" });
          }
        }
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error processing blood request:", error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    }
  });


  app.get('/login/stf/requests', async (req, res) => {
    try {
      const connection = await db.promise();
      const [bloodRequests] = await connection.execute('SELECT * FROM blood_request');
      res.send(bloodRequests);
    } catch (error) {
      console.error("Error retrieving blood requests:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.delete('/login/stf/request/:requestId', async (req, res) => {
    const requestId = req.params.requestId;

    try {
      const connection = await db.promise(); // Use the promise() method to convert it into a promise-based connection
      await connection.beginTransaction();

      try {
        const [existingRequest] = await connection.execute('SELECT * FROM blood_request WHERE request_id = ?', [requestId]);

        if (existingRequest.length === 0) {
          res.status(404).send({ message: "Blood request not found." });
          return;
        }

        await connection.execute('UPDATE blood_inventory SET current_stock = current_stock + ? WHERE blood_group = ?', [existingRequest[0].unit, existingRequest[0].blood_group]);

        await connection.execute('DELETE FROM blood_request WHERE request_id = ?', [requestId]);

        await connection.commit();

        if (!res.headersSent) {
          res.send({ message: "Blood request canceled successfully." });
        }
      } catch (error) {
        await connection.rollback();
        console.error("Error canceling blood request:", error);
        if (!res.headersSent) {
          res.status(500).send("Internal Server Error");
        }
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error canceling blood request:", error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    }
  });

};

module.exports = BloodRequestController;
