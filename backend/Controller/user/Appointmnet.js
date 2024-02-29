const AppointmentController = (app, db) => {

  
  
    app.get('/available-time-slots', async (req, res) => {
      const { doc_id, date } = req.query;
      const allTimes = ['09:00:00', '10:00:00', '11:00:00', '12:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00'];
      let available = [], ntAvailable = [];
  
      try {
        // Check if the staff member is a doctor
        const staffTypeResult = await db.query(
          'SELECT stfStaffType FROM stf_details WHERE stf_id = ?',
          [doc_id]
        );
  
        const [staffType] = staffTypeResult[0];
  
        if (staffType && staffType.stfStaffType === 'doctor') {
          // Retrieve appointment details for the specified doctor, user, date, and time
          const appointmentDetailsResult = await db.query(
            'SELECT user_details.user_id, user_details.userName, user_details.userAge, user_details.userPhone, DATE, TIME ' +
            'FROM user_details ' +
            'INNER JOIN appointments ON user_details.user_id = appointments.user_id ' +
            'WHERE DOC_ID = ? AND DATE = ? AND user_details.user_id = ?',
            [doc_id, date, userId]
          );
  
          const [appointmentDetails] = appointmentDetailsResult[0];
  
          // Retrieve not available time slots
          const notAvailableResult = await db.query(
            'SELECT TIME FROM appointments WHERE DATE = ? AND DOC_ID = ? ' +
            'UNION ' +
            'SELECT TIME FROM confirmedappointments WHERE DATE = ? AND DOC_ID = ?',
            [date, doc_id, date, doc_id]
          );
  
          const [notAvailable] = notAvailableResult[0];
  
          for (let i = 0; i < notAvailable.length; i++) {
            ntAvailable.push(notAvailable[i].TIME);
          }
  
          // Filter available time slots
          available = allTimes.filter(x => !ntAvailable.includes(x));
  
          if (available.length) {
            res.json(available);
          } else {
            res.json("NA");
          }
        } else {
          res.status(403).json({ message: "Staff member is not a doctor" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  
    app.post('/book-appointment', async (req, res) => {
      try {
        const { doc_id, user_id, user_name, date, time } = req.body;
  
        // Check if the staff member is a doctor
        const staffTypeResult = await db.query(
          'SELECT stfStaffType FROM stf_details WHERE stf_id = ?',
          [doc_id]
        );
  
        const [staffType] = staffTypeResult[0];
  
        if (staffType && staffType.stfStaffType === 'doctor') {
          // Continue with the existing code for checking appointment availability
          const dataResult = await db.query(
            'SELECT * FROM appointments WHERE DOC_ID = ? AND TIME = ?',
            [doc_id, time]
          );
  
          const [data] = dataResult[0];
  
          if (data.length > 0) {
            res.json("sorry slot not available");
          } else {
            // Insert the appointment details with USER_ID and USER_NAME
            await db.query(
              'INSERT INTO appointments (DOC_ID, USER_ID, USER_NAME, DATE, TIME) VALUES (?, ?, ?, ?, ?)',
              [doc_id, user_id, user_name, date, time]
            );
  
            res.json('Booked!');
          }
        } else {
          res.status(403).json({ message: "Staff member is not a doctor" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  
    app.get('/get-staff-appointments/:doc_id', async (req, res) => {
      try {
        const { doc_id } = req.params;
  
        // Check if the staff member is a doctor
        const staffTypeResult = await db.query(
          'SELECT stfStaffType FROM stf_details WHERE stf_id = ?',
          [doc_id]
        );
  
        const [staffType] = staffTypeResult[0];
  
        if (staffType && staffType.stfStaffType === 'doctor') {
          // Retrieve appointments for the specified doctor ID from confirmedappointments
          const appointmentsResult = await db.query(
            'SELECT stf_details.stfName, stf_details.stfEmail, stf_details.stfPhone, stf_details.stfAddress, ' +
            'confirmedappointments.DATE, confirmedappointments.TIME ' +
            'FROM stf_details ' +
            'INNER JOIN confirmedappointments ON stf_details.stf_id = confirmedappointments.DOC_ID ' +
            'WHERE confirmedappointments.DOC_ID = ?',
            [doc_id]
          );
  
          const [appointments] = appointmentsResult[0];
  
          if (appointments.length > 0) {
            res.json(appointments);
          } else {
            res.json("NO");
          }
        } else {
          res.status(403).json({ message: "Staff member is not a doctor" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  
    app.post('/send-feedback', async (req, res) => {
      try {
        const { user_id, doc_id, stf_name, remark } = req.body;
  
        // Insert feedback into the feedback table
        await db.query(
          'INSERT INTO feedback (PATIENT_ID, DOC_ID, DOC_NAME, REMARK) VALUES (?, ?, ?, ?)',
          [user_id, doc_id, stf_name, remark]
        );
  
        // Respond with a success message
        res.json('Saved');
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  
    app.post('/give-feedback-direct', async (req, res) => {
      try {
        const { doc_id, pat_id, remark } = req.body;
  
        // Check if the staff member is a doctor
        const staffTypeResult = await db.query(
          'SELECT stfStaffType FROM stf_details WHERE stf_id = ?',
          [doc_id]
        );
  
        const [staffType] = staffTypeResult[0];
  
        if (staffType && staffType.stfStaffType === 'doctor') {
          // Insert feedback into the feedback table
          await db.query(
            'INSERT INTO feedback (DOC_ID, PATIENT_ID, REMARK) VALUES (?, ?, ?)',
            [doc_id, pat_id, remark]
          );
  
          // Update the feedback_history table to indicate feedback given
          await db.query(
            'UPDATE feedback_history SET FEEDBACK = 1 WHERE DOC_ID = ?',
            [doc_id]
          );
  
          // Respond with a success message
          res.json("SUCCESSFUL");
        } else {
          res.status(403).json({ message: "Staff member is not a doctor" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  
    app.get('/get-feedback-doctor-list/:pat_id', async (req, res) => {
      try {
        const { pat_id } = req.params;
  
        // Get feedback list for a patient
        const feedbackListResult = await db.query(
          'SELECT feedback_history.DOC_ID, stf_details.NAME ' +
          'FROM stf_details ' +
          'INNER JOIN feedback_history ON stf_details.stf_id = feedback_history.DOC_ID ' +
          'WHERE PATIENT_ID = ? AND FEEDBACK = 0 ' +
          'GROUP BY feedback_history.DOC_ID',
          [pat_id]
        );
  
        const [feedbackList] = feedbackListResult[0];
  
        if (feedbackList.length > 0) {
          res.json(feedbackList);
        } else {
          res.json("NO");
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  };
  
  module.exports = AppointmentController;
  