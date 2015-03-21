var app = angular.module('myApp', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	    $urlRouterProvider.otherwise("locations");

	    $stateProvider
	        .state('locations', {
	            url: "/locations",
	            templateUrl: "templates/LocationFeed.html"
	        })
    }
])