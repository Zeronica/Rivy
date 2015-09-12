var app = angular.module('feedController', []);

app.controller('locationProfileCtrl', function($scope, $state, rivysAtLocation, Rivys, $stateParams) {
	$scope.location_address = $stateParams.location_address;
	$scope.location_id = $stateParams.location_id;

	$scope.rivys = rivysAtLocation.data.rivys;

	$scope.upvote = function(rivy) {
		Rivys.upvote(rivy, function() {
			rivy.upvotes += 1;
		});
	}

	$scope.toNewRivy = function() {
		$state.go('tab.home-input1', rivysAtLocation.data.location);
	}
})

app.controller('rivyProfileCtrl', function($scope, rivyPromise, Rivys) {	
	$scope.rivy = rivyPromise.data;

	$scope.comments = rivyPromise.data.comments;

	$scope.commentInput = {
		body: ''
	}

	$scope.upvote = function(comment) {
		Rivys.upvoteComment($scope.rivy, comment, function() {
			comment.upvotes += 1;
		});
	}

	$scope.commentSubmit = function() {
		if (!$scope.commentInput.body) {
			return alert('please enter a comment');
		}
		console.log(rivy.data);
		console.log($scope.commentInput);

		Rivys.submitComment(rivy.data, $scope.commentInput, function(comment) {
			$scope.comments.push(comment);
		})
	}
})
