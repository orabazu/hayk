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
            summary: '<',
            owner:'<',
            imgSrc:'<',
        },
        controller: CardController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;
}

function CardController() {
    var vm = this; 
    vm.imgSrc = vm.imgSrc.split('client')[1];
    console.log(vm.imgSrc);

} 

angular.module('app', [
    'app.header',
    'app.footer',
    'app.layout',
    'app.navbar',
    'app.login',
    'app.register',
    'app.card',
    'app.profile',
    'app.userService',
    'app.trackService',
    'app.markerParser',
    'app.map',
    'app.rotaekle',
    'oc.lazyLoad',
    'ui.router',
    'leaflet-directive',
    'ngAutocomplete'
  ])
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$logProvider", "$ocLazyLoadProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, $ocLazyLoadProvider) { // provider-injector

    $ocLazyLoadProvider.config({
      debug: true
    });
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
      template: '<navbar-directive></navbar-directive><layout-directive></layout-directive>'
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

    var profileState = {
      name: 'profile',
      url: '/profil',
      template: '<navbar-directive></navbar-directive><profile-directive></profile-directive>'
    };
    $stateProvider.state(profileState);

    var addTrackState = {
      name: 'addtrack',
      url: '/rotaekle',
      templateUrl: '../../components/rotaekle/rotaekle.html',
      controller: 'rotaEkleController',
      controllerAs: 'rotaEkleController'
    };
    $stateProvider.state(addTrackState);

    var addTrackLocationState = {
      name: 'addtrack.location',
      url: '/konum',
      templateUrl: '../../components/rotaekle.location/rotaekle.location.html'      
    };
    $stateProvider.state(addTrackLocationState);

    var addTrackMetaState = {
      name: 'addtrack.meta',
      url: '/bilgi',    
      templateUrl: '../../components/rotaekle.meta/rotaekle.meta.html'              
    }
    $stateProvider.state(addTrackMetaState);

    var addTrackImageState = {
      name: 'addtrack.image',
      url: '/resimler',     
      templateUrl: '../../components/rotaekle.image/rotaekle.image.html'              
    }
    $stateProvider.state(addTrackImageState);

    var addTrackFinishState = {
      name: 'addtrack.finish',
      url: '/kaydet',    
      templateUrl: '../../components/rotaekle.finish/rotaekle.finish.html'              
    }
    $stateProvider.state(addTrackFinishState);
  }])
  .run(["$rootScope", "userService", function ($rootScope, userService) {
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
          console.log(err);
        });
    }
  }]);
/**
 * @desc Main layout for application
 * @example <layout-directive></layout-directive>
 */
angular
    .module('app.layout', [])
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

function LayoutController($scope, $rootScope, $state, trackService, markerParser, mapConfigService, leafletMapEvents, leafletData) {
    var vm = this;
    vm.tracks = {}; 

    activate();

    function activate() {
        return getTrack().then(function () {});
    }

    function getTrack() {
        return trackService.getTrack().then(function (respond) {
            vm.tracks.data = respond.data;
            console.log(vm.tracks.data);
            markerParser.jsonToMarkerArray(vm.tracks.data).then(function (response) {
                vm.markers = markerParser.toObject(response);
                console.log(vm.markers);
                var bounds = L.geoJson(vm.tracks.data).getBounds();
                leafletData.getMap().then(function (map) {
                    map.fitBounds(bounds);
                });
            }).catch(function (err) {
                console.log(response);
            });
        });
    }

    vm.layers = mapConfigService.getLayer();
    vm.center = mapConfigService.getCenter();

    vm.changeIcon = function (marker) {
        // var swap = marker.icon;
        // marker.icon = marker.icon_swap;
        // marker.icon_swap = swap;
        // if (marker.focus)
        //     marker.focus = false;
        // else
        //     marker.focus = true;

        marker.icon = {
            type: 'makiMarker',
            icon: 'park',
            color: '#512DA8',
            size: "l"
        }
    }

    vm.removeIcon = function (marker) {
        marker.icon = {
            type: 'makiMarker',
            icon: 'park',
            color: '#004c00',
            size: "l"
        }
    }

    vm.zoomMarker = function (marker) {
        var latLngs = [
            [marker.lat, marker.lng]
        ];
        var markerBounds = L.latLngBounds(latLngs);
        leafletData.getMap().then(function (map) {
            map.fitBounds(markerBounds);
        });
    }

    vm.mapEvents = leafletMapEvents.getAvailableMapEvents();

    for (var k in vm.mapEvents) {
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function (event, args) {
            if (event.name == 'leafletDirectiveMarker.mouseover') {
                vm.changeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMarker.mouseout') {
                vm.removeIcon(vm.markers[args.modelName]);
            }

        });
    }

}
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('app.login', [])
    .directive('loginDirective', loginDirective);
   
function loginDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/login/login.html',
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
    .module('app.navbar', [])
    .directive('navbarDirective', navbarDirective);
   
function navbarDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/navbar/navbar.html',
        // scope: {
        //     max: '='
        // },
        controller: navbarController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function navbarController() {
    var vm = this;
}
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('app.register', [])
    .directive('registerDirective', registerDirective);
   
function registerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/register/register.html',
        // scope: {
        //     max: '='
        // },
        controller: registerController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function registerController() {
    var vm = this;
}
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('app.profile', [])
    .directive('profileDirective', profileDirective);

function profileDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/profile/profile.html',
        // scope: {
        //     max: '='
        // },
        transclude: true,
        controller: profileController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function profileController($rootScope, userService,trackService,markerParser) {
    var vm = this;
    vm.tracks = {};
    activate();

    function activate() {
        return getTrack().then(function () {
            
        })
    }

    function getTrack() {
        return trackService.getTrack().then(function (respond) {
            vm.tracks.data = respond.data;
            markerParser.jsonToMarkerArray(vm.tracks.data)
                .then(function (response) {
                    vm.markers = markerParser.toObject(response);
                })
                .catch(function (err) {
                    console.log(response);
                });
        });
    }
}

rotaEkleController.$inject = ["$scope", "mapConfigService", "reverseGeocode", "trackService", "$state", "Upload"];function rotaEkleController($scope, mapConfigService, reverseGeocode, trackService, $state, Upload) {
  // $ocLazyLoad.load('../../services/map/map.autocomplete.js');  
  var vm = this;
  vm.layers = mapConfigService.getLayer();
  vm.center = mapConfigService.getCenter();
  vm.location;

  //Track parameters
  vm.ownerId;
  vm.img_src = "src";
  vm.summary;
  vm.altitude;
  vm.distance;
  vm.name = '';
  vm.coordinates = [];

  $scope.loginLoading = true;

  vm.addTrack = function () {
    trackService.addTrack(vm).then(function (addTrackResponse) {
      $state.go('layout');
    }, function (addTrackError) {
      console.log(addTrackError);
    })
  }
  vm.uploadPic = function (file) {
    if(file)
    {
vm.uploading = true;
    file.upload = Upload.upload({
      url: 'api/photos/',
      data: {
        file: file
      },
    }).then(function (resp) {
        if (resp.data.OperationResult === true) {
          vm.img_src = resp.data.Data.path
          $state.go('addtrack.finish');
        } else {
          console.log('an error occured');
        }
      },
      function (resp) { //catch error
        console.log('Error status: ' + resp.status);
      })['finally'](
      function () {
        vm.uploading = false;
      }); 
    }
    
  }

  angular.extend($scope, {
    markers: {
      mainMarker: {
        lat: vm.coordinates[0],
        lng: vm.coordinates[1],
        focus: true,
        message: "Başka bir noktaya tıklayarak kaydır.",
        draggable: true
      }
    }
  });

  $scope.$on("leafletDirectiveMap.click", function (event, args) {
    var leafEvent = args.leafletEvent;
    reverseGeocode.geocodeLatlng(leafEvent.latlng.lat, leafEvent.latlng.lng).then(function (geocodeSuccess) {
        vm.location = geocodeSuccess;
      },
      function (err) {
        console.log(err)
      });
    $scope.markers.mainMarker.lat = leafEvent.latlng.lat;
    $scope.markers.mainMarker.lng = leafEvent.latlng.lng;
    vm.coordinates = [leafEvent.latlng.lng, leafEvent.latlng.lat];
  });
}

angular
  .module('app.rotaekle', ['app.map', 'ngAutocomplete', 'app.trackService', 'ngFileUpload', 'angular-ladda'])
  .controller('rotaEkleController', rotaEkleController)

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
    };
  
    return directive;
}

/**
 * @desc Services that converts geojson features to markers for handling later
 */

