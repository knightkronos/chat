var express = require('express');
var router = express.Router();


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
  res.send('respond with a resource');
});

module.exports = router;
