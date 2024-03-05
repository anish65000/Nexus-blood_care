const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql');

dotenv.config();

const StaffRegisterController = (app, db) => {
  const query = async (sql, params) => {
    try {
      const [results, fields] = await db.promise().query(sql, params);
      return results;
    } catch (error) {
      throw error;
    }
  };

  app.post("/reg/stf", async (req, res) => {
    try {
      const {
        stfName,
        stfEmail,
        stfPhone,
        stfAddress,
        stfUserName,
        stfPassword,
        stfStaffType
      } = req.body;

      const existingStaff = await query('SELECT * FROM stf_login WHERE userName = ?', [stfUserName]);

      if (existingStaff.length > 0) {
        return res.status(400).send({ message: "Staff username already exists" });
      }

      const hashedPassword = await bcrypt.hash(stfPassword, 10);

      const connection = await db.promise();
      try {
        const [staffDetailsResult] = await connection.query(
          'INSERT INTO stf_details (stfName, stfMail, stfPhone, stfAddress, stfStaffType) VALUES (?, ?, ?, ?, ?)',
          [stfName, stfEmail, stfPhone, stfAddress, stfStaffType]
        );

        const staffId = staffDetailsResult.insertId;

        await connection.query(
          'INSERT INTO stf_login (stf_id, userName, password) VALUES (?, ?, ?)',
          [staffId, stfUserName, hashedPassword]
        );

        await connection.commit();

        console.log("Staff Registered Successfully");
        res.status(201).send({ success: true, message: "STAFF REGISTRATION SUCCESSFUL!" });
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.close();
      }
    } catch (error) {
      console.error("Error during staff registration:", error);
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
  });
}

module.exports = StaffRegisterController;