markerParser.$inject = ["$q"];
function markerParser($q) {
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
                // icon_swap : {
                //     type: 'makiMarker',
                //     icon: 'park',
                //     color: '#512DA8',
                //     size: "l"
                // },
                properties: {
                    "name": val[i].properties.name,
                    "altitude" : val[i].properties.altitude,
                    "distance" : val[i].properties.distance,
                    "summary" : val[i].properties.summary,
                    "owner": val[i].properties.ownerId,
                    "img_src":val[i].properties.img_src,
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
		addTrack: addTrack
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

	function addTrack(track) {
		return $http({
			method: 'POST',
			url: 'api/tracks',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}, 
			data: $.param({
				"name": track.name,
				"distance": track.distance,
				"altitude": track.altitude,
					"summary": track.summary,
					"img_src": track.img_src,
					"coordinates": track.coordinates,
					"ownerId": "57d93e47a8a684a86b000001"
			})
		})
	}


}
angular
	.module('app.trackService', [])
	.factory('trackService', trackService);

userService.$inject = ["$http"];function userService($http) {
	var service = {
		getUser: getUser,
	};
	return service;

    function getUser() {
    	return $http({
    		method: 'GET',
    		url: 'api/profile'
    	})
    }; 
} 
angular
.module('app.userService', [])
.factory('userService', userService);
'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Simple Usage:
 *
 * <input type="text" ng-autocomplete="result"/>
 *
 * creates the autocomplete text box and gives you access to the result
 *
 *   + `ng-autocomplete="result"`: specifies the directive, $scope.result will hold the textbox result
 *
 *
 * Advanced Usage:
 *
 * <input type="text" ng-autocomplete="result" details="details" options="options"/>
 *
 *   + `ng-autocomplete="result"`: specifies the directive, $scope.result will hold the textbox autocomplete result
 *
 *   + `details="details"`: $scope.details will hold the autocomplete's more detailed result; latlng. address components, etc.
 *
 *   + `options="options"`: options provided by the user that filter the autocomplete results
 *
 *      + options = {
 *           types: type,        string, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *           bounds: bounds,     google maps LatLngBounds Object
 *           country: country    string, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *         }
 *
 *
 */

angular.module( "ngAutocomplete", [])
  .directive('ngAutocomplete', ["$parse", function($parse) {
    return {

      scope: {
        details: '=',
        ngAutocomplete: '=',
        options: '='
      },

      link: function(scope, element, attrs, model) {

        //options for autocomplete
        var opts

        //convert options provided to opts
        var initOpts = function() {
          opts = {}
          if (scope.options) {
            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
            }
            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
            }
            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
            }
          }
        }
        initOpts()

        //create new autocomplete
        //reinitializes on every change of the options provided
        var newAutocomplete = function() {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {
//              if (scope.details) {
                scope.details = scope.gPlace.getPlace();
//              }
              scope.ngAutocomplete = element.val();
            });
          })
        }
        newAutocomplete()

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
          newAutocomplete()
          element[0].value = '';
          scope.ngAutocomplete = element.val();
        }, true);
      }
    };
  }]);
function mapConfigService() {

    var service = {
        getLayer: getLayer,
        getCenter: getCenter,
    };
    return service;

    function getLayer() {
        var layers = {
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
    return layers;
    };

    function getCenter() {
        var center = {
            lat: 39.9032918,
            lng: 32.6223396,
            zoom: 6
        }
        return center;
    }

}

angular
    .module('app.map', [])
    .factory('mapConfigService', mapConfigService);

geocode.$inject = ["$q"];function geocode($q) {
  return { 
    geocodeAddress: function(address) {
      var geocoder = new google.maps.Geocoder();
      var deferred = $q.defer();
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          return deferred.resolve(results[0].geometry.location);
          // window.findLocation(results[0].geometry.location);
        }
        return deferred.reject();
      });
      return deferred.promise;
    }
  };
}

angular
 .module('app.map')
 .factory('geocode', geocode);

reverseGeocode.$inject = ["$q", "$http"];function reverseGeocode($q, $http) {
    var obj = {};
    obj.geocodeLatlng = function geocodePosition(lat, lng) {
        var geocoder = new google.maps.Geocoder();
        var deferred = $q.defer();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
            latLng: latlng
        }, function(responses) {
            if (responses && responses.length > 0) {
                return deferred.resolve(responses[0].formatted_address);
            } else {
                return deferred.resolve(null);
            }
        }, function (err) {
            return deferred.resolve(null);
        });
        return deferred.promise;
    }
    return obj;
}

angular
 .module('app.map')
 .factory('reverseGeocode', reverseGeocode);