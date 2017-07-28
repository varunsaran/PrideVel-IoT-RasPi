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
//change " where id = $1" to "where type = $(something?)"
function getSingleSensor(req, res, next) {
  var sensorID = parseInt(req.params.id);
  var sensorType = req.params.type;
  //added previous line. commented next line, ID changed to type.
  //db.one('select * from sensors where id = $1', sensorID)
  db.any('select * from sensors where type = $1', sensorType)
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

  //db.none('insert into sensors(type, timer, value)' +
  //db.none changed to db.one to see if new ID won't be created.
  //changed back to original
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
  //db.none('update sensors set type=$1, timer=$2, value=$3 where id=$4',
  db.any('update sensors set timer=$2, value=$3 where type=$1',
    [/*req.body.type,*/ (req.body.timer), parseInt(req.body.value),  /*parseInt(req.params.id)*/])
      //removed parseInt from parseInt(req.body.timer) because timer is string not Int.

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
