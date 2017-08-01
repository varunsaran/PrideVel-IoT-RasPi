/**
 * Client side - angularJS - where controllers are defined.
 * HTML talks to these controllers.
 */

/*globals angular */
/*eslint-env jquery */
var core = angular.module('core', ['ngRoute', 'HomeControllers']);
console.log("client.controllers.js Starting now ... ");
var payload = {};
var payloadTemp = {};
var tempTime;
var ldrTime;
var homeControllers = angular.module('HomeControllers', []);


homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval',
function ($scope, $rootScope, $http, $interval) {

   // Set of all tasks that should be performed periodically
  var runIntervalTasks = function() {

    $http({
      method: 'GET',
      url: '/api/sensors/latest/ldr'
    }).then(function successCallback(response) {


      if (response.data.data !== undefined) {
        // switch on when motion is detected
        if(Object.keys(response.data.data).length > 0){
          payload = response.data.data;
          //  $('#switch').prop('checked', payload.value);
            document.getElementById('spanLDR').innerHTML= payload.value;
            console.log("payload.timer: " + payload.timer)
            ldrTime = new Date(0);
            ldrTime.setUTCSeconds(payload.timer);

            console.log("date: " + ldrTime );

        }
      }
    },   function errorCallback(response) {
          console.log("failed to listen to sensor data");
      });
      $http({
        method: 'GET',
        url: '/api/sensors/latest/temp'
      }).then(function successCallback(response) {


        if (response.data.data !== undefined) {
          // switch on when motion is detected
          if(Object.keys(response.data.data).length > 0){
            payloadTemp = response.data.data;
            //  $('#switch').prop('checked', payload.value);
              document.getElementById('spanTemp').innerHTML= payloadTemp.value;
              //console.log("payload.timer: " + payloadTemp.timer)
              tempTime = new Date(0);
              tempTime.setUTCSeconds(payloadTemp.timer);




          }
        }
      },
    function errorCallback(response) {
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
    var pollingInterval = 1000;
    //changed from 500 to 2000

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
		var chartLDR = new CanvasJS.Chart("chartContainerLDR",{
			title :{
				text: "Live LDR Data"
			},
			axisY:{
				title: "Sensor Status "
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
          console.log("value exists in latest ldr payload and value = " + payload.value + " and timer = " + ldrTime);
					dps.push({
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
