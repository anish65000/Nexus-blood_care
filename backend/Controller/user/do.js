// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql');

// const app = express();
// const port = 3001;

// app.use(bodyParser.json());
// app.use(cors());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'your_mysql_username',
//   password: 'your_mysql_password',
//   database: 'blood_donation',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//   } else {
//     console.log('Connected to MySQL database');
//   }
// });

// // Update donation status
// app.put("/donations", async (req, res) => {
//   try {
//     const { id, status } = req.body;
//     const updateQuery = 'UPDATE donations SET status = ? WHERE id = ?';
    
//     db.query(updateQuery, [status, id], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error updating donation status");
//       } else {
//         res.status(200).send("Status updated");
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send();
//   }
// });

// // Get donations for a specific blood bank
// app.get("/donations", async (req, res) => {
//   try {
//     const selectQuery = 'SELECT * FROM donations WHERE bankId = ?';
//     db.query(selectQuery, [req.user], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error fetching donations");
//       } else {
//         res.json(result);
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send();
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
