// responsible for submitting user input of a new rivy

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

angular.module('homeInputController', [])

.controller('HomeInputCtrl', function($scope, $state, Rivys) {

	var clear = function() {
		$scope.rivyInput = {
			title: 'asdf',
			body: 'asdfas'
		}

		$scope.location = locationData[0];
	}

	clear();

	$scope.submit = function() {
		console.log($scope.rivyInput);
		if ($scope.location.address && $scope.location.lng && $scope.location.lat && $scope.rivyInput.title && $scope.rivyInput.body) {
			inputObject = {
				address: $scope.location.address,
				lng: $scope.location.lng,
				lat: $scope.location.lat,
				title: $scope.rivyInput.title,
				body: $scope.rivyInput.body,
			}
			console.log(inputObject)
			Rivys.submit(inputObject).success(function(data) {
				alert("Your rivy has been successfully submitted! Thank you!");
				clear();
				$state.go('tab.home');
			})
		} else {
			return alert("Please make sure you fill out all the input areas");
		}
	}
})