// controller for home, manages searching and displaying
// locations on the home page

var app = angular.module('homeController', [])

app.controller('HomeCtrl', function($scope, Locations, $http, Rivys, uiGmapGoogleMapApi) {

	$scope.autocomplete= {
		result: ''
	};
	// console.log($scope.markers);

	var refresh = function() {
		Locations.getAll(function() {
			$scope.$apply();
		});
	}

	// generate markers from Location service
    $scope.map = {
        center: {
            latitude: 37.8715926,
            longitude: -122.27275
        },
        zoom: 8,
        markers: [], 
        markersEvents: {
            click: function(marker, eventName, model, arguments) {
            	console.log(model);
            	// center on the marker
                $scope.map.center.latitude = model.latitude;
                $scope.map.center.longitude = model.longitude;
                // initialize the infowindow
                $scope.map.window.model = model;
                $scope.map.window.templateParameter = {model: model};
                $scope.map.window.show = true;
            }
        },
        window: {
            marker: {},
            show: false,
            closeClick: function() {
                this.show = false;
            },
            templateUrl: 'mobile/templates/infoWindow.html',
            templateParameter: null,
            options: {} // define when map is ready
        }
    };

    var loadMarkers = function() {
		for (i in Locations.locations) {
			var location = Locations.locations[i];
			marker = ({
				latitude: location.lat,
				longitude: location.lng,
				location_id: location._id,
				address : location.address,
				options: {
					labelClass:'marker_labels',
					labelAnchor: '12 60',
					labelContent: location.address
				}
			});
			$scope.map.markers.push(marker);
		}
	}

	$scope.search = function() {
		var address = $scope.autocomplete.result.formatted_address;
		var location = {
			lat: $scope.autocomplete.result.geometry.location.G,
			lng: $scope.autocomplete.result.geometry.location.K
		};

		Locations.getInRadius(location, function() {
			console.log(Locations.locations);

			// recenter the map
			$scope.map.center.latitude = location.lat;
			$scope.map.center.longitude = location.lng;
			$scope.map.zoom = 8;

			console.log(address);
			console.log(location);

			loadMarkers();
		});
	}
})