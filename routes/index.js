var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/sensors', db.getAllSensors);
router.get('/api/sensors/:type', db.getSingleSensor);
router.post('/api/sensors', db.createSensor);
router.put('/api/sensors/:type', db.updateSensor);
router.delete('/api/sensors/:id', db.removeSensor);
router.get('/api/sensors/latest/:type', db.getLatestSensor);


/*

/* GET home page. */
/*router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendfile('index.html', { root: __dirname } )
});*/

module.exports = router;
