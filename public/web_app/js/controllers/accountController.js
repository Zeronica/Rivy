var app = angular.module('accountController', []);

app.controller("AccountCtrl", function($scope, UserAuthFactory) {
	$scope.logout = function() {
		UserAuthFactory.logout();
	}
});