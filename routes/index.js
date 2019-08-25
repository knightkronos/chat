var express = require('express');
const ConnerctorMySQL = require('../public/javascripts/ConnectorMySQL');
const globalSettings = require('../public/javascripts/GlobalConfig');
const uuid = require('uuid/v1');
const crypto = require('crypto');
const path = require('path');
const Sequalize = require('sequelize');
const moment = require('moment');
moment().format();
const UIDGenerator = require('uid-generator');

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

router.post('/createuser', async function (req,res,next)
{
  let c = new ConnerctorMySQL(globalSettings.mysqlconfig);
  c.addDefaultModelTables();
  let existuser = await c.findAll('Users',{[Sequalize.Op.or]: [{username: req.body.username}, {email: req.body.email}]});
  if(existuser[0]!==undefined)
    res.redirect('/');
  else
    {
      let birthdate = moment(req.body.birthdate,'YYYY-MM-DD');
      await c.createRecord('Users',{
        idUser: uuid(),
        username:req.body.username,
        email:req.body.email,
        password:crypto.createHmac('sha256',req.body.pass).digest('hex'),
        birthdate:birthdate.format('YYYY/MM/DD'),
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        typeUser:'normal',
        isDisabled:0,
        tokenID:new UIDGenerator().generateSync()
      }).then((newuser)=>{
        c.disconnect();
        req.session.iduser = newuser.idUser;
        res.redirect('/chat');
      });
  }
});

router.post('/login', async function (req,res,next)
{
  let c = new ConnerctorMySQL(globalSettings.mysqlconfig);
  c.addDefaultModelTables();
  let user = await c.findAll('Users',{[Sequalize.Op.and]:
        [{username: req.body.username_login}, {password: crypto.createHmac('sha256', req.body.pass_login).digest('hex')}]});
  if (user[0]=== undefined)
    res.send("Incorrect password or username.");
  else
  {
    req.session.iduser = user[0].idUser;
    c.disconnect();
    res.redirect('/chat');
  }
});

module.exports = router;
