var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/sensors', db.getAllSensors);
router.get('/api/sensors/:id', db.getSingleSensor);
router.post('/api/sensors', db.createSensor);
router.put('/api/sensors/:id', db.updateSensor);
router.delete('/api/sensors/:id', db.removeSensor);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
