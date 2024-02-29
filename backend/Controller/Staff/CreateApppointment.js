// Your existing code for the BookAppointmentController
const BookAppointmentController = (app, db) => {
   // Endpoint to handle adding available slots
   app.post('/stf/available-slots', async (req, res) => {
    const { stf_id, slot_times } = req.body;

    try {
      // Ensure that slot_times is defined and is an array
      if (!Array.isArray(slot_times)) {
        return res.status(400).json({ error: 'Invalid or missing slot_times array in the request body.' });
      }

      // Query the stf_details table to get the staff type
      const [row] = await db.promise().query('SELECT stfStaffType FROM stf_details WHERE stf_id = ?', [stf_id]);

      if (!row || !row.length) {
        return res.status(404).json({ error: 'STF ID not found in stf_details table.' });
      }

      const stf_staff_type = row[0].stfStaffType;

      // Ensure that stf_staff_type is "doctor" 
      if (stf_staff_type !== 'doctor') {
        return res.status(400).json({ error: 'Invalid STF Staff Type. Only "doctor" is allowed.' });
      }

      // Insert the time slots for donation
      const values = slot_times.map(slot_time => [stf_id, stf_staff_type, slot_time]);
      await db.promise().query('INSERT INTO time_slots (stf_id, stf_staff_type, slot_time) VALUES ?', [values]);

      // Log success message to the console
      console.log('Time slots added successfully.');

      // Send success response with custom message
      res.json({ success: true, message: 'Time added successfully' });

      // Notify clients about new time slots
      io.emit('newTimeSlots', { stf_id, slot_times }); // Broadcasting to all connected clients
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to handle confirming appointments
  app.post('/confirm-booking', async (req, res) => {
    try {
      const { doc_id, userId, slot_time } = req.body;

      // Check if the staff member is a doctor
      const [staffType] = await db.promise().query(
        'SELECT stf_staff_type FROM time_slots WHERE stf_id = ?',
        [doc_id]
      );

      if (staffType && staffType.length > 0 && staffType[0].stf_staff_type === 'doctor') {
        // Retrieve appointment details for the specified doctor, user, date, and slot_time
        const [appointmentDetails] = await db.promise().query(
          'SELECT appointments.DOC_ID, appointments.user_id, user_details.userName, user_details.userAge, user_details.userPhone, appointments.slot_time ' +
          'FROM appointments ' +
          'INNER JOIN user_details ON appointments.user_id = user_details.user_id ' +
          'WHERE appointments.DOC_ID = ? AND appointments.slot_time = ? AND appointments.user_id = ?',
          [doc_id, slot_time, userId]
        );

        // Check if the appointment details are found
        if (appointmentDetails && appointmentDetails.length > 0) {
          // Check if the appointment already exists in the 'confirmedappointments' table
          const [existingConfirmedAppointment] = await db.promise().query(
            'SELECT confirmed_appointment_id FROM confirmedappointments WHERE stf_id = ? AND user_id = ? AND slot_time = ?',
            [appointmentDetails[0].DOC_ID, appointmentDetails[0].user_id, appointmentDetails[0].slot_time]
          );

          if (existingConfirmedAppointment && existingConfirmedAppointment.length > 0) {
            // Respond with a message indicating that the appointment is already confirmed
            res.json({ message: "Appointment already confirmed" });
          } else {
            // Insert the appointment details into the 'confirmedappointments' table
            await db.promise().query(
              'INSERT INTO confirmedappointments (stf_id, user_id, user_name, user_age, user_phone, slot_time) VALUES (?, ?, ?, ?, ?, ?)',
              [appointmentDetails[0].DOC_ID, appointmentDetails[0].user_id, appointmentDetails[0].userName, appointmentDetails[0].userAge, appointmentDetails[0].userPhone, appointmentDetails[0].slot_time]
            );

            // Respond with a success message
            res.json({ message: "Appointment Confirmed" });

            // Notify clients about the new confirmed appointment
            io.emit('appointmentConfirmed', { stf_id: appointmentDetails[0].DOC_ID, user_id: appointmentDetails[0].user_id, slot_time: appointmentDetails[0].slot_time });
          }
        } else {
          // Respond with a not found message if the appointment details are not found
          res.status(404).json({ message: "Appointment not found" });
        }
      } else {
        // Respond with a forbidden status if the staff member is not a doctor
        res.status(403).json({ message: "Staff member is not a doctor" });
      }
    } catch (err) {
      // Log any errors and respond with a server error message
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
app.get('/get-appointment/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    // Retrieve appointment details based on the appointmentId
    const [appointmentDetails] = await db.promise().query(
      'SELECT * FROM appointments WHERE APPOINTMENT_ID = ?',
      [appointmentId]
    );

    if (appointmentDetails && appointmentDetails.length > 0) {
      // Respond with the appointment details
      res.json({ appointment: appointmentDetails[0] });
    } else {
      // Respond with a not found message if the appointment is not found
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/get-appointments', async (req, res) => {
  try {
    // Retrieve all appointment details
    const [appointments] = await db.promise().query(
      'SELECT * FROM appointments'
    );

    if (appointments && appointments.length > 0) {
      // Respond with the list of all appointments
      res.json({ appointments });
    } else {
      // Respond with a not found message if there are no appointments
      res.status(404).json({ message: "No appointments found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/blooddonated', async (req, res) => {
  try {
    const { doc_id, userId,  slot_time } = req.body;

    // Check if the staff member is a doctor
    const [staffType] = await db.promise().query(
      'SELECT stfStaffType FROM stf_details WHERE stf_id = ?',
      [doc_id]
    );

    if (staffType.length > 0 && staffType[0].stfStaffType === 'doctor') {
      // Retrieve appointment details from confirmedappointments
      const [appointmentDetails] = await db.promise().query(
        'SELECT stf_id, user_id, user_name, user_age, user_phone, slot_time ' +
        'FROM confirmedappointments ' +
        'WHERE stf_id = ? AND user_id = ? AND slot_time = ?',
        [doc_id, userId, slot_time]
      );
      
      
      

      if (appointmentDetails.length > 0) {
        // Begin transaction
        await db.promise().beginTransaction();

        try {
          // Insert into history
          await db.promise().query(
            'INSERT INTO history (DOC_ID, userId, USER_NAME, USER_AGE, USER_PHONE, slot_time) VALUES (?, ?, ?, ?, ?,  ?)',
            [appointmentDetails[0].DOC_ID, appointmentDetails[0].USER_ID, appointmentDetails[0].USER_NAME, appointmentDetails[0].USER_AGE, appointmentDetails[0].USER_PHONE, appointmentDetails[0].slot_time]
          );

         
        

          // Commit transaction
          await db.promise().commit();

          res.json({ message: "Person has donated blood" });
        } catch (error) {
          // Rollback transaction on error
          await db.promise().rollback();
          throw error; // Rethrow the error for global error handling
        }
      } else {
        res.status(404).json({ message: "Appointment not found in confirmedappointments" });
      }
    } else {
      res.status(403).json({ message: "Staff member is not a doctor" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/get-feedbacks/:doc_id', async (req, res) => {
  try {
    const { doc_id } = req.params;


    // Select all feedbacks corresponding to the given doc_id
    const feeds = await db.promise().select('REMARK').from('feedback').where({ DOC_ID: doc_id });

    if (feeds.length) {
      res.json(feeds);
    } else {
      res.json("NO");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Error fetching feedbacks');
  }
});




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


  
  
}


module.exports = BookAppointmentController;
