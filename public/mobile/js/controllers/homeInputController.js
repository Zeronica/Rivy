// responsible for submitting user input of a new rivy

angular.module('homeInputController', [])

.controller('HomeInputCtrl', function($scope, $state, Rivys) {

	$scope.autocomplete = {
		result : '',
		options : {
			types: ['address']
		}
	}

	var clear = function() {
		$scope.rivyInput = {
			title: 'asdf',
			body: 'asdfas'
		}
	}

	clear();

	$scope.submit = function() {
		// verify address has been entered correctly
		if (!$scope.autocomplete.result) {
			return alert("make sure you enter a correct address");
		}

		var inputObject = {
			address: $scope.autocomplete.result.formatted_address,
			lat: $scope.autocomplete.result.geometry.location.G,
			lng: $scope.autocomplete.result.geometry.location.K
		}

		// verify the contents of the rivy
		if ($scope.rivyInput.title && $scope.rivyInput.body) {
			inputObject.title = $scope.rivyInput.title;
			inputObject.body = $scope.rivyInput.body;
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

// var locationData = [
// 	{
// 		address: "2650 Haste St Berkeley, CA 94704",
// 		lat: "37.86646395921707",
// 		lng: "-122.25485689938068"
// 	},
// 	{
// 		address: "2400 Durant Ave, Berkeley, CA",
// 		lat: "37.86751605570316",
// 		lng: "-122.26107962429523"
// 	}
// ]