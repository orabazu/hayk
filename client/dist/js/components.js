angular.module('core', ['ui.router'])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider,$urlRouterProvider,$locationProvider) { // provider-injector
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
    }])
    .run(["$state", function($state) { // instance-injector
    	console.log($state);
    }]);
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('core')
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
    .module('core')
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
function trackService() {
	var service = {
		getTrack: getTrack,
	};
	return service;

    ////////////

    function getTrack() {
    	return $http({
    		method: 'POST',
    		url: 'api/tracks',
    	})
    };


}
angular
.module('core')
.factory('trackService', trackService);