var module = angular.module('starter.services', [])

module.factory('AuthenticationFactory', function($window, $location) {
  var auth = {
    isLogged: false,
    check: function() {
      if ($window.sessionStorage.token && $window.sessionStorage.user) {
        this.isLogged = true;
        this.username = $window.sessionStorage.user;
      } else {
        this.isLogged = false;
        this.username = undefined;
        delete this.user;
        $location.path('/login');
      }
    },
    username: undefined,
  }
  return auth;
})

module.factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory) {
  
  return {
    login: function(username, password) {
      return $http.post('http://localhost:3000/login', {
        username: username,
        password: password
      });
    },
    createAccount: function(username, password) {
      return $http.post('http://localhost:3000/signup', {
        username: username,
        password: password
      }); 
    },
    logout: function() {
      if (AuthenticationFactory.isLogged) {
        AuthenticationFactory.isLogged = false;
        delete AuthenticationFactory.user;
        delete AuthenticationFactory.userRole;

        delete $window.sessionStorage.token;
        delete $window.sessionStorage.user;
      }


      $location.path('/login')
    }
  }

})

module.factory('TokenInterceptor', function($q, $window, $location) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers['X-Access-Token'] = $window.sessionStorage.token;
        config.headers['X-Key'] = $window.sessionStorage.user;
        config.headers['Content-Type'] = 'application/json';
      }
      return config || $q.when(config);
    },

    responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
  }
})

module.factory('Locations', ['$location', '$http', 'UserAuthFactory', function($location, $http, UserAuthFactory) {
	var o = {
		locations: [],
	}

	o.getAll = function(callback) {
		return $http.get('http://localhost:3000/api/v1/locations')
			.success(function(data) {
				angular.copy(data, o.locations);
				if (callback) 
					return callback();
				return;
			})
			.error(function(err) {
				return console.log(err);
			})
	}

	o.autoSuggest = function(partial) {
	}

	return o;
}])

module.factory('Rivys', function($http) {
	var o = {
		rivys: [],
	}

	o.submit = function(newRivyObject) {
		return $http.post('http://localhost:3000/api/v1/rivys', newRivyObject);
	}

	return o;
})