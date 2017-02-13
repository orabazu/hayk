(function () {
    'use strict';

angular.module('app', [
    'app.navbar',
    'app.login',
    'app.register',
    'app.card', 
    'app.profile',
    'app.userService',
    'app.trackService',
    'app.markerParser',
    'app.map',
    'app.content',    
    'app.rota',
    'oc.lazyLoad',
    'ui.router',
    'leaflet-directive',
    'ngAutocomplete'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, $ocLazyLoadProvider) { // provider-injector

    $ocLazyLoadProvider.config({
      debug: true
    });
    $locationProvider.html5Mode(true);
    $logProvider.debugEnabled(false);
    // $urlRouterProvider.when('', '/#/');


    

    var loginState = {
      name: 'login',
      url: '/giris',
      template: '<login-directive></login-directive>'
    };
    $stateProvider.state(loginState);

    var registerState = {
      name: 'register',
      url: '/kayit',
      template: '<register-directive></register-directive>'
    };
    $stateProvider.state(registerState);

    var profileState = {
      name: 'profile',
      url: '/profil',
      template: '<navbar-directive></navbar-directive><profile-directive></profile-directive>'
    };
    $stateProvider.state(profileState);
  })
  .run(function ($rootScope, userService) {
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
