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

/* GET users listing. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await poolPromise;
        const request = pool.request();

        // Fetch booking details and associated services using JOIN
        const query = `
            SELECT * FROM bookings
            INNER JOIN services ON bookings.service = services.id
            WHERE bookings.id = @id`;

        request.input('id', sql.Int, id);
        const result = await request.query(query);

        // Fetch masseur details (users with role 1)
        const masseurQuery = `SELECT * FROM users WHERE role = 1`;
        const masseurResult = await pool.request().query(masseurQuery);

        res.send({ reponse: result.recordset, users: masseurResult.recordset });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).send('Error fetching booking');
    }
});

router.post('/:id', async (req, res, next) => {
    try {
        const { masseur } = req.body;
        const id = req.params.id;
        const pool = await poolPromise;
        const request = pool.request();

        // Update booking status and assign masseur
        const updateQuery = `
            UPDATE bookings
            SET status = 1,
            masseurId = @masseur
            WHERE id = @id`;

        request.input('masseur', sql.Int, masseur);
        request.input('id', sql.Int, id);
        const result = await request.query(updateQuery);

        res.send({ reponse: '0' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send('Error updating booking');
    }
});

module.exports = router;
