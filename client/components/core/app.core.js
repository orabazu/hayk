angular.module('app.core', [
    'app.header',
    'app.footer',
    'app.layout',
    'app.trackService',
    'ui.router'
    ])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) { // provider-injector
        // $locationProvider.html5Mode(true);
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
              templateUrl: 'components/layout/layout.html'
            }; 	
        $stateProvider.state(layoutState);
      })
    .run(function($state) { // instance-injector
    	// console.log($state);
    });