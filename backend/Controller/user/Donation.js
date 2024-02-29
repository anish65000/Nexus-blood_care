const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

module.exports = function DonationController(app, db, authenticateToken) {
  // Donation endpoint with authentication
  app.post('/donation', authenticateToken, (req, res) => {
    
    const formattedDate = new Date().toLocaleString();
    // For example, you can insert donation details into the database
    // Assuming user_id is coming from the request or a user session
const { userId, bankId, name, age, gender, bloodGroup, units, disease, reason,  status } = req.body;

// Validate input parameters
if (!userId || !bankId || !name || !age || !gender || !bloodGroup || !units  || !disease || !reason || !status) {
  return res.status(400).json({ message: 'Missing required fields' });
}

// Check if the user_id exists in the user_details table
db.query('SELECT user_id FROM user_details WHERE user_id = ?', [userId], (selectErr, selectResults) => {
  if (selectErr) {
    console.error(selectErr);
    return res.status(500).send('Internal Server Error');
  }

  if (selectResults.length === 0) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  // User exists, proceed with the donation insertion
  db.query(
    'INSERT INTO blood_donations (user_id, bank_id, name, age, gender, disease, blood_group, units, reason, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, bankId, name, age, gender, disease, bloodGroup, units, reason, formattedDate, status],
    (err, insertResult) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const newDonationId = insertResult.insertId;

        const updateBloodBankQuery = `
        UPDATE blood_bank
        SET donations = JSON_ARRAY_APPEND(donations, '$', ?)
        WHERE id = ?
      `;
      
      db.query(updateBloodBankQuery, [newDonationId, bankId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(201).json({ message: 'Donation successful' });
        }
      });

      
      }
    }
  );
});


 app.get('/donations', authenticateToken, (req, res) => {
  // Perform database operation to fetch donation records
  db.query(
    'SELECT * FROM donations',
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    }
  );
});
})}
