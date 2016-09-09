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
    'app.markerParser',
    'ui.router',
    'leaflet-directive'
    ])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$logProvider", function($stateProvider,$urlRouterProvider,$locationProvider,$logProvider) { // provider-injector
        // $locationProvider.html5Mode(true);
        $logProvider.debugEnabled(false);
        $urlRouterProvider.when('', '/#/');
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

function LayoutController($scope,$state,trackService,markerParser,leafletMapEvents) {
    var vm = this;
    vm.tracks = {};

    activate();

    function activate() {
        return getTrack().then(function() {
            // console.log("getTrack activated");
        });
    }

    function getTrack () {
      return trackService.getTrack().then(function(respond){ 
        // console.log(respond.data); 
        vm.tracks.data = respond.data;
        markerParser.jsonToMarkerArray(vm.tracks.data.features)
        .then(function(response) {
            vm.markers = markerParser.toObject(response);
            console.log(vm.markers);
        })
        .catch (function(err){
            console.log(response);
        });
    });  
  }




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
        },
        overlays: {
            rotalar: {
                type: 'group',
                name: 'Rotalar',
                visible: true
            }
        }
    }

    $scope.changeIcon = function (marker) {
        var swap = marker.icon;
        marker.icon = marker.icon_swap;
        marker.icon_swap = swap;
        // if (marker.focus)
        //     marker.focus = false;
        // else
        //     marker.focus = true;
    }

    vm.zoomMarker = function (marker) {
        var latLngs = [[marker.lat, marker.lng]];
        var markerBounds = L.latLngBounds(latLngs);
        leafletData.getMap().then(function (map) {
            map.fitBounds(markerBounds);
        });
    }

    vm.mapEvents = leafletMapEvents.getAvailableMapEvents();

    for (var k in vm.mapEvents){
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function(event ,args){
            vm.event = event;
            vm.args = args
            console.log(args.modelName)
            $scope.changeIcon(vm.markers[args.modelName]);
        });
    }
     console.log(vm.mapEvents);
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
        $state.go('layout', {term: vm.elma})
    }   

}

markerParser.$inject = ["$q"];function markerParser($q) {
	var service = {
		jsonToMarkerArray: jsonToMarkerArray,
        toObject: toObject
    };

    return service;

	// convert feature geojson to array of markers
	function jsonToMarkerArray(val) {
        var defered = $q.defer(); // defered object result of async operation
        var output = [];
        for (var i = 0; i < val.length; i++) {
            var mark = {
                layer: "rotalar",
                lat: val[i].geometry.coordinates[1],
                lng: val[i].geometry.coordinates[0],
                focus: false,
                message: val[i].properties.name,
                icon: {
                    type: 'makiMarker',
                    icon: 'park',
                    color: '#004c00',
                    size: "l"
                },
                icon_swap : {
                    type: 'makiMarker',
                    icon: 'park',
                    color: '#512DA8',
                    size: "l"
                },
                properties: {
                    "name": val[i].properties.name,
                    "altitude" : val[i].properties.altitude,
                    "distance" : val[i].properties.distance,
                    "summary" : val[i].properties.summary
                }
            }
            output.push(mark);
        }
        if(output) {
            defered.resolve(output);
        }
        // else {
        //     defered.reject();
        // }
        return defered.promise;
    }

    function toObject(array) {
        var rv = {};
        for (var i = 0; i < array.length; ++i)
            if (array[i] !== undefined) rv[i] = array[i];
        return rv;        
    }
}

angular
.module('app.markerParser', [])
.factory('markerParser', markerParser);

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