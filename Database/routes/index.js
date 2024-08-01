var express = require('express');
const constants = require('../constants');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const user = req.cookies.user;
  if(user){
    res.redirect("/home");
  }else{
    //not logged in
    res.redirect('/login');
  }
});

module.exports = router;
