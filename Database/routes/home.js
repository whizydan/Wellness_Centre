var express = require('express');
const constants = require('../constants');
var router = express.Router();
const sql = require('mssql');

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

router.get('/', async function (req, res, next) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM services');

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Error fetching services');
    }
});

module.exports = router;
