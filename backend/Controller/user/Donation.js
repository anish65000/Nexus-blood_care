const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

module.exports = function DonationController(app, db, authenticateToken) {
  // Donation endpoint with authentication
  app.post('/donation', authenticateToken, async (req, res) => {
    const formattedDate = new Date().toLocaleString();
  
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
  
      if (userDetails.length > 0 && userDetails[0].userRole === 'Donor') {
        // Destructuring request body
        const { bankId, name, age, gender, bloodGroup, units, disease, reason, status } = req.body;
  
        // Validate input parameters
        if (!bankId || !name || !age || !gender || !bloodGroup || !units || !disease || !reason || !status) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
  
        // User exists and is a donor, proceed with the donation insertion
        const [insertResult] = await connection.execute(
          'INSERT INTO blood_donations (bank_id, name, age, gender, disease, blood_group, units, reason, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [bankId, name, age, gender, disease, bloodGroup, units, reason, formattedDate, status]
        );
  
        const newDonationId = insertResult.insertId;
  
        // Update the blood bank with the new donation
        const updateBloodBankQuery = `
          UPDATE blood_bank
          SET donations = JSON_ARRAY_APPEND(donations, '$', ?)
          WHERE id = ?
        `;
  
        await connection.execute(updateBloodBankQuery, [newDonationId, bankId]);
  
        await connection.commit();
  
        res.status(201).json({ message: 'Donation successful' });
      } else {
        // User is not authorized to make donations
        res.status(403).send({ message: "Permission denied. User is not a donor." });
      }
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Remove the following line
      // await connection.release();
    }
  });

  
};
