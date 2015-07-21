// responsible for submitting user input of a new rivy

angular.module('homeInputController', [])

.controller('HomeInputCtrl', function($scope, Rivys) {

	$scope.rivyInput = {
		title: 'asdf',
		body: 'asdfas'
	}

	var clear = function() {
		$scope.rivyInput = {
			title: undefined,
			body: undefined,
		}

		$scope.location = {
			searchAddress: "",
			lng: undefined,
			lat: undefined,
		}
	}

	$scope.submit = function() {
		console.log($scope.rivyInput);
		if ($scope.location.searchAddress && $scope.location.lng && $scope.location.lat && $scope.rivyInput.title && $scope.rivyInput.content) {
			inputObject = {
				address: $scope.location.searchAddress,
				lng: $scope.location.lng,
				lat: $scope.location.lat,
				title: $scope.rivyInput.title,
				body: $scope.rivyInput.body,
			}
			console.log(inputObject)
			Rivys.submit(inputObject).success(function(data) {
				alert("Your rivy has been successfully submitted! Thank you!");
				clear();
				$state.go('/');
			})
		} else {
			return alert("Please make sure you fill out all the input areas");
		}
	}
})