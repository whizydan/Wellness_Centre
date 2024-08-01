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

/* GET masseur by ID. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await poolPromise;
        const request = pool.request();

        // Fetch masseur by ID
        const query = `SELECT * FROM users WHERE id = @id`;
        request.input('id', sql.Int, id);
        const result = await request.query(query);

        res.send({ reponse: result.recordset });
    } catch (error) {
        console.error('Error editing masseur:', error);
        res.status(500).send('Error editing masseur');
    }
});

/* POST to update masseur by ID. */
router.post('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { empId, name, gender, phone, email, address, dob, password } = req.body;
        const pool = await poolPromise;
        const request = pool.request();

        // Update masseur by ID
        const query = `
            UPDATE users 
            SET empId = @empId, username = @name, gender = @gender, phone = @phone, email = @email, address = @address, dob = @dob, password = @password
            WHERE id = @id`;

        request.input('empId', sql.NVarChar, empId);
        request.input('name', sql.NVarChar, name);
        request.input('gender', sql.NVarChar, gender);
        request.input('phone', sql.NVarChar, phone);
        request.input('email', sql.NVarChar, email);
        request.input('address', sql.NVarChar, address);
        request.input('dob', sql.NVarChar, dob);
        request.input('password', sql.NVarChar, password);
        request.input('id', sql.Int, id);

        const result = await request.query(query);

        res.send({ reponse: '0', results: result });
    } catch (error) {
        console.error('Error updating masseur:', error);
        res.status(500).send('Error updating masseur');
    }
});

module.exports = router;
