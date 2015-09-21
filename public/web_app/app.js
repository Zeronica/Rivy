var app = angular.module('myApp', ['myApp.controllers', 'myApp.services']);

app.controller('tempHomeCtrl', function($scope) {
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
});
