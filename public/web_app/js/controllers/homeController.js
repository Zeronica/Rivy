// controller for home, manages searching and displaying
// locations on the home page

var app = angular.module('homeController', [])

app.controller('HomeCtrl', function($scope, Locations, $http, Rivys) {

	$scope.autocomplete= {
		result: ''
	};
	// console.log($scope.markers);

	// default center and radius
	var defaultCenter = {
        latitude: 37.8715926,
        longitude: -122.27275
	}

	var defaultRadius = 1000; //km

	// generate bounds from a latlng object
	var calculateBounds = function(center, d) {
		lat = center.latitude;
		lon = center.longitude;

		earthRad = 6371;
		r = d/earthRad;

		latT = Math.asin(Math.sin(lat)/Math.cos(r));

		deltaLon = Math.acos( ( Math.cos(r) - Math.sin(latT) * Math.sin(lat) ) / ( Math.cos(latT) * Math.cos(lat) ) );
	      // = Math.asin(Math.sin(r)/Math.cos(lat));

	    var o = {
			latmin : lat - r,
			latmax : lat + r,
			lngmin : lon - deltaLon,
			lngmax : lon + deltaLon
		}

		var r = {
			northeast: {
				latitude: o.latmax,
				longitude: o.lngmin
			},
			southwest: {
				latitude: o.latmin,
				longitude: o.lngmax
			}
		}

		return r;
	}

	// generate markers from Location service
    $scope.map = {
        center: defaultCenter,
        bounds: calculateBounds(defaultCenter, defaultRadius),
        zoom: 12,
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
			console.log(location);
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
			lat: $scope.autocomplete.result.geometry.location.J,
			lng: $scope.autocomplete.result.geometry.location.M
		};
		console.log(location);

		Locations.getInRadius(location, function() {
			// check whether locations found
			if (Locations.locations.length) {
				console.log(address);
				console.log(location);

				loadMarkers();
			} else {
				alert("sorry, we couldn't find any rivies in your area, why not start one?");
			}

			// recenter the map on the search address
			$scope.map.center.latitude = location.lat;
			$scope.map.center.longitude = location.lng;
			$scope.map.bounds = calculateBounds($scope.map.center, defaultRadius);

		});
	}
})