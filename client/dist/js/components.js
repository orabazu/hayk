/**
* @desc card component 
* @example <card></card>
*/
angular
    .module('app.card', [])
    .directive('cardDirective', cardDirective);
   
function cardDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/card/card.html',
        scope: {
            title: '<',
            summary: '<'
        },
        controller: CardController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function CardController() {
    var vm = this;
}
angular.module('app.core', [
    'app.header',
    'app.footer',
    'app.layout',
    'app.card',
    'app.trackService',
    'ui.router',
    'leaflet-directive'
    ])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$logProvider", function($stateProvider,$urlRouterProvider,$locationProvider,$logProvider) { // provider-injector
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
    vm.tracks = {};
    trackService.getTrack().then(function(respond){ 
        console.log(respond.data); 
        vm.tracks.data = respond.data;
    });

    //MAP STUFF
    vm.center = {
        lat: 39.9032918,
        lng: 32.6223396,
        zoom: 6
    }
    vm.layers = {
        baselayers: {
            Stamen_Terrain: {
                name: 'Arazi',
                url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
                type: 'xyz',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

            },
            Thunderforest_Outdoors: {
                name: 'Outdoor',
                url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
                type: 'xyz',
            } 
        }
    }

    
    // var Thunderforest_Outdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });
//     var Stamen_Terrain = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
//         attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//         subdomains: 'abcd',
//         minZoom: 0,
//         maxZoom: 18,
//         ext: 'png'
//     });
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
        $state.go('layout', {term: vm.elma})
    }   

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