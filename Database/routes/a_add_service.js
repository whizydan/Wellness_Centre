var express = require('express');
const constants = require("../constants");
var router = express.Router();
const multer = require('multer');
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Specify the directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use the original file name for the uploaded file
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

router.post('/', upload.single('picture'), async (req, res) => {
    try {
        const { name, category, times, description, price } = req.body;
        const picturePath = req.file ? req.file.path : null; // Assuming you're using Multer for file uploads
        console.log(req.body);

        // Validation (you can add more validation logic as needed)
        if (!name || !category || !times || !description || !picturePath) {
            return res.status(400).send('All fields are required');
        }

        // Get a connection from the pool
        const pool = await poolPromise;
        const request = pool.request();

        // Insert data into the database using parameterized query
        const insertQuery = "INSERT INTO services (name, category, duration, description, image, price) VALUES(@name, @category, @times, @description, @picturePath, @price)";
        request.input('name', sql.VarChar, name);
        request.input('category', sql.VarChar, category);
        request.input('times', sql.VarChar, times);
        request.input('description', sql.VarChar, description);
        request.input('picturePath', sql.VarChar, picturePath);
        request.input('price', sql.VarChar, price);

        const result = await request.query(insertQuery);
        console.log('Service added successfully:', result);
        res.send({ reponse: '0' }); 
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).send('Error adding service');
    }
});

module.exports = router;
