var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;

// connectionString = 'postgres://xieghwzbgmzuzt:78e76406f7c32181c720c82dff7062bedd917fe4a648ff6a488fe425a3830cc2@ec2-54-163-254-143.compute-1.amazonaws.com:5432/d3d5fkqr7qabkg'
// stored in env file


var db = pgp(connectionString);

// add query functions

//gets all values from table
function getAllSensors(req, res, next) {
  db.any('select * from sensors')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL sensors'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// gets all values of 1 type of sensor from table
function getSingleSensor(req, res, next) {

  var sensorType = req.params.type;
  db.any('select * from sensors where type = $1', sensorType)
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE sensor'
        }
      );
    })
    .catch(function(err){
      return next(err);
    });
};

//adds a row with new values from RasPi (post request)
function createSensor(req, res, next){
  req.body.age = parseInt(req.body.age);

  db.none('insert into sensors(type, timer, value)' +
      'values(${type}, ${timer}, ${value})',
    req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one sensor'
          });
      })
        .catch(function (err) {
          return next (err);
        });
};

//updates a value (PUT request) Not used anywhere
function updateSensor(req, res, next) {

  db.any('update sensors set timer=$2, value=$3 where type=$1',
    [req.body.type, (req.body.timer), (req.body.value)  ])


    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated sensor'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};


//gets latest values of a sensor type 
function getLatestSensor(req, res, next) {
  var sensorType = req.params.type;
  db.one('SELECT type, timer, value FROM sensors where type = $1 ORDER BY timer DESC LIMIT 1'  , sensorType)
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE sensor'
        });
    })
    .catch(function(err){
      return next(err);
    });
};

module.exports = {
  getAllSensors: getAllSensors,
  getSingleSensor: getSingleSensor,
  createSensor: createSensor,
  updateSensor: updateSensor,
  getLatestSensor: getLatestSensor
};
