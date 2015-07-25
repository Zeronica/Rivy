// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.interceptors.push('TokenInterceptor');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: "/login",
    templateUrl: "mobile/templates/login.html",
    controller: "LoginCtrl",
    access: {
      requiredLogin: false
    }
  }).state('login-createAccount', {
    url: "/login-createAccount",
    templateUrl: "mobile/templates/login-createAccount.html",
    controller: "LoginCtrl",
    access: {
      requiredLogin: false
    }
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "mobile/templates/tabs.html"
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'mobile/templates/tab-home.html',
        controller: 'HomeCtrl',
        resolve: {
          locationsPromise: ['Locations', 'UserAuthFactory', function(Locations, UserAuthFactory){
              Locations.getAll();
          }]
        }
      }
    }
    ,access: {
      requiredLogin: true
    }
  })
  .state('tab.rivyFeed', {
    url: '/rivyFeed/:location_id',
    views: {
      'tab-home': {
        templateUrl: 'mobile/templates/tab-rivyFeed.html',
        controller: 'rivyFeedCtrl',
        resolve: {
          rivysAtLocation: function($stateParams, Rivys) {
            return Rivys.getAtLocation({_id: $stateParams.location_id});
          }
        }
      }
    },
    access: {
      requiredLogin: true
    }
  })
  .state('tab.commentFeed', {
    url: '/commentFeed/:rivy_id',
    views: {
      'tab-home': {
        templateUrl: 'mobile/templates/tab-commentFeed.html',
        controller: 'commentFeedCtrl',
        resolve: {
          rivy: function($stateParams, Rivys) {
            return Rivys.getOne({_id: $stateParams.rivy_id});
          }
        }
      }
    },
    access: {
      requiredLogin: true
    }
  })
  .state('tab.home-input1', {
    url: '/home/input1',
    views: {
      'tab-home': {
        templateUrl: 'mobile/templates/tab-home-input1.html',
        controller: 'HomeInputCtrl'
      },
    access: {
      requiredLogin: true
    }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'mobile/templates/tab-account.html',
        controller: 'AccountCtrl',
        resolve: {
          accountPromise: ['AuthenticationFactory', function(AuthenticationFactory) {
            return AuthenticationFactory.check();
          }]
        }
      }
    },
    access: {
      requiredLogin: true
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

})

.run(function($ionicPlatform, $state, $rootScope, $location, $window, AuthenticationFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });

  AuthenticationFactory.check();
 
  $rootScope.$on("$stateChangeStart", function(event, next) {
    console.log(AuthenticationFactory.isLogged);
    if ((next.access && next.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path('/login');
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });
})
