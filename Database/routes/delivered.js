var express = require('express');
const constants = require("../constants");
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

router.get('/:id', async function (req, res, next) {
    const orderId = req.params.id;

    const updateQuery = `
        UPDATE orders
        SET status = 1
        WHERE id = @orderId`;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('orderId', sql.Int, orderId)
            .query(updateQuery);

        res.send({ 'reponse': '0' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('Error updating order');
    }
});

module.exports = router;
