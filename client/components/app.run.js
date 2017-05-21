  (function () {
    'use strict';
  
  angular.module('app').run(function ($rootScope, userService) {
    activate();

    function activate() {
      return getUser().then(function () {

      })
    }

    function getUser() {
      return userService.getUser()
        .then(function (respond) {
          if (respond.data.OperationResult) 
          {
            $rootScope.user = respond.data.user;
            $rootScope.flagLogin = true;
          } 
          else
          {
 
          }
        })
        .catch(function (err) {

        });
    }
  });

  
})();