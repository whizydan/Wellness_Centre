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

/* GET orders with status 0 */
router.get('/', async (req, res, next) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Fetch orders with status 0
        const query = `
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
                orders.status = 0`;

        const result = await request.query(query);

        res.send({ reponse: result.recordset });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
});

module.exports = router;
