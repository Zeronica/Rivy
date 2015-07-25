// controller for home, manages searching and displaying
// locations on the home page

var app = angular.module('homeController', [])

var locationData = [
	{
		address: "2650 Haste St Berkeley, CA 94704",
		lat: "37.86646395921707",
		lng: "-122.25485689938068"
	},
	{
		address: "2400 Durant Ave, Berkeley, CA",
		lat: "37.86751605570316",
		lng: "-122.26107962429523"
	}
]

app.controller('HomeCtrl', function($scope, Locations, $http, Rivys) {
	$scope.location = locationData[0];

	$scope.notSuggesting = true;

	$scope.locations = Locations.locations;

	$scope.suggestions = [];

	var refresh = function() {
		Locations.getAll(function() {
			$scope.$apply();
		});
	}

	$scope.search = function() {
		Locations.getInRadius($scope.location, function() {
			//$scope.$apply();
		});
	}
})

	// $scope.autocomplete = function() {
	// 	$scope.notSuggesting = true;

	// 	if ($scope.location.searchAddress == '')
	// 		return;

	// 	console.log($scope.location.searchAddress);
	// 	searchAddress = $scope.location.searchAddress;

	// 	var config = {
	// 		params: {
	// 			key: "AhNdHOWj6Vrjo7RoS2Szrl0tohwggPYIWnlV68ltu8vD0cj-PiGKzguZf6NOqFLo",
	// 			q: searchAddress,
	// 		},
	// 		cache: true
	// 	};

	// 	var url = "http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK";

	// 	$http.jsonp(url, config).success(function(data) {
	// 		var result = data.resourceSets[0];
 //            if (result) {
 //                if (result.estimatedTotal > 0) {
 //                	$scope.notSuggesting = false;
 //                	$scope.suggestions = result.resources;
 //                	console.log($scope.suggestions);
 //                	// $scope.$apply();
 //                }
 //            }
	// 	}).error(function(result) {
	// 		console.log(result);
	// 	})
	// }

