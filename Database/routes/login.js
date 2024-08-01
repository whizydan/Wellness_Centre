const express = require('express');
const constants = require('../constants');
const sql = require('mssql');

const router = express.Router();

const poolPromiseInstance = new sql.ConnectionPool({
    user: constants.DB_USER,
    password: constants.DB_PASSWORD,
    server: constants.DB_HOST,
    database: constants.DB_NAME,
    options: {
        encrypt: true, // Use encryption if needed
        enableArithAbort: true // Enable arithmetic abort option
    }
}).connect();

router.post('/', async function (req, res, next) {
    const { username, password } = req.body;

    if (username) {
        try {
            const pool = await poolPromiseInstance;
            const result = await pool.request()
                .input('username', sql.VarChar, username)
                .query('SELECT * FROM users WHERE username = @username');

            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                const storedPassword = user.password;
                if (password === storedPassword) {
                    res.send({ 'reponse': user });
                } else {
                    res.send({ 'reponse': '1' });
                }
            } else {
                res.send({ 'reponse': '0' });
            }
        } catch (error) {
            console.error('Error processing login:', error);
            res.status(500).send('Error processing login');
        }
    } else {
        res.send({ 'reponse': '2' });
    }
});

async function closeDb() {
    try {
        const pool = await poolPromiseInstance;
        await pool.close();
        console.log('MSSQL pool connections closed');
    } catch (error) {
        console.error('Error closing MSSQL pool:', error);
    }
}

module.exports = router;
