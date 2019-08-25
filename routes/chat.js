var express = require('express');
const server = require('../bin/www');
const ConnerctorMySQL = require('../public/javascripts/ConnectorMySQL');
const globalSettings = require('../public/javascripts/GlobalConfig');
const uuid = require('uuid/v1');
const router = express.Router();
const crypto = require('crypto');
const UIDGenerator = require('uid-generator');
const moment = require('moment');
moment().format();
const ConnectorMYSQL = require('../public/javascripts/ConnectorMySQL');
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

router.post('/addFriend',async function (req,res,next)
{
  let c = new ConnerctorMySQL(globalSettings.mysqlconfig);
  c.addDefaultModelTables();
  let User = await c.findAll('Users',{tokenID:req.body.friend_id});
  if(User[0]===undefined)
    res.send('Friend Token ID is invalid, you may have typed it wrong.');
  else
    {
      let newRoom = await c.createRecord('Rooms',{
        idRoom:uuid(),
        dateofcreation:new Date().getTime(),
        isGroup:'N',
        roomName:User[0].fisrtname,
        tokenID:new UIDGenerator().generateSync()
      });
      let user_1 = {
        idRooms_of_Users: uuid(),
        idRoom:newRoom.idRoom,
        idUser:req.session.iduser
      };
      await c.createRecord('Rooms_of_Users',user_1);
      user_1.idUser = User[0].idUser;
      user_1.idRooms_of_Users = uuid();
      await c.createRecord('Rooms_of_Users',user_1);
      res.send('Friend Added.');
    }
});

router.post('/createGroup',function (req,res,next) {

});

router.post('/addGroup',function (req,res,next) {

});

router.get('/logout',async function(req,res,next)
{
  await req.session.destroy(function(err)
  {
    if(err)
    {
      console.log(err);
    }
  });
  res.redirect('/');
});

module.exports = router;
