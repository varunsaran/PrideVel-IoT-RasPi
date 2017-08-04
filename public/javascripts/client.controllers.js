/**
 * Client side - angularJS - where controllers are defined.
 * HTML talks to these controllers.
 */

/*globals angular */
/*eslint-env jquery */
var core = angular.module('core', ['ngRoute', 'HomeControllers']);
//console.log("client.controllers.js Starting now ... ");
var payload = {};
var payloadTemp = {};
var tempTime;
var ldrTime;
var homeControllers = angular.module('HomeControllers', []);


homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval',
function ($scope, $rootScope, $http, $interval) {

   // Set of all tasks that should be performed periodically
   //gets latest LDR sensor values, pushes the to html webpage and activates/deactivates switch.
  var runIntervalTasks = function() {
    //gets JSON object with sensor type, timer, value that was pushed by RasPi
    $http({
      method: 'GET',
      url: '/api/sensors/latest/ldr'
    }).then(function successCallback(response) {


      if (response.data.data !== undefined) {
        if(Object.keys(response.data.data).length > 0){
          //response.data.data is the JSON object with type, timer, value
          payload = response.data.data;
          //if capacitor value is more that 400,000 turn on the switch
          if(payload.value > 400000){
            $('#switch').prop('checked', true);
          }else {
            $('#switch').prop('checked', false);
          }
          //converts capacitor value from number between 1-500000 into a percentage.
            var light = (1-(payload.value/500000))*100;
            //console.log(light);
            //pushes latest LDR value into html webpage and rounds to 2 decimal places
            document.getElementById('spanLDR').innerHTML= parseFloat(Math.round(light*100)/100).toFixed(2);
            //console.log("payload.timer: " + payload.timer)
            // var ldrTime initialised to be epoch time, then converts payload.timer (milliseconds from epoch) into local time.
            ldrTime = new Date(0);
            ldrTime.setUTCSeconds(payload.timer);
            //console.log("date: " + ldrTime );

        }
      }
    },   function errorCallback(response) {
          console.log("failed to listen to sensor data");
      });
      //same function for LDR repeated for temp sensor.
      $http({
        method: 'GET',
        url: '/api/sensors/latest/temp'
      }).then(function successCallback(response) {

        if (response.data.data !== undefined) {

          if(Object.keys(response.data.data).length > 0){
            payloadTemp = response.data.data;
              document.getElementById('spanTemp').innerHTML= payloadTemp.value;
              tempTime = new Date(0);
              tempTime.setUTCSeconds(payloadTemp.timer);

          }
        }
      },
    function errorCallback(response) {
        console.log("failed to listen to sensor data");
    });
  };

//lines 78-111 taken from IBM tutorial to call runIntervalTasks periodically and refresh and update values
  var polling;
  var startPolling = function(pollingInterval) {
    polling = $interval(function() {
      runIntervalTasks();
    }, pollingInterval);
  };

  var stopPolling = function() {
    if (angular.isDefined(polling)) {
      $interval.cancel(polling);
      polling = undefined;
    }
  };

  // refresh
  $rootScope.$on('refreshSensorData', function(){
    // Check for new input events once per second
    var pollingInterval = 1000;

    // Prevent race conditions - stop any current polling, then issue a new
    // refresh task immediately, and then start polling.  Note that polling
    // sleeps first, so we won't be running two refreshes back-to-back.
    stopPolling();
    runIntervalTasks();
    startPolling(pollingInterval);
  });

  // Tell ourselves to refresh new mail count and start polling
  $rootScope.$broadcast('refreshSensorData');
  $scope.$on('$destroy', function() {
    stopPolling();
  });
}
]);

//creates LDR graph using canvasJS on page being loaded
window.onload = function () {

		var dps = []; // dataPoints
		var chartLDR = new CanvasJS.Chart("chartContainerLDR",{
			title :{
				text: "Live Light Sensor Data"
			},
			axisY:{
				title: "Darkness (0-500k)"
				},
        axisX:{
  				title: "Time"
  				},

			data: [{
				type: "line",
				dataPoints: dps
			}]
		});

		var xVal = 0;
		var yVal = 1;
		var updateInterval = 20;
		var dataLength = 1000; // number of dataPoints visible at any point

		var updateChart = function (count) {
			count = count || 1;
			// count is number of times loop runs to generate dataPoints.

			for (var j = 0; j < count; j++) {

				if('value' in payload){
          //console.log("value in latest ldr payload  = " + payload.value + " and timer = " + ldrTime);
					dps.push({
            //time and value pushed to x and y axis
						x: ldrTime,
						y: parseFloat(payload.value)
				});
				}

				xVal++;
			}
			if (dps.length > dataLength)
			{
				dps.shift();
			}

		 chartLDR.render();

		};

		// generates first set of dataPoints
		updateChart(dataLength);

		 //update chart after specified time.
		setInterval(function(){updateChart();}, updateInterval);

	};

//same function for LDR repeated for Temp, with variable names being the same with Temp added to the end.
  window.addEventListener("load", function(evt) {

  		var dpsTemp = []; // dataPoints

  		var chartTemp = new CanvasJS.Chart("chartContainerTemp",{
  			title :{
  				text: "Live Temperature Data"
  			},
  			axisY:{
  				title: "Temperature in °C "
  				},

          axisX:{
    				title: "Time"
    				},

  			data: [{
  				type: "line",
  				dataPoints: dpsTemp
  			}]
  		});

  		var xVal = 0;
  		var yVal = 1;
  		var updateInterval = 20;
  		var dataLength = 1000; // number of dataPoints visible at any point

  		var updateChartTemp = function (count) {
  			count = count || 1;
  			// count is number of times loop runs to generate random dataPoints.

  			for (var j = 0; j < count; j++) {

  				if(tempTime !== undefined){
  					dpsTemp.push({
  						x: tempTime,
  						y: parseFloat(payloadTemp.value)
  				});
  				}

  				xVal++;
  			}
  			if (dpsTemp.length > dataLength)
  			{
  				dpsTemp.shift();
  			}

  			chartTemp.render();

  		};

  		// generates first set of dataPoints
  		updateChartTemp(dataLength);

  		 //update chart after specified time.
  		setInterval(function(){updateChartTemp();}, updateInterval);

  	//};
  });
