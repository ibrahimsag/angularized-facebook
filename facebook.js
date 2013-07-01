angular.module('facebook', [])

.factory('facebook', ['$rootScope', '$q', '$fb', function ($rootScope, $q, $fb) {

  var login, ensureUserLoggedIn, api;

  login = function () {
    return $fb.login().then(function (response) {
      if (response.authResponse) {
        // resolve promise and propagate via digest
        return response;
      } else {
        // reject promise and propagate via digest
        return $q.reject(response);
      }
    });
  };

  checkLoggedIn = function(response) {
    if (response.status === 'connected') {
      return response;
    } else {
      return $q.reject(response);
    }
  }

  isLoggedIn = function() {
    return $fb.getLoginStatus().then(checkLoggedIn);
  }

  ensureUserLoggedIn = function () {

    return isLoggedIn()
      .then( null, function () {
        // not_authorized || not_logged_in
        return login();
      }
    );
  };

  api = function () {
    return $fb.api.apply(null, arguments)
    .then(function (response) {
      if(response.error)
        return $q.reject(response);
      else
        return response;
    });
  }

  return {
    api: api
  , isLoggedIn: isLoggedIn
  , ensureUserLoggedIn: ensureUserLoggedIn
  }
}])

.provider('$fb', function () {
  var initConfig;
  return {
    initialize: function(config) {
      initConfig = config;
    }
  , $get: ['$window', '$q', '$rootScope', '$timeout', function($window, $q, $rootScope, $timeout) {
      var $fb = {}
      , fbPromise
      , getFB = function() {
        var deferred = $q.defer();

        // TODO: Maybe facebook is down?

        $window.fbAsyncInit = function () {
          if(!initConfig) {
            console.error('did you forget to initialize fb?');
          }
          $window.FB.init(initConfig);
          $rootScope.$apply(function() {
            deferred.resolve($window.FB);
          });
        }

        loadFBSdkAsync();

        return deferred.promise;
      }
      fbPromise = getFB();

      function resolveFBMethod(methodName) {
        $fb[methodName] = function() {
          var deferred = $q.defer()
            , asyncFlag = true
            , args     = Array.prototype.slice.call(arguments); //get arguments to sdk function

          function fbMethodHandler(response) {
            deferred.resolve(response);
            if(asyncFlag)
              $rootScope.$apply();
          }

          function callMethod (FB) {
            asyncFlag = false;
            FB[methodName].apply(null, args);
            asyncFlag = true;
          }

          args.push(fbMethodHandler);
          fbPromise.then(callMethod);
          return deferred.promise;
        }
      }

      angular.forEach(
        ['api', 'ui', 'getLoginStatus', 'getAuthResponse', 'login', 'logout']
      , resolveFBMethod
      );

      return $fb;
    }]
  }
});

function loadFBSdkAsync() {
  // Load the SDK asynchronously
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}
