const multer = require('multer');
const path = require('path');
const Donation = require('./Donation');

// Set up storage for multer
console.log('Current working directory:', process.cwd());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profile-pictures');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const generatedFilename = file.fieldname + '-' + uniqueSuffix + fileExtension;
    console.log('Generated filename:', generatedFilename);
    cb(null, generatedFilename);
  }
});

// Assuming you are using MySQL as the database
const upload = multer({ storage: storage });

// Assuming you have the executeQuery function as mentioned above
const PremiumDonorController = (app, db) => {
  // Assuming you are using MySQL as the database
  const util = require('util');
  const query = util.promisify(db.query).bind(db);

  // Example usage:
  async function executeQuery(sql, values) {
    try {
      const result = await query(sql, values);
      return { success: true, result };
    } catch (error) {
      console.error('Error executing query:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Register a new premium donor
  app.post('/api/donors/register', upload.single('profilePicture'), async (req, res) => {
    const {
      userName,
      userId,
      latitude,
      longitude,
      availabilityTime,
      donorhealth,
      previousdontaion,
      DonorType,
    } = req.body;

    try {
      // Check if the provided username and user_id match an existing donor with userRole set to "donor"
      const existingDonor = await executeQuery(
        'SELECT * FROM user_details WHERE userName = ? AND id = ? AND userRole = "Donor"',
        [userName, userId]
      );

      if (existingDonor.result.length === 0) {
        return res.status(400).json({ message: 'User with the provided username and user_id is not an existing donor' });
      }

      // Proceed with premium donor registration logic here...
      const sqlInsert = `
        INSERT INTO premium_donors (
          user_id,
          latitude,
          longitude,
          availability_time,
          donor_health,
          previous_dontaion,
          profile_picture,
          donor_type
        )
        VALUES (?,?,?, ?,?, ?,  ?, ?);
      `;

      // Use await to ensure the file upload is completed before continuing
      const { success, result, error } = await executeQuery(sqlInsert, [
        existingDonor.result[0].id,
        
        latitude,
        longitude,
        availabilityTime,
        donorhealth,
        previousdontaion,
        req.file.filename,
        DonorType,
      ]);

      if (!success) {
        console.error('Error inserting premium donor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      const premiumDonorId = result && result.insertId;
      console.log('New premium donor registered with ID:', premiumDonorId);
      res.status(201).json({ message: 'Premium donor registered successfully', premiumDonorId });
    } catch (error) {
      console.error('Error handling premium donor registration:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Get all premium donors
  app.get('/api/donors', async (req, res) => {
    try {
      const sqlSelect = 'SELECT pd.*, ud.userAge, ud.userGender, ud.userBloodGroup, ud.userPhone, ud.userEmail, ud.userAddress FROM premium_donors pd JOIN user_details ud ON pd.user_id = ud.id;';
      const [donors] = await db.promise().query(sqlSelect);

      // Append the full path to the profile picture in each donor objectS
      const donorsWithImagePath = donors.map(donor => ({
        ...donor,
        profile_picture: `/profile-pictures/${donor.profile_picture}`,
      }));

      res.json(donorsWithImagePath);
    } catch (error) {
      console.error('Error fetching all premium donors:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Get a premium donor by ID with user details
  app.get('/api/donors/:id', async (req, res) => {
    const donorId = req.params.id;

    try {
      const sqlSelectById = `
        SELECT pd.*, ud.*
        FROM premium_donors pd
        JOIN user_details ud ON pd.user_id = ud.id
        WHERE pd.premium_donor_id = ?;
      `;
      const [donors] = await db.promise().query(sqlSelectById, [donorId]);

      if (donors.length === 0) {
        res.status(404).json({ message: 'Premium donor not found' });
      } else {
        const donorWithDetails = {
          premium_donor: {
            ...donors[0],
            profile_picture: `/profile-pictures/${donors[0].profile_picture}`,
          },
      
        };
        res.json(donorWithDetails);
      }
    } catch (error) {
      console.error('Error fetching premium donor by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  // Update a premium donor by ID
  app.put('/api/updatedonors/:id', upload.single('profilePicture'), async (req, res) => {
    const donorId = req.params.id;
    const {
      latitude,
      longitude,
      availabilityTime,
      donorType,
    } = req.body;

    try {
      let updateFields = '';
      let updateValues = [];

      if (latitude) {
        updateFields += 'latitude = ?, ';
        updateValues.push(latitude);
      }

      if (longitude) {
        updateFields += 'longitude = ?, ';
        updateValues.push(longitude);
      }

      if (availabilityTime) {
        updateFields += 'availability_time = ?, ';
        updateValues.push(availabilityTime);
      }

      if (req.file) {
        updateFields += 'profile_picture = ?, ';
        updateValues.push(req.file.filename);
      }

      if (donorType) {
        updateFields += 'donor_type = ?, ';
        updateValues.push(donorType);
      }

      if (donorhealth) {
        updateFields += 'donor_heath = ?, ';
        updateValues.push(donorhealth);
      }

      if (Donation) {
        updateFields += 'donor_heath = ?, ';
        updateValues.push(donorhealth);
      }




      // Remove the trailing comma and space from updateFields
      updateFields = updateFields.slice(0, -2);

      const sqlUpdate = `UPDATE premium_donors SET ${updateFields} WHERE premium_donor_id = ?;`;
      const [updateResult] = await db.promise().query(sqlUpdate, [...updateValues, donorId]);

      if (updateResult.affectedRows === 0) {
        res.status(404).json({ message: 'Premium donor not found' });
      } else {
        res.json({ message: 'Premium donor updated successfully' });
      }
    } catch (error) {
      console.error('Error updating premium donor by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Example endpoint to get premium donors' locations with additional user details
app.get('/api/premium-donors/locations', async (req, res) => {
  try {
    const sqlSelectLocations = `
      SELECT pd.premium_donor_id , pd.latitude, pd.longitude, ud.userName, ud.userPhone
      FROM premium_donors pd
      JOIN user_details ud ON pd.user_id = ud.id;
    `;
    const [locations] = await db.promise().query(sqlSelectLocations);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching premium donors locations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
  


}

module.exports = PremiumDonorController;
