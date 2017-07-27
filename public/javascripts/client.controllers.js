/**
 * Client side - angularJS - where controllers are defined.
 * HTML talks to these controllers.
 */

/*globals angular */
/*eslint-env jquery */
var core = angular.module('core', ['ngRoute', 'HomeControllers']);


console.log("client.controllers.js Starting now ... ");

var payload = {};


var homeControllers = angular.module('HomeControllers', []);


homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval',
function ($scope, $rootScope, $http, $interval) {

   // Set of all tasks that should be performed periodically
  var runIntervalTasks = function() {
    $http({
      method: 'GET',
      url: '/api/sensors/ldr'
    }).then(function successCallback(response) {
// response.data.data.value
//data instead of data
//value instead of motioDetected
      if (response.data.data !== undefined) {
        // switch on when motion is detected
        if(Object.keys(response.data.data).length > 0){
          payload = JSON.parse(response.data.data);
            $('#switch').prop('checked', payload.timer);
            //switch made to check when timer = 1, not value, just to check if code works. need to change back

            //console.log("Payload motion: " + payload.value);
            //console.log("Payload timer: " + payload.timer);


/////client.controller not being called..probably
//^^^

        }
      }
    }, function errorCallback(response) {
        console.log("failed to listen to sensor data");
    });
  };

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
  // Someone asked us to refresh
  $rootScope.$on('refreshSensorData', function(){
    // Check for new input events twice per second
    var pollingInterval = 500;
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
window.onload = function () {

		var dps = []; // dataPoints

		var chart = new CanvasJS.Chart("chartContainer",{
			title :{
				text: "Live Sensor Data"
			},
			axisY:{
				title: "Sensor Status (0 or 1)"
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
			// count is number of times loop runs to generate random dataPoints.

			for (var j = 0; j < count; j++) {
				//yVal = yVal +  Math.round(5 + Math.random() *(-10));


				if('value' in payload){
					console.log("payload.value equals " + payload.value);
					var date = new Date (payload.timer);
					dps.push({

						x: date,
						//y: yVal
						y: payload.value

				});
				}

				xVal++;
			}
			if (dps.length > dataLength)
			{
				dps.shift();
			}

			chart.render();

		};

		// generates first set of dataPoints
		updateChart(dataLength);

		 //update chart after specified time.
		setInterval(function(){updateChart();}, updateInterval);

	};