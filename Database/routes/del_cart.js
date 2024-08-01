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

router.get('/:id/:productId', async function (req, res, next) {
    const userId = req.params.id;
    const productId = req.params.productId;

    const deleteQuery = `
        DELETE FROM cart
        WHERE productId = @productId AND userId = @userId`;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('productId', sql.Int, productId)
            .input('userId', sql.Int, userId)
            .query(deleteQuery);

        res.send({ 'reponse': '0' });
    } catch (error) {
        console.error('Error deleting item from cart:', error);
        res.status(500).send('Error deleting item from cart');
    }
});

module.exports = router;
