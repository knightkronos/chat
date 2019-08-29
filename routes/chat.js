const express = require('express');
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
const app = require(path.resolve('./app.js'));

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
  let isAddingItself = await c.findById('Users',req.session.iduser);
  if(isAddingItself.tokenID === req.body.friend_id)
    res.send('You cannot send an invitation to yourself.');
  else{
    let User = await c.findAll('Users',{tokenID:req.body.friend_id});
    if(User[0]===undefined)
      res.send('Friend Token ID is invalid, you may have typed it wrong.');
    else
    {
      let isfriendalready = await c.runQuery('CALL isFriendAlready(?,?)',[req.session.iduser,User[0].idUser], null);
      if (isfriendalready[0].contador > 0)
        res.send('This user is already in your contact list.');
      else{
        let newRoom = await c.createRecord('Rooms',{
          idRoom:uuid(),
          dateofcreation:new Date().getTime(),
          isGroup:'N',
          roomName:User[0].firstname+" "+User[0].lastname,
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
        await c.createRecord('Rooms_of_Users',user_1).then(() =>{c.disconnect();});
        res.send('Friend Added.');
      }
    }
  }
});

router.post('/createGroup',async function (req,res,next)
{
  let c = new ConnectorMYSQL(globalSettings.mysqlconfig);
  c.addDefaultModelTables();
  let newRoom = await c.createRecord('Rooms',{
    idRoom:uuid(),
    dateofcreation:new Date().getTime(),
    isGroup:'Y',
    roomName:req.body.namegroup,
    tokenID:new UIDGenerator().generateSync()
  });
  let user = {
    idRooms_of_Users: uuid(),
    idRoom:newRoom.idRoom,
    idUser:req.session.iduser
  };
  await c.createRecord('Rooms_of_Users',user).then(() =>{c.disconnect();});
  res.send(newRoom.tokenID);
});

router.post('/addGroup',function (req,res,next)
{

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
