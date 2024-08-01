var express = require('express');
const constants = require("../constants");
var router = express.Router();
const sql = require('mssql');
const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name for the uploaded file
    }
});

const upload = multer({ storage: storage });

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

/* GET service by ID */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const pool = await poolPromise;
        const request = pool.request();

        // Fetch service by ID
        const query = `SELECT * FROM services WHERE id = @id`;
        request.input('id', sql.Int, id);
        const result = await request.query(query);

        res.send({ reponse: result.recordset });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Error fetching service');
    }
});

/* POST update service by ID */
router.post('/:id', upload.single('picture'), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, category, times, description, price } = req.body;
        const picturePath = req.file ? req.file.path : null;

        const pool = await poolPromise;
        const request = pool.request();

        // Basic validation checks
        if (!name || !category || !times || !description || !price) {
            console.error('Missing required fields');
            return res.status(400).send('Missing required fields');
        }

        if (!picturePath) {
            console.error('Image not found');
            return res.status(400).send('No image received');
        }

        // Update service by ID
        const query = `
            UPDATE services 
            SET name = @name, category = @category, duration = @times, description = @description, image = @image, price = @price
            WHERE id = @id`;

        request.input('name', sql.NVarChar, name);
        request.input('category', sql.NVarChar, category);
        request.input('times', sql.Int, times);
        request.input('description', sql.NVarChar, description);
        request.input('image', sql.NVarChar, picturePath);
        request.input('price', sql.Decimal, price);
        request.input('id', sql.Int, id);

        const result = await request.query(query);

        res.send({ reponse: '0', data: { name, category, times, description, image: picturePath, price } });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).send('Error updating service');
    }
});

module.exports = router;
