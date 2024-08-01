const express = require('express');
const constants = require("../constants");
const router = express.Router();
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

// GET services from MSSQL
router.get('/', async (req, res, next) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request.query('SELECT * FROM services');

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching services from MSSQL:', error);
        res.status(500).send('Error fetching services from MSSQL');
    }
});

module.exports = router;
