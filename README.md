angularized-facebook
====================

facebook js-sdk wrap-up for angular.js.

Usage: 
-----
```javascript
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
function MyController(facebook, $fb) {
  
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
  facebook.api('/me/albums?fields=name,photos.fields(id,picture,source,width,height,images)')
  .then(
    function(response) {
      //succeeded
    },
    function(response) {
      //failed
    }
  );
  
  // or open a dialog with core service
  $fb.ui(
  	{
      method: 'feed',
  	  name: 'Facebook Dialogs',
  	  link: 'https://developers.facebook.com/docs/reference/dialogs/',
  	  picture: 'http://fbrell.com/f8.jpg',
  	  caption: 'Reference Documentation',
  	  description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
  	}
  )
  .then(
    function(response) {
      if (response && response.post_id) {
        alert('Post was published.');
      } else {
        alert('Post was not published.');
      }
    }
  );
}
```
