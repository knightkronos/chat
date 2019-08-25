const Sequelize = require('sequelize');
const globaldata = require("./GlobalConfig");

function ConnectorMySQL (config)
{
    this.sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.host,
        dialect: 'mysql',
        operatorsAliases: false,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
    this.tables = {};
}

ConnectorMySQL.prototype.addDefaultModelTables = function ()
{
    this.tables ={
        Users: this.sequelize.define('Users',{
            idUser: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            username: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.STRING,
            birthdate: Sequelize.DATE,
            firstname: Sequelize.STRING,
            lastname: Sequelize.STRING,
            typeUser: Sequelize.STRING,
            isDisabled: Sequelize.INTEGER,
            tokenID:Sequelize.STRING
        }),
        Rooms:this.sequelize.define('Rooms',{
            idRoom: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            dateofcreation:Sequelize.DATE,
            isGroup:Sequelize.STRING,
            roomName:Sequelize.STRING,
            tokenID:Sequelize.STRING
        }),
        Rooms_of_Users:this.sequelize.define('Rooms_of_Users',{
            idRooms_of_Users: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            idRoom:Sequelize.STRING,
            idUser:Sequelize.STRING
        })
    }
};

/*
ConnectorMySQL.prototype.addDefaultModelTables = function ()
{
    this.tables =
        {
            Users: this.sequelize.define('users', {
                idUser: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                username: Sequelize.STRING,
                password: Sequelize.STRING,
                emailaddress: Sequelize.STRING,
                firstname: Sequelize.STRING,
                lastname: Sequelize.STRING,
                dateofcreation: Sequelize.STRING,
                birthdate: Sequelize.DATE
            }, {
                fields:['idUser','username','password','firstname','lastname','dateofcreation','birthdate']
            }),
            HistoryUser: this.sequelize.define('historyusers',{
                idHistoryUser: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                idUser:Sequelize.STRING,
                Action: Sequelize.STRING,
                Date:Sequelize.STRING,
                Comment:Sequelize.STRING
            }),
            Flights : this.sequelize.define('flights',{
                idFlight: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                Type:Sequelize.STRING,
                CoorFrom:Sequelize.JSON,
                CoorTo:Sequelize.JSON,
                StartDate:Sequelize.STRING,
                EndDate:Sequelize.STRING,
                isReturning:Sequelize.STRING,
                Data:Sequelize.JSON
            }),
            Flights_of_users:this.sequelize.define('flights_of_users',{
                idFlight: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                idUser:Sequelize.STRING,
                Data:Sequelize.JSON
            }),
            planets:this.sequelize.define('planets',{
                idPlanet: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                idUser:Sequelize.STRING,
                PlanetName:Sequelize.STRING,
                Status:Sequelize.STRING,
                CoorG:Sequelize.INTEGER,
                CoorSS:Sequelize.INTEGER,
                CoorP:Sequelize.INTEGER,
                Size:Sequelize.DOUBLE,
                Temp:Sequelize.DOUBLE,
                AmountOfMoons:Sequelize.INTEGER,
                AmountOfSpaces:Sequelize.INTEGER,
                Data:Sequelize.JSON
            }),
            Tasks:this.sequelize.define('Tasks',{
                idTask: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                Type:Sequelize.STRING,
                TaskObj:Sequelize.JSON
            })
        }
};*/

ConnectorMySQL.prototype.testConnection = function()
{
    this.sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        }).then(()=>{this.sequelize.close();})
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
};

ConnectorMySQL.prototype.disconnect = function ()
{
    this.sequelize.close();
};

ConnectorMySQL.prototype.addSpecificModelTables = function (modeltables){this.tables = modeltables};

ConnectorMySQL.prototype.findAll = function (tablename,conditions)
{
    return new Promise((resolve,rejected)=>
    {
       this.tables[tablename].findAll({where:conditions}).then(res=>{resolve(res);}).catch(err =>{rejected(err);});
    });
};

ConnectorMySQL.prototype.createRecord = function(tablename,values)
{
    return new Promise((resolve,rejected)=>
    {
        this.tables[tablename].create(values).then(res =>{resolve(res);}).catch(err =>{rejected(err);})
    });
};

ConnectorMySQL.prototype.runQuery = function(queryString, replacements,type)
{
    let s = this.sequelize;
    return new Promise((resolve,rejected) =>
    {
        if(type === null)
        {
            s.query(queryString,{
                replacements:replacements,
            }).then(result =>{
                resolve(result);
            }).catch(err => {
                rejected(err);
            })
        }
        else{
            s.query(queryString,{
                replacements:replacements,
                type:type
            }).then(result =>{
                resolve(result);
            }).catch(err => {
                rejected(err);
            })
        }

    })
};

ConnectorMySQL.prototype.findById = function (tablename,id)
{
  return new Promise((resolve,rejected)=>
  {
      this.tables[tablename].findByPk(id).then(record => {resolve(record)}).catch(err =>{rejected(err)});
  })
};

ConnectorMySQL.prototype.findOne = function(model,where)
{
    return new Promise((resolve,rejected)=>
    {
        this.tables[model].findOne({where:where}).then(result =>{resolve(result)}).catch(err =>{rejected(err)});
    })
};

ConnectorMySQL.prototype.findAndCountAll = function(model,where)
{
    return new Promise((resolve,rejected)=>
    {
        this.tables[model].findAndCountAll({where:where}).then(result =>{resolve(result)}).catch(err =>{rejected(err)});
    })
};

ConnectorMySQL.prototype.deleteRecord = async function(querystring,conditions)
{
    let s = this.sequelize;
    return new Promise(async function (resolve,rejected)
    {
        s.query(querystring,{
            replacements:conditions,
            type:s.QueryTypes.DELETE
        }).then(result =>{
            resolve(result);
        }).catch(err => {
            rejected(err);
        })
    });
};

ConnectorMySQL.prototype.updateRecord = async function(querystring,conditions)
{
    let s = this.sequelize;
    return new Promise(async function (resolve,rejected)
    {
        s.query(querystring,{
            replacements:conditions,
            type:s.QueryTypes.UPDATE
        }).then(result =>{
            resolve(result);
        }).catch(err => {
            rejected(err);
        })
    });
};

module.exports = ConnectorMySQL;