var express = require('express');
const constants = require("../constants");
var router = express.Router();
const sql = require('mssql');

const config = {
    user: constants.DB_USER,
    password: constants.DB_PASSWORD,
    server: constants.DB_HOST,
    database: constants.DB_NAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true, // For self-signed certificates
    }
};

router.get('/:id', async function (req, res, next) {
    const id = req.params.id;

    try {
        await sql.connect(config);
        const result = await sql.query(`
            SELECT 
                orders.id AS orderId,
                orders.productId,
                orders.receipt,
                orders.quantity,
                orders.price,
                orders.name,
                orders.phone,
                orders.address,
                orders.userId,
                orders.status,
                users.id AS userId,
                users.username,
                users.password,
                users.dob,
                users.gender,
                users.phone AS userPhone,
                users.email,
                users.address AS userAddress,
                users.photo,
                users.role,
                users.empId
            FROM 
                orders
            INNER JOIN 
                users ON users.id = orders.userId
            WHERE 
                orders.id = ${id}
        `);

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Error fetching order');
    } finally {
        await sql.close();
    }
});

module.exports = router;
