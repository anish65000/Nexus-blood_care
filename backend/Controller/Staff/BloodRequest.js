const authenticateToken = require('../authenticateToken');

const BloodRequestController = (app, db) => {
  // Apply authentication middleware to the blood donation request route
  app.post("/login/stf/request", authenticateToken, async (req, res) => {
    const { bloodGroup, unit, patientName, patientAddress, patientContact } = req.body;

    if (!bloodGroup || !unit || !patientName || !patientAddress || !patientContact) {
      return res.status(400).send({ message: "Invalid request. Missing required fields." });
    }

    try {
      // Ensure req.userId is defined after authentication middleware
      if (!req.user || !req.user.userId) {
        return res.status(401).send({ message: "Unauthorized. Missing user ID." });
      }

      const connection = await db.promise();
      await connection.beginTransaction();

      try {
        // Assuming user details are stored in the user_details table
        console.log("req.user.userId:", req.user.userId);
        const [userDetails] = await connection.execute('SELECT userRole FROM user_details WHERE Id = ?', [req.user.userId]);

        if (userDetails.length > 0 && userDetails[0].userRole === 'Recipient') {
          const [bloodInventory] = await connection.execute('SELECT * FROM blood_inventory WHERE blood_group = ?', [bloodGroup]);

          if (bloodInventory.length > 0 && unit <= bloodInventory[0].current_stock) {
            await connection.execute('UPDATE blood_inventory SET current_stock = current_stock - ? WHERE blood_group = ?', [unit, bloodGroup]);

            console.log("Inserting into blood_request table with values:", [bloodGroup, unit, patientName, patientAddress, patientContact]);

            // Ensure all parameters are defined before executing the query
            const params = [bloodGroup, unit, patientName, patientAddress, patientContact];
            if (params.some(param => param === undefined)) {
              return res.status(400).send({ message: "Invalid request. Missing required fields." });
            }

            await connection.execute('INSERT INTO blood_request (blood_group, unit, patient_name, patient_address, patient_contact) VALUES (?, ?, ?, ?, ?)', params);

            await connection.commit();

            if (!res.headersSent) {
              res.send({ message: "REQUEST ACCEPTED. COLLECT IT FROM THE BLOOD BANK" });
            }
          } else {
            if (!res.headersSent) {
              res.send({ message: "INSUFFICIENT STOCKS!" });
            }
          }
        } else {
          if (!res.headersSent) {
            res.status(403).send({ message: "Permission denied. User is not a recipient." });
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
};

module.exports = BloodRequestController;
