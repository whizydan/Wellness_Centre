const express = require('express');
const constants = require("../constants");
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

/* GET bookings for a specific masseur */
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM bookings INNER JOIN services ON bookings.service = services.id WHERE masseurId = @id`);

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Error fetching service');
    }
});

module.exports = router;
