angular.module('app.core', [
    'app.header',
    'app.footer',
    'app.layout',
    'app.card',
    'app.trackService',
    'ui.router',
    'leaflet-directive'
    ])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider,$logProvider) { // provider-injector
        // $locationProvider.html5Mode(true);
        $logProvider.debugEnabled(false);
        $urlRouterProvider.when('', '/');
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
      })
    .run(function($state) { // instance-injector
    	// console.log($state);
    }); 