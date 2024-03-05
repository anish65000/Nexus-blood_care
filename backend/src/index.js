const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
// const userLoginController= require('../Controller/user/UserLoginController');
const authenticateToken = require('../Controller/authenticateToken');
const UserRegisterController = require('../Controller/user/UserRegisterController');
const EligibilityController = require('../Controller/Staff/EgibiltyCheck'); // Adjusted import
const DonorInventoryController = require('../Controller/Staff/DonorInventoryController');
const BloodStockController = require('../Controller/Staff/BloodStockControllers');
const BloodRequestController = require('../Controller/Staff/BloodRequest');
const DonationController = require('../Controller/user/Donation');
const userLoginController = require('../Controller/user/UserLoginController');
const BloodbankController = require('../Controller/Admin/RegisterBloodBankController');
const campController = require('../Controller/Staff/CampController');
const BookAppointmentController = require('../Controller/Staff/CreateApppointment');
const handleAppointmentController  = require('../Controller/user/PerformAppController')
const PremiumDonorController = require('../Controller/user/PremiumDonor')
const BloodDonationController = require('../Controller/Staff/BloodDonationController')
const StaffRegisterController = require('../Controller/Staff/StaffRegisterController');
const StaffLoginController = require('../Controller/Staff/StaffLoginController');

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/protected-route', authenticateToken);
app.use('/profile-pictures', express.static('public/profile-pictures'));


// Enable CORS
app.use(cors());


const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'fyp',
  connectTimeout: 60000,
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Perform your database operations here...

// Close the connection when done (optional)



// Register User Controller
UserRegisterController(app,db);
userLoginController(app, db);
EligibilityController(app, db); // Adjusted registration
DonorInventoryController(app, db);
BloodRequestController(app, db,authenticateToken);
DonationController(app, db, authenticateToken);
userLoginController(app, db);
BloodbankController(app, db);
campController(app,db);
BookAppointmentController(app,db);
handleAppointmentController(app,db);
PremiumDonorController(app,db);
BloodDonationController(app,db);
BloodStockController(app,db);
StaffRegisterController(app,db);
app.use('/', StaffLoginController(db));
app.use('/', userLoginController(db)); 


// Endpoint to get nearby donors
// Endpoint to get nearby donors
app.get('/api/donors/nearbys', (req, res) => {
  const { latitude, longitude } = req.query;

  // SQL query to select nearby donors based on latitude and longitude
  const sqlQuery = `
  SELECT pd.*, ud.*
  FROM premium_donors pd
  JOIN user_details ud ON pd.user_id = ud.id
  WHERE
      pd.latitude BETWEEN ? - 0.0001 AND ? + 0.0001
      AND pd.longitude BETWEEN ? - 0.0001 AND ? + 0.0001
  
  `;
  const params = [latitude, longitude];

  // Execute the SQL query
  db.query(sqlQuery, params, (error, results) => {
    if (error) {
      console.error('Error fetching nearby donors:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});





// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
