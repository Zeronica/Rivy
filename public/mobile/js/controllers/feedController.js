var app = angular.module('feedController', []);

app.controller('rivyFeedCtrl', function($scope, rivysAtLocation, Rivys) {
	$scope.rivys = rivysAtLocation.data;

	$scope.upvote = function(rivy) {
		Rivys.upvote(rivy, function() {
			rivy.upvotes += 1;
		});
	}
})

app.controller('commentFeedCtrl', function($scope, rivy, Rivys) {
	$scope.comments = rivy.data.comments;

	$scope.commentInput = {
		body: ''
	}

	$scope.upvote = function(comment) {
		Rivys.upvoteComment(comment, function() {
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