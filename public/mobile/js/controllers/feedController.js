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

	$scope.upvote = function(comment) {
		Rivys.upvoteComment(comment, function() {
			comment.upvotes += 1;
		});
	}
})