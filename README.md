angularized-facebook
====================

facebook service that can be plugged in

Usage: 
-----

    angular.module('app', [ 'facebook']);

    // configure it
    
    angular.module('app').config(['$fbProvider', function ($fbProvider) {
      $fbProvider.initialize({
        appId      : APP_ID, // App ID from the app dashboard
        status     : true,            // Check Facebook Login status
        cookie     : true             // enable cookies to allow the server to access the session
      })
    }]);
    
    // use it
    function MyController
      
      // ask if logged in
      facebook.isLoggedIn()
      .then(
        function(response) {
          // yes logged in
        },
        function(response) {
          // no 
        }
      );
      
      //
      facebook.ensureUserLoggedIn()
      .then(
        function(response) {
          // logged in
        },
        function(response) {
          // login failed
        }
      );
      
      // make an api request
      facebook.api('/me/albums?fields=name,photos.fields(id, picture, source, width, height, images)')
      .then(
        function(response) {
        
        },
        function(response) {
        }
      );
      
      // make an api request
      facebook.ui(uiCallConfig)
      .then(
        function(response) {
        
        },
        function(response) {
        }
      );
    }

