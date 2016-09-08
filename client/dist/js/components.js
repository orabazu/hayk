angular.module('app.core', [
    'app.header',
    'app.footer',
    'app.layout',
    'app.trackService',
    'ui.router'
    ])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider,$urlRouterProvider,$locationProvider) { // provider-injector
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
      }])
    .run(["$state", function($state) { // instance-injector
    	// console.log($state);
    }]);
/**
* @desc Main layout for application
* @example <layout></layout>
*/
angular
    .module('app.layout',[])
    .directive('layoutDirective', layoutDirective)
    
    function layoutDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: '../../components/layout/layout.html',
            scope: {},
            controller: LayoutController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;  
    } 

    function LayoutController($scope,$state,trackService) {
        var vm = this;
        trackService.getTrack().then(function(respond){ 
            console.log(respond.data); 
            vm.tracks = respond.data;
        });
    }
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('app.footer', [])
    .directive('footerDirective', footerDirective);
   
function footerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/_footer/footer.html',
        // scope: {
        //     max: '='
        // },
        controller: FooterController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function FooterController() {
    var vm = this;
}
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('app.header',[])
    .directive('headerDirective', headerDirective);

function headerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/_header/header.html',
        scope: {},
        controller: HeaderController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function HeaderController($scope,$state) {
    var vm = this;
    vm.search = function(){
        console.log('sdasd');
        $state.go('layout', {term: vm.elma})
    }   

}

trackService.$inject = ["$http"];function trackService($http) {
    var endpoint = 'http:localhost:8080/'

	var service = {
		getTrack: getTrack,
	};
	return service;

    function getTrack() {
    	return $http({
    		method: 'GET',
    		url: 'api/tracks',
            headers: {
               'content-type': 'application/json; charset=utf-8'
            }
    	})
    };
 

} 
angular
.module('app.trackService', [])
.factory('trackService', trackService);