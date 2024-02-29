const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const authenticateToken = require('../authenticateToken');

const StaffLoginController = (db) => {
  const router = express.Router();

  // Protected route using JWT authentication middleware
  router.get('/protected-route', authenticateToken, (req, res) => {
    // This route is protected, and req.user contains the decoded user from the token
    res.json({ success: true, message: 'Access granted', user: req.user });
  });

  // Login route
  router.post('/Staff/login', async (req, res) => {
    const enteredUsername = req.body.stfUserName;
    const enteredPassword = req.body.stfPassword;

    try {
      // Use the provided MySQL connection
      db.query(
        'SELECT staff_id, password FROM stf_login WHERE userName = ?',
        [enteredUsername],
        (error, results) => {
          if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          // Handle the query results
          if (!results || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials: Staff not found' });
          }

          const storedPasswordHash = results[0].password;
          const staffId = results[0].staff_id;

          // Compare the provided password with the stored hashed password synchronously
          const passwordMatch = bcrypt.compareSync(enteredPassword, storedPasswordHash);

          if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials: Incorrect password' });
          }

          // If the credentials are valid, generate a JWT token
          
                const secretKey ='9d9d667f8473686b29d597dd83c49195e886231d61b51bed0067db2780b2ef78';
          if (!secretKey) {
            console.error('JWT secret key not found');
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
          }
          

          const token = jwt.sign({ staffId, enteredUsername }, secretKey, {
            expiresIn: '1w', // Token expiration time (adjust as needed)
          });

          // Send the token as part of the response
          res.status(200).json({ success: true, message: 'Login successful', token });
        }
      );
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  return router;
}

module.exports = StaffLoginController;
