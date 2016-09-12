angular.module('app.core', [
    'app.header',
    'app.footer',
    'app.layout',
    'app.login',
    'app.register',
    'app.card',
    'app.trackService',
    'app.markerParser',
    'ui.router',
    'leaflet-directive'
    ])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider,$logProvider) { // provider-injector
        $locationProvider.html5Mode(true);
        $logProvider.debugEnabled(false);
        // $urlRouterProvider.when('', '/#/');
        var defaultState = {
            name: 'defaultState',
            url: '/',
            templateUrl: '../../components/landing/landing.html'
        };
        $stateProvider.state(defaultState);

        var layoutState = {
          name: 'layout',
          url: '/a/{term}',
          template: '<layout-directive></layout-directive>'
      }; 	
      $stateProvider.state(layoutState);

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
  })
    .run(function($state) { // instance-injector
    	// console.log($state);
    }); 