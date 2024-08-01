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

/* GET service by ID */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM services WHERE id = @id');

        if (result.recordset.length > 0) {
            res.send({ 'reponse': result.recordset });
        } else {
            res.status(404).send({ 'response': 'Service not found' });
        }
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Error fetching service');
    }
});

/* POST to check availability */
router.post('/:id', async (req, res) => {
    const id = req.params.id;
    const { date, duration, time } = req.body;

    try {
        const pool = await poolPromise;
        const checkAvailability = await pool.request()
            .input('serviceId', sql.Int, id)
            .input('date', sql.Date, date)
            .input('time', sql.Time, time)
            .query('SELECT * FROM availability WHERE serviceId = @serviceId AND date = @date AND time = @time');

        if (checkAvailability.recordset.length > 0) {
            res.send({ 'reponse': 'no availability' });
        } else {
            res.send({ 'reponse': '1' });
        }
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).send('Error checking availability');
    }
});

module.exports = router;
