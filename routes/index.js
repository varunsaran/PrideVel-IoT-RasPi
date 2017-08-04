var express = require('express');
var router = express.Router();
var db = require('../queries');

//each db function given to a specific URL for API GET and POST requests
router.get('/api/sensors', db.getAllSensors);
router.get('/api/sensors/:type', db.getSingleSensor);
router.post('/api/sensors', db.createSensor);
router.put('/api/sensors/:type', db.updateSensor);
router.get('/api/sensors/latest/:type', db.getLatestSensor);

module.exports = router;
