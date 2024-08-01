var express = require('express');
const constants = require("../constants");
var router = express.Router();
const sql = require('mssql');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Specify the directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use the original file name for the uploaded file
    }
});

const upload = multer({ storage: storage });

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
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT * FROM cart INNER JOIN products ON cart.productId = products.id WHERE cart.userId = ${id}`);

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Error fetching cart');
    }
});

router.post('/:id', upload.single('picture'), async function (req, res) {
    const userId = req.params.id;
    const { name, phone, address } = req.body;
    const picturePath = req.file ? req.file.path : null;

    try {
        const pool = await poolPromise;
        const productsResult = await pool.request()
            .query(`SELECT * FROM cart INNER JOIN products ON cart.productId = products.id WHERE cart.userId = ${userId}`);
        const products = productsResult.recordset;

        for (const product of products) {
            await insertOrder(product, picturePath, name, phone, address, userId);
        }

        await deleteCart(userId);
        res.send({ 'reponse': '0' });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send('Error processing order');
    }
});

async function insertOrder(product, picturePath, name, phone, address, userId) {
    const pool = await poolPromise;
    console.log(product);
    const result = await pool.request()
        .input('productId', sql.VarChar, product.productId)
        .input('receipt', sql.VarChar(255), picturePath)
        .input('quantity', sql.Int, product.qty)
        .input('price', sql.VarChar, product.qty * product.price)
        .input('name', sql.VarChar(255), name)
        .input('phone', sql.VarChar(20), phone)
        .input('address', sql.VarChar(255), address)
        .input('userId', sql.Int, userId)
        .input('status', sql.Int, 0)
        .query('INSERT INTO orders (productId, receipt, quantity, price, name, phone, address, userId, status) VALUES (@productId, @receipt, @quantity, @price, @name, @phone, @address, @userId, @status)');

    return result;
}

async function deleteCart(userId) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('DELETE FROM cart WHERE userId = @userId');

    return result;
}

module.exports = router;
