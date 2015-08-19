var module = angular.module('starter.services', [])

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

	o.getInRadius = function(locationObj, callback) {
    var queryString = locationObj.lat + '/' + locationObj.lng + '/' + 1000;

    return $http.get('http://localhost:3000/api/v1/locations/' + queryString)
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

	return o;
}])

module.factory('Rivys', function($http) {
	var o = {
		rivys: [],
	}

	o.submit = function(newRivyObject) {
		return $http.post('http://localhost:3000/api/v1/rivys', newRivyObject);
	}

  o.submitComment = function(rivy, newCommentObject, cb) {
    return $http.post('http://localhost:3000/api/v1/' + rivy._id + '/comments', newCommentObject).success(function(comment) {
      cb(comment);
    }).error(function(err) {
      console.log(err);
    });
  }

  o.getAtLocation = function(location) {
    return $http.get('http://localhost:3000/api/v1/rivys/' + location._id).success(function(data) {
      return data;
    }).error(function(err) {
      console.log(err);
    })
  }

  o.getOne = function(rivy) {
    return $http.get('http://localhost:3000/api/v1/rivy/' + rivy._id).success(function(data) {
      return data;
    }).error(function(err) {
      console.log(err);
    })
  }

  o.upvote = function(rivy, cb) {
    return $http.get('http://localhost:3000/api/v1/rivy/upvote/' + rivy._id).success(function() {
      cb()
    }).error(function(err) {
      console.log(err);
    })
  }

	return o;
})

//=====================================================================
// Authentication
//=====================================================================

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