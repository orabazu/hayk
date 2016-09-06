angular.module('core', ['ui.router'])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) { // provider-injector
        // $locationProvider.html5Mode(true);
        $urlRouterProvider.when('', '/');
    	$stateProvider.state('defaultState', {
    		url: '/',
    		templateUrl: '../../components/landing/landing.html'
    	});

    	var layoutState = {
    		name: 'layout',
    		url: '/a/{term}',
    		templateUrl: 'components/layout/layout.html'
    	}   ; 	
    	$stateProvider.state(layoutState);
    })
    .run(function($state) { // instance-injector
    	console.log($state);
    });