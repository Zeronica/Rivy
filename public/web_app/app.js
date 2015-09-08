var app = angular.module('myApp', ['myApp.controllers', 'myApp.services']);

app.controller('tempHomeCtrl', function($scope) {
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
});

app.controller('locationProfileCtrl', function($scope, $stateParams) {
	$scope.location_id = $stateParams.location_id;

	$scope.rivys = [
		{
			_id: 0
		},
		{
			_id: 1
		},
		{
			_id: 2
		},
		{
			_id: 3
		}
	]
});

app.controller('rivyProfileCtrl', function($scope, $stateParams) {
	$scope.rivy_id = $stateParams.rivy_id;
	$scope.location_id = $stateParams.location_id;

	$scope.comments = [
		{
			_id: 0
		},
		{
			_id: 1
		},
		{
			_id: 2
		},
		{
			_id: 3
		}
	]
});
