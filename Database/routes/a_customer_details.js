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

/* GET customer details and order history. */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await poolPromise;
        const request = pool.request();

        // Fetch customer details by ID
        const customerQuery = `SELECT * FROM users WHERE id = @id`;
        request.input('id', sql.Int, id);
        const customerResult = await request.query(customerQuery);

        // Fetch order history for the customer
        const historyQuery = `
            SELECT * FROM orders
            INNER JOIN products ON orders.productId = products.id
            WHERE orders.userId = @id`;
        const historyResult = await request.query(historyQuery);

        res.send({ reponse: customerResult.recordset, history: historyResult.recordset });
    } catch (error) {
        console.error('Error fetching customer and history:', error);
        res.status(500).send('Error fetching customer and history');
    }
});

module.exports = router;
