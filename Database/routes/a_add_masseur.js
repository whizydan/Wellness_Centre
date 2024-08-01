var express = require('express');
const constants = require("../constants");
var router = express.Router();
const sql = require('mssql');

// Configure MSSQL connection
const config = {
    user: constants.DB_USER,
    password: constants.DB_PASSWORD,
    server: constants.DB_HOST,
    database: constants.DB_NAME,
    options: {
        encrypt: false, // Change to true if using SSL
        enableArithAbort: true, // Required for MSSQL driver
    },
};

// Create a pool of MSSQL connections
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Error connecting to MSSQL:', err);
        process.exit(1); // Exit process on connection error
    });

// Handle POST request to insert user
router.post('/', async function (req, res, next) {
    try {
        const { empId, name, gender, phone, email, address, dob, password } = req.body;

        // Get a connection from the pool
        const pool = await poolPromise;
        const request = pool.request();

        // Prepare and execute MSSQL query
        const insertQuery = `
            INSERT INTO users (empId, username, gender, phone, email, address, dob, password, role)
            VALUES (@empId, @name, @gender, @phone, @email, @address, @dob, @password, 1)`;

        request.input('empId', sql.VarChar, empId);
        request.input('name', sql.VarChar, name);
        request.input('gender', sql.VarChar, gender);
        request.input('phone', sql.VarChar, phone);
        request.input('email', sql.VarChar, email);
        request.input('address', sql.VarChar, address);
        request.input('dob', sql.VarChar, dob);
        request.input('password', sql.VarChar, password);

        const result = await request.query(insertQuery);

        console.log('User inserted successfully:', result);
        res.send({ response: '0' }); // Use 'response' instead of 'reponse'
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).send('Error inserting user');
    }
});

module.exports = router;
