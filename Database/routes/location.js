var express = require('express');
const constants = require("../constants");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('location', { title: constants.APP_NAME});
});

module.exports = router;