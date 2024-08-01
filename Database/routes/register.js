const express = require('express');
const constants = require('../constants');
const sql = require('mssql');
const router = express.Router();

// Create a pool connection for MSSQL
const poolPromise = new sql.ConnectionPool({
    user: constants.DB_USER,
    password: constants.DB_PASSWORD,
    server: constants.DB_HOST,
    database: constants.DB_NAME,
    options: {
        encrypt: true, // Use encryption if needed
        enableArithAbort: true // Enable arithmetic abort option
    }
}).connect();

/* POST to insert user data */
router.post('/', async (req, res) => {
    const { username, password, email, phone, gender, dob, address } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('gender', sql.NVarChar, gender)
            .input('dob', sql.Date, dob)
            .input('address', sql.NVarChar, address)
            .query(`INSERT INTO users (username, password, email, phone, gender, dob, address) 
                    VALUES (@username, @password, @email, @phone, @gender, @dob, @address)`);

        if (result.rowsAffected[0] > 0) {
            res.send({ 'reponse': '0' }); // Success response
        } else {
            res.send({ 'reponse': '1' }); // Error response
        }
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).send('Error inserting user');
    }
});

module.exports = router;
