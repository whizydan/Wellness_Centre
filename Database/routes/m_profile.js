var express = require('express');
const constants = require("../constants");
var router = express.Router()
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

/* GET users listing. */
router.get('/:id', async function (req, res, next) {
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

router.post('/:id', upload.single('picture'), async function (req, res) {
    const id = req.params.id;
    // Extract form data from req.body
    const { username, password, dob, gender, phone, email, address } = req.body;
    const picturePath = req.file ? req.file.path : null;

    // Create an object with the updated data
    const newData = {
        username: username,
        password: password,
        dob: dob,
        gender: gender,
        phone: phone,
        email: email,
        address: address,
        photo: picturePath
    };

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, newData.username)
            .input('password', sql.NVarChar, newData.password)
            .input('dob', sql.NVarChar, newData.dob)
            .input('gender', sql.NVarChar, newData.gender)
            .input('phone', sql.NVarChar, newData.phone)
            .input('email', sql.NVarChar, newData.email)
            .input('address', sql.NVarChar, newData.address)
            .input('photo', sql.NVarChar, newData.photo)
            .input('id', sql.Int, id)
            .query('UPDATE users SET username = @username, password = @password, dob = @dob, gender = @gender, phone = @phone, email = @email, address = @address, photo = @photo WHERE id = @id');

        console.log('User updated successfully:', result.rowsAffected[0], 'rows affected');
        res.send({ 'reponse': '1' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

module.exports = router;
