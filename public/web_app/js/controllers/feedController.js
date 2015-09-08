var app = angular.module('feedController', []);

app.controller('rivyFeedCtrl', function($scope, $state, rivysAtLocation, Rivys) {
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

app.controller('commentFeedCtrl', function($scope, rivy, Rivys) {
	$scope.rivy = rivy.data;

	$scope.comments = rivy.data.comments;

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