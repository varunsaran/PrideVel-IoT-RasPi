var express = require('express');
var router = express.Router();

var db = require('../queries');

//router.get('/api/sensors/:id', db.getSingleSensor);
//router.put('/api/sensors/:id', db.updateSensor);

router.get('/api/sensors', db.getAllSensors);
router.get('/api/sensors/:type', db.getSingleSensor);
router.post('/api/sensors', db.createSensor);
router.put('/api/sensors/:type', db.updateSensor);
router.delete('/api/sensors/:id', db.removeSensor);


/*
Cloumn "id" removed from table
post all data to /api/sensors
post all of each sensor's data in separate URLs
put latest of each sensor in separate URL
get all URLs


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendfile('index.html', { root: / } )
});

module.exports = router;
