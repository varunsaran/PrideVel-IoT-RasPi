var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
//next line has connection string with format user:password@host:port....something like that
//var connectionString = 'postgres://xieghwzbgmzuzt:78e76406f7c32181c720c82dff7062bedd917fe4a648ff6a488fe425a3830cc2@ec2-54-163-254-143.compute-1.amazonaws.com:5432/d3d5fkqr7qabkg'



var db = pgp(connectionString);

// add query functions
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

function getSingleSensor(req, res, next) {
  var sensorID = parseInt(req.params.id);
  db.one('select * from sensors where id = $1', sensorID)
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
function updateSensor(req, res, next) {
  db.none('update sensors set type=$1, timer=$2, value=$3 where id=$4',
    [req.body.type, parseInt(req.body.timer), parseInt(req.body.value),
       parseInt(req.params.id)])
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
function removeSensor(req, res, next) {
  var sensorID = parseInt(req.params.id);
  db.result('delete from sensors where id = $1', sensorID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} sensor`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
};
module.exports = {
  getAllSensors: getAllSensors,
  getSingleSensor: getSingleSensor,
  createSensor: createSensor,
  updateSensor: updateSensor,
  removeSensor: removeSensor
};
