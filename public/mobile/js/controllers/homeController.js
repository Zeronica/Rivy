// controller for home, manages searching and displaying
// locations on the home page

angular.module('homeController', [])

.controller('HomeCtrl', function($scope, Locations, $http, Rivys) {
	$scope.location = {
		searchAddress: "",
		lng: undefined,
		lat: undefined
	}

	$scope.notSuggesting = true;

	$scope.locations = Locations.locations;

	$scope.suggestions = [];

	var refresh = function() {
		Locations.getAll(function() {
			$scope.$apply();
		});
	}

	$scope.suggestionTaken = function(c) {
		console.log(c.name);
		$scope.notSuggesting = true;
		$scope.location.searchAddress = c.name;
		$scope.location.lng = c.point.coordinates[0],
		$scope.location.lat = c.point.coordinates[1]
	}

	$scope.autocomplete = function() {
		$scope.notSuggesting = true;

		if ($scope.location.searchAddress == '')
			return;

		console.log($scope.location.searchAddress);
		searchAddress = $scope.location.searchAddress;

		var config = {
			params: {
				key: "AhNdHOWj6Vrjo7RoS2Szrl0tohwggPYIWnlV68ltu8vD0cj-PiGKzguZf6NOqFLo",
				q: searchAddress,
			},
			cache: true
		};

		var url = "http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK";

		$http.jsonp(url, config).success(function(data) {
			var result = data.resourceSets[0];
            if (result) {
                if (result.estimatedTotal > 0) {
                	$scope.notSuggesting = false;
                	$scope.suggestions = result.resources;
                	console.log($scope.suggestions);
                	// $scope.$apply();
                }
            }
		}).error(function(result) {
			console.log(result);
		})
	}
})

