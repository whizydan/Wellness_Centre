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

/* GET all products */
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM products');

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

/* GET product by ID */
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM products WHERE id = @id');

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
    }
});

/* POST to add product to cart */
router.post('/:id', async (req, res) => {
    const userId = req.params.id;
    const { id, qty, price } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('qty', sql.Int, qty)
            .input('price', sql.Decimal, price)
            .input('userId', sql.Int, userId)
            .query('INSERT INTO cart (productId, qty, price, userId) VALUES (@id, @qty, @price, @userId)');

        res.send({ 'reponse': '0' }); // Successful response
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Error adding to cart');
    }
});

module.exports = router;
