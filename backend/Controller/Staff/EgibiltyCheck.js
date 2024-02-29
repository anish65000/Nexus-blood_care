const checkCompatibility = (req, res, db) => { // <-- Add db as parameter
  const { donorType, recipientType, donorAge, recipientAge } = req.body;

  // Logic to check compatibility
  let compatible = false;

  // Blood type compatibility
  if (recipientType === 'O-' && donorType === 'O-') {
      compatible = true;
  } else if (recipientType === 'O' && donorType === 'O+') {
      compatible = true;
  } else if (recipientType === donorType) {
      compatible = true;
  } else if (recipientType === 'B-' && (donorType === 'B-' || donorType === 'O-')) {
      compatible = true;
  } else if (recipientType === 'B+' && (donorType === 'B+' || donorType === 'B-' || donorType === 'O+' || donorType === 'O-')) {
      compatible = true;
  } else if (recipientType === 'A-' && (donorType === 'A-' || donorType === 'O-')) {
      compatible = true;
  } else if (recipientType === 'A+' && (donorType === 'A+' || donorType === 'A-' || donorType === 'O+' || donorType === 'O-')) {
      compatible = true;
  } else if (recipientType === 'AB-' && (donorType === 'A-' || donorType === 'B-' || donorType === 'AB-' || donorType === 'O-')) {
      compatible = true;
  } else if (recipientType === 'AB+' && (donorType === 'AB-' || donorType === 'AB+' || donorType === 'A-' || donorType === 'A+' || donorType === 'O+' || donorType === 'O-' || donorType === 'B+' || donorType === 'B-')) {
      compatible = true;
  }

  // Age-based eligibility
  if (compatible && (donorAge < 18 || donorAge > 65)) {
      compatible = false; // Donor age is not within the eligible range
  }

  if (compatible && (recipientAge < 18 || recipientAge > 65)) {
      compatible = false; // Recipient age is not within the eligible range
  }

  if (compatible) {
      const query = 'SELECT blood_group, total_unit, current_stock, blood_status FROM blood_inventory WHERE blood_group = ?';
      db.query(query, [donorType], (error, results, fields) => {
          if (error) {
              console.error('Error executing query:', error);
              res.status(500).send('Internal Server Error');
              return;
          }

          if (results.length === 0) {
              res.json({ error: "Blood group not found in inventory" });
          } else {
              res.json(results[0]);
          }
      });
  } else {
      res.json({ compatible });
  }
};

module.exports = (app, db) => {
  app.post('/staff/checkCompatibility', (req, res) => checkCompatibility(req, res, db));
};
