(function () {
    'use strict';
    angular
    .module('app.content', ['app.header', 'app.footer','ui.router'])
    .config(function ($stateProvider) { // provider-injector

        // $urlRouterProvider.when('', '/#/');
        var defaultState = {
            name: 'defaultState', 
            url: '/',
            templateUrl: '../../components/content/landing/landing.html'
        };
        $stateProvider.state(defaultState);
    })
  
})();