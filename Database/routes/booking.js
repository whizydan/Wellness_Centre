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
        enableArithAbort: true // Enable ArithAbort
    }
};

/* GET users listing. */
router.post('/:id/:date/:duration/:time', function (req, res, next) {
    const id = req.params.id;
    const date = req.params.date;
    const duration = req.params.duration;
    const time = req.params.time;

    sql.connect(config, function (err) {
        if (err) {
            console.error('Error connecting to MSSQL:', err);
            res.status(500).send('Error connecting to MSSQL');
        } else {
            const request = new sql.Request();
            request.query(`SELECT * FROM availability where serviceId= ${id}`, function (err, results) {
                if (err) {
                    console.error('Error fetching service:', err);
                    res.status(500).send('Error fetching service');
                } else {
                    res.send({ 'reponse': results.recordset });
                }
                sql.close();
            });
        }
    });
});

router.post('/:id/:date/:duration/:time/:userId', function (req, res, next) {
    const id = req.params.id;
    const date = req.params.date;
    const duration = req.params.duration;
    const time = req.params.time;
    const userId = req.params.userId;

    const { service, slots, pax, gender, phone, email, remark, payment, status, masseurId ,username} = req.body;
    const insertQuery = `INSERT INTO bookings (date, service, duration, time, username, pax, gender, phone, email, remark, status,userId) 
                     VALUES (@date, @id, @duration, @time, @username, @pax, @gender, @phone, @email, @remark, @status, @userId)`;
    const values = {
        date: date,
        id: id,
        duration: duration,
        time: time,
        username: username,
        pax: pax,
        gender: gender,
        phone: phone,
        email: email,
        remark: remark,
        status: 0,
        slots: 8 - pax,
        userId: userId // Assuming you have a 'user' object with an 'id' property
    };

    sql.connect(config, function (err) {
        if (err) {
            console.error('Error connecting to MSSQL:', err);
            res.status(500).send('Error connecting to MSSQL');
        } else {
            const request = new sql.Request();
            request.input('date', sql.NVarChar, values.date);
            request.input('id', sql.Int, values.id);
            request.input('duration', sql.NVarChar, values.duration);
            request.input('time', sql.NVarChar, values.time);
            request.input('username', sql.NVarChar, values.username);
            request.input('pax', sql.Int, values.pax);
            request.input('gender', sql.NVarChar, values.gender);
            request.input('phone', sql.NVarChar, values.phone);
            request.input('email', sql.NVarChar, values.email);
            request.input('remark', sql.NVarChar, values.remark);
            request.input('status', sql.Int, values.status);
            request.input('userId', sql.Int, values.userId);
            request.input('slots', sql.Int, values.slots);

            request.query(insertQuery, function (err, results) {
                if (err) {
                    console.error('Error making booking:', err);
                    res.status(500).send('Error making booking');
                } else {
                    res.send({ 'reponse': '0' });
                }
                sql.close();
            });
        }
    });
});

module.exports = router;
