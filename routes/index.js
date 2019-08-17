var express = require('express');
const ConnerctorMySQL = require('../public/javascripts/ConnectorMySQL');
const globalSettings = require('../public/javascripts/GlobalConfig');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res)
{
  if(req.session.iduser)
    res.redirect('/chat');
  else
    res.sendFile( path.resolve('./public/index.html'));
});

router.get('/test', async function (req,res,next)
{
  let c = new ConnerctorMySQL(globalSettings.mysqlconfig);
  c.addDefaultModelTables();
  c.testConnection();
  res.send();
});

module.exports = router;
