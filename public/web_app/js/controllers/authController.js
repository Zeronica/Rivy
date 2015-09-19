angular.module('authController', [])

.controller('AccountCtrl', ['$scope', 'UserAuthFactory', 'AuthenticationFactory', function($scope, UserAuthFactory, AuthenticationFactory) {
	debugger;
	$scope.logout = function() {
		UserAuthFactory.logout();
	}

	$scope.username = AuthenticationFactory.username;
}])

.controller('LoginCtrl', ['$state', '$scope', '$window', 'UserAuthFactory', 'AuthenticationFactory','$rootScope',	
	function($state, $scope, $window, UserAuthFactory, AuthenticationFactory,$rootScope) {
		// $rootScope.switches = true ;
		$scope.user = {
			username: 'dummy@gmail.com',
			password: 'password'
		}

		$scope.create = function(){
			location.href = '#createAccount';
		}

		$scope.userCreate = {
			username: '',
			password: '',
			rePassword: ''
		}

		$scope.login = function() {
			var username = $scope.user.username,
				password = $scope.user.password;

			if (username != undefined && password != undefined) {
				UserAuthFactory.login(username, password).success(function(data) {

					AuthenticationFactory.isLogged = true;
					AuthenticationFactory.user = data.user;

					$window.sessionStorage.token = data.token;
					$window.sessionStorage.user = data.user.username;

					console.log(AuthenticationFactory.user);

					$scope.user.username = '';
					$scope.user.password = '';

					$state.go('home');
				}).error(function(result){
					// code implies error
					if (result.status === 401) {
						$scope.user.password = '';
						alert('Incorrect username or password');
					} else {
						alert('Oops something went wrong!');
					}
				});
			} else {
				alert('Invalid credentials');
			}
		};

		$scope.createAccount = function() {
			var username = $scope.userCreate.username,
				password = $scope.userCreate.password;
				rePassword = $scope.userCreate.rePassword;

			if (username != undefined && password != undefined && rePassword != undefined
					&& password === rePassword) {
				UserAuthFactory.createAccount(username, password).success(function(data) {
					AuthenticationFactory.isLogged = true;
					AuthenticationFactory.user = data.user;

					$window.sessionStorage.token = data.token;
					$window.sessionStorage.user = data.user.username;

					$scope.user.username = '';
					$scope.user.password = '';

					$state.go('home');
				}).error(function(result){
					// code implies error
					if (result.status === 401) {
						$scope.user.password = '';
						alert('That account already exists!');
					} else {
						alert('Oops something went wrong!');
					}
				});
			} else {
				alert('Invalid credentials');
			}
		};
}]);