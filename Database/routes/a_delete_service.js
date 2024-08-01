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

/* DELETE service by ID. */
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await poolPromise;
        const request = pool.request();

        // Delete service by ID
        const query = `DELETE FROM services WHERE id = @id`;
        request.input('id', sql.Int, id);
        const result = await request.query(query);

        res.send({ reponse: '0' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).send('Error deleting service');
    }
});

module.exports = router;
