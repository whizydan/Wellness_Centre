const express = require('express');
const constants = require('../constants');
const sql = require('mssql');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name for the uploaded file
    }
});

const upload = multer({ storage: storage });
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

/* GET user by ID */
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM users WHERE id = @id');

        res.send({ 'reponse': result.recordset });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
});

/* POST to update user data */
router.post('/:id', upload.single('picture'), async (req, res) => {
    const id = req.params.id;
    const { username, password, dob, gender, phone, email, address } = req.body;
    const picturePath = req.file ? req.file.path : null;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('dob', sql.Date, dob)
            .input('gender', sql.NVarChar, gender)
            .input('phone', sql.NVarChar, phone)
            .input('email', sql.NVarChar, email)
            .input('address', sql.NVarChar, address)
            .input('photo', sql.NVarChar, picturePath)
            .input('id', sql.Int, id)
            .query(`UPDATE users SET username = @username, password = @password, dob = @dob, gender = @gender, 
                    phone = @phone, email = @email, address = @address, photo = @photo 
                    WHERE id = @id`);

        if (result.rowsAffected[0] > 0) {
            res.send({ 'reponse': '1' }); // Successful response
        } else {
            res.send({ 'reponse': '0' }); // No rows affected
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

module.exports = router;
