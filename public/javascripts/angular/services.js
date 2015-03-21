angular.module('myApp.services', [])

.factory('locations',
  ['$http', 
  function($http) {
    var o = {
      locations: []
    };

    // get all the locations given two parameters
    o.getAll = function(long, lat, radius) {
      $http.get("http://localhost:3000/rivys")
        .success(function(data) {
          angular.copy(data, o.rivys);
        }).error(function (data) {
          alert("error with loading rivys");
        })
      return;
    }
  ]
);
