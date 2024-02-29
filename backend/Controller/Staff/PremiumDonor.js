const multer = require('multer');
const path = require('path');

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


const upload = multer({ storage: storage });

const PremiumDonorController = (app, db) => {
  // Register a new premium donor
  app.post('/api/donors/register', upload.single('profilePicture'), async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      bloodType,
      latitude,
      longitude,
      age,
      address,
      phoneNumber,
      availabilityTime,
      DonorType,
      userUserName,
      userPassword,
    } = req.body;

    try {
      const sqlInsert = `
        INSERT INTO premium_donors (
          first_name,
          last_name,
          email,
          blood_type,
          latitude,
          longitude,
          age,
          address,
          phone_number,
          availability_time,
          profile_picture,
          donor_type,
          user_user_name,
          user_password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Use await to ensure the file upload is completed before continuing
      const [insertResult] = await db.promise().query(sqlInsert, [
        firstName,
        lastName,
        email,
        bloodType,
        latitude,
        longitude,
        age,
        address,
        phoneNumber,
        availabilityTime,
        req.file.filename,
        DonorType,
        userUserName,
        userPassword,
      ]);

      const PremiumDonorId = insertResult.insertId;
      console.log('New premium donor registered with ID:', PremiumDonorId);
      res.status(201).json({ message: 'Premium donor registered successfully', PremiumDonorId });
    } catch (error) {
      console.error('Error inserting premium donor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  // Get all premium donors
  app.get('/api/donors', async (req, res) => {
    try {
      const sqlSelect = 'SELECT * FROM premium_donors;';
      const [donors] = await db.promise().query(sqlSelect);
  
      // Append the full path to the profile picture in each donor object
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
// Get a premium donor by ID
app.get('/api/donors/:id', async (req, res) => {
  const donorId = req.params.id;

  try {
    const sqlSelectById = 'SELECT * FROM premium_donors WHERE premium_donor_id  = ?;';
    const [donors] = await db.promise().query(sqlSelectById, [donorId]);

    if (donors.length === 0) {
      res.status(404).json({ message: 'Premium donor not found' });
    } else {
      const donorWithImagePath = {
        ...donors[0],
        profile_picture: `/profile-pictures/${donors[0].profile_picture}`,
      };
      res.json(donorWithImagePath);
    }
  } catch (error) {
    console.error('Error fetching premium donor by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a premium donor by ID
app.delete('/api/donors/:id', async (req, res) => {
  const donorId = req.params.id;

  try {
    const sqlDeleteById = 'DELETE FROM premium_donors WHERE premium_donor_id = ?;';
    const [deleteResult] = await db.promise().query(sqlDeleteById, [donorId]);

    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ message: 'Premium donor not found' });
    } else {
      res.json({ message: 'Premium donor deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting premium donor by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  
}  
module.exports = PremiumDonorController;
