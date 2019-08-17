var express = require('express');
const server = require('../bin/www');
const router = express.Router();
const path = require('path');

var io;

router.use(function (req,res,next){
  if(req.session.iduser)
  {
    next();
  }
  else
    res.redirect('/');
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('./public/chat.html'));
});


module.exports = router;
