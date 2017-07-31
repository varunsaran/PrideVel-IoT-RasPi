/**
 * Client side - angularJS - where controllers are defined.
 * HTML talks to these controllers.
 */

/*globals angular */
/*eslint-env jquery */
var coreTemp = angular.module('core', ['ngRoute', 'HomeControllers']);
console.log("client.controllers.js Starting now ... ");
var payloadTemp = {};
var homeControllersTemp = angular.module('HomeControllers', []);


homeControllersTemp.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval',
function ($scope, $rootScope, $http, $interval) {

   // Set of all tasks that should be performed periodically
  var runIntervalTasksTemp = function() {
    $http({
      method: 'GET',
      url: '/api/sensors/temp'
    }).then(function successCallback(response) {


      if (response.data.data[0] !== undefined) {
        // switch on when motion is detected
        if(Object.keys(response.data.data[0]).length > 0){
          payloadTemp = response.data.data[0];
          document.getElementById('spanTemp').innerHTML= payloadTemp.value;
        }
      }
    }, function errorCallback(response) {
        console.log("failed to listen to sensor data");
    });
  };

  var polling;
  var startPollingTemp = function(pollingInterval) {
    polling = $interval(function() {
      runIntervalTasksTemp();
    }, pollingInterval);
  };

  var stopPollingTemp = function() {
    if (angular.isDefined(polling)) {
      $interval.cancel(polling);
      polling = undefined;
    }
  };


  // Someone asked us to refresh
  $rootScope.$on('refreshSensorDataTemp', function(){
    // Check for new input events twice per second
    var pollingInterval = 1000;
    //changed from 500 to 2000

    // Prevent race conditions - stop any current polling, then issue a new
    // refresh task immediately, and then start polling.  Note that polling
    // sleeps first, so we won't be running two refreshes back-to-back.
    stopPollingTemp();
    runIntervalTasksTemp();
    startPollingTemp(pollingInterval);
  });

  // Tell ourselves to refresh new mail count and start polling
  $rootScope.$broadcast('refreshSensorDataTemp');
  $scope.$on('$destroy', function() {
    stopPollingTemp();
  });
}
]);







window.addEventListener("load", function(evt) {


//window.onload = function () {

		var dpsTemp = []; // dataPoints

		var chartTemp = new CanvasJS.Chart("chartContainerTemp",{
			title :{
				text: "Live Temp Data"
			},
			axisY:{
				title: "Sensor Status "
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
				//yVal = yVal +  Math.round(5 + Math.random() *(-10));


				if('value' in payload){
          var date = payload.timer;
          //console.log(date);
					dpsTemp.push({
						x: xVal,
						y: parseFloat(payload.value)
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
  })
