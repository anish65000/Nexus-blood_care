const handleAppointmentController = (app, db) => {


  app.get('/donor/available-slots', async (req, res) => {
    try {
      const currentTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Format date for SQL
  
      // Use the single connection to execute the query
      db.query(
        'SELECT time_slot_id, stf_id, stf_staff_type, slot_time FROM time_slots ',
        [currentTime],
        (err, donorRows) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
  
          res.json(donorRows);
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

    app.post('/book-appointment', async (req, res) => {
      try {
        const { doc_id, user_id, user_name, slot_time } = req.body;
  
        // Check if the staff member is a doctor
        const [staffType] = await db.promise().query(
          'SELECT stf_staff_type FROM time_slots WHERE stf_id = ?',
          [doc_id]
        );
  
        if (staffType && staffType.length > 0 && staffType[0].stf_staff_type === 'doctor') {
          // Check appointment availability
          const [existingAppointment] = await db.promise().query(
            'SELECT APPOINTMENT_ID FROM appointments WHERE doc_id = ? AND slot_time = ?',
            [doc_id, slot_time]
          );
  
          if (existingAppointment && existingAppointment.length > 0 && existingAppointment[0].APPOINTMENT_ID) {
            res.json({ message: "Sorry, the slot is not available." });
          } else {
            // Insert the appointment details with USER_ID and USER_NAME
            await db.promise().query(
              'INSERT INTO appointments (doc_id, user_id, user_name, slot_time) VALUES (?, ?, ?, ?)',
              [doc_id, user_id, user_name, slot_time]
            );
  
            res.json({ message: 'Appointment booked successfully!' });
          }
        } else {
          res.status(403).json({ message: "Staff member is not a doctor" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    app.get('/appointments/:patientId', async (req, res) => {
      try {
        const patientId = req.params.patientId;
    
        // Retrieve appointments for the given patient from confirmedappointments table
        const [appointments] = await db.promise().query(
          'SELECT stf_details.stfName AS doctor_name, confirmedappointments.slot_time AS time ' +
          'FROM confirmedappointments ' +
          'JOIN stf_details ON confirmedappointments.stf_id = stf_details.stf_id ' +
          'WHERE confirmedappointments.user_id = ?',
          [patientId]
        );
    
        res.json(appointments);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    app.post('/provide-feedback', async (req, res) => {
      try {
        const { pat_id, doc_id, doc_name, remark } = req.body;
    
        // Assuming 'db' is a valid connection to your database
    
        // Insert feedback into the 'feedback' table
        await db.promise().insert({
          PATIENT_ID: pat_id,
          DOC_ID: doc_id,
          DOC_NAME: doc_name,
          REMARK: remark
        }).into('feedback');
    
        res.json('Saved');
      } catch (error) {
        console.error(error);
        res.status(500).json('Error saving feedback');
      }
    });
    

    
    
  
  }
  
  module.exports = handleAppointmentController;
  