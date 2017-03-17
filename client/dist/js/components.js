String.prototype.replaceAll = function (search, replacement) {
    var target = this;

    return target.split(search).join(replacement);
};


window.loadAutoComplete = function () {
    $('.geocode-autocomplete').each(function () {
        var that = this;
        $(that).typeahead({
            source: function (query, process) {
                var predictions = [];
                $.getJSON('https://geocode-maps.yandex.ru/1.x/?results=5&bbox=24.125977,34.452218~45.109863,42.601620&format=json&lang=tr_TR&geocode=' + query, function (data) {
                    for (var i = 0; i < data.response.GeoObjectCollection.featureMember.length; i++) {
                        var item = {
                            name: data.response.GeoObjectCollection.featureMember[i].GeoObject.name + ', ' +data.response.GeoObjectCollection.featureMember[i].GeoObject.description.replace(', Türkiye', ''),
                            description: data.response.GeoObjectCollection.featureMember[i].GeoObject.description,
                            longlat: data.response.GeoObjectCollection.featureMember[i].GeoObject.Point.pos,
                            type: data.response.GeoObjectCollection.featureMember[i].GeoObject.metaDataProperty.GeocoderMetaData.kind,
                            alt_type: data.response.GeoObjectCollection.featureMember[i].GeoObject.metaDataProperty.GeocoderMetaData,
                            bbox: data.response.GeoObjectCollection.featureMember[i].GeoObject.boundedBy.Envelope,
                        };
                        if (item.description.indexOf('Türkiye') === -1)
                            continue;
                        predictions.push(item);
                    }
                    // if (predictions && predictions.length) {
                    //     var results = $.map(predictions,
                    //         function (prediction) {
                    //             var dest = prediction.name + ", " + prediction.description;
                    //             dest = dest.replace(', Türkiye', '');
                    //             return dest;
                    //         })
                    // }

                    return process(predictions);
                });
            },
            afterSelect: function (item) {
                var a = document.createElement('a');
                a.href = '/a/' + item.name +
                    '?latSW=' + item.bbox.lowerCorner.split(' ')[1] +
                    '&lngSW=' + item.bbox.lowerCorner.split(' ')[0] +
                    '&latNE=' + item.bbox.upperCorner.split(' ')[1] +
                    '&lngNE=' + item.bbox.upperCorner.split(' ')[0];
                document.body.appendChild(a);
                a.click();
            },
            highlighter: function (item) {
                console.log(item)
                item = '<span class="item-address">' + item + '</span>';
                return item;
            },
            minLength: 3,
            fitToElement: true,
            matcher: function () {
                return true;
            },
            updater: function (item) {
                return item;
            }
        });
        $(that).on('typeahead:change',
            function (e, item) {
                $(that).val(item.find('a>span.item-address').text());
            });

    });
}

window.loadAutoComplete();
(function () {
    'use strict';

angular.module('app', [
    'app.navbar',
    'app.login',
    'app.register',
    'app.card', 
    'app.profile',
    'app.userService',
    'app.trackService',
    'app.markerParser',
    'app.map',
    'app.content',    
    'app.rota',
    'oc.lazyLoad',
    'ui.router',
    'leaflet-directive',
    'ngAutocomplete'
  ])
  .config(['$stateProvider','$locationProvider','$logProvider','$ocLazyLoadProvider','$compileProvider', function ($stateProvider, $locationProvider, $logProvider, $ocLazyLoadProvider,$compileProvider) { // provider-injector

    $ocLazyLoadProvider.config({
      debug: true
    });
    $locationProvider.html5Mode(true);
    $logProvider.debugEnabled(false);
    // $urlRouterProvider.when('', '/#/');
    $compileProvider.debugInfoEnabled(false);

    

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

        });
    }
  }]);

  })(); 

(function () {
    'use strict';
    angular
    .module('app.content', ['app.header', 'app.footer','ui.router'])
    .config(["$stateProvider", function ($stateProvider) { // provider-injector

        // $urlRouterProvider.when('', '/#/');
        var defaultState = {
            name: 'defaultState', 
            url: '/',
            templateUrl: '../../components/content/landing/landing.html'
        };
        $stateProvider.state(defaultState);
    }])
  
})();

(function () {
    'use strict';
    angular
        .module('app.rota', ['app.layout', 'app.layoutDetail', 'app.rotaekle', 'ui.router'])
        .config(["$stateProvider", function ($stateProvider) { // provider-injector

            var layoutState = {
                name: 'layout',
                url: '/a/{term}?latSW&lngSW&latNE&lngNE',
                template: '<navbar-directive></navbar-directive><layout-directive></layout-directive>',
                reloadOnSearch: false,
            };
            $stateProvider.state(layoutState);

            var layoutDetailState = {
                name: 'layoutDetail',
                url: '/rota/:id',
                template: '<navbar-directive></navbar-directive><layout-detail-directive></layout-detail-directive>'
            };
            $stateProvider.state(layoutDetailState);
 
            var addTrackState = {
                name: 'addtrack',
                url: '/rotaekle',
                templateUrl: '../../components/rota/rotaekle/rotaekle.html',
                controller: 'rotaEkleController',
                controllerAs: 'rotaEkleController'
            };
            $stateProvider.state(addTrackState);

            var addTrackLocationState = {
                name: 'addtrack.location',
                url: '/konum',
                templateUrl: '../../components/rota/rotaekle.location/rotaekle.location.html'
            };
            $stateProvider.state(addTrackLocationState);

            var addTrackMetaState = {
                name: 'addtrack.meta',
                url: '/bilgi',
                templateUrl: '../../components/rota/rotaekle.meta/rotaekle.meta.html'
            }
            $stateProvider.state(addTrackMetaState);

            var addTrackImageState = {
                name: 'addtrack.image',
                url: '/resimler',
                templateUrl: '../../components/rota/rotaekle.image/rotaekle.image.html'
            }
            $stateProvider.state(addTrackImageState);

            var addTrackGPXState = {
                name: 'addtrack.gpx',
                url: '/gpx',
                templateUrl: '../../components/rota/rotaekle.gpx/rotaekle.gpx.html'
            }
            $stateProvider.state(addTrackGPXState);

            var addTrackFinishState = {
                name: 'addtrack.finish',
                url: '/kaydet',
                templateUrl: '../../components/rota/rotaekle.finish/rotaekle.finish.html'
            }
            $stateProvider.state(addTrackFinishState);

            
        }])

})();
(function () {
    'use strict';
angular
    .module('app.footer', [])
    .directive('footerDirective', footerDirective);
   
function footerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/content/footer/footer.html',
    };
  
    return directive;
}
})(); 
 

(function () {
    'use strict';
    angular
        .module('app.header', [])
        .directive('headlineDirective', headlineDirective);

    function headlineDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: '../../components/content/headline/headline.html',
            scope: {},
            controller: HeadlineController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    HeadlineController.$inject = ['$scope', '$state'];

    function HeadlineController($scope, $state) {
        var vm = this;
        window.loadAutoComplete();
        vm.search = function () {
            $state.go('layout', {
                term: vm.elma
            })
        }

        $("#Autocomplete").focus(function () {
            $('html, body').animate({
                scrollTop: $("#Autocomplete").offset().top - 80
            }, 300);
        });

    }
})();
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
        templateUrl: '../../components/common/card/card.html',
        scope: {
            title: '<',
            summary: '<',
            owner:'<',
            imgSrc:'<',
            id: '<',
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
        templateUrl: '../../components/user/login/login.html',
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
    .module('app.profile', [])
    .directive('profileDirective', profileDirective);

function profileDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/user/profile/profile.html',
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



profileController.$inject = ['$rootScope', 'userService', 'trackService', 'markerParser'];

function profileController($rootScope, userService,trackService,markerParser) {
    var vm = this;
    vm.tracks = {};
    activate();

    function activate() {
  
    }
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
        templateUrl: '../../components/user/navbar/navbar.html',
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
        templateUrl: '../../components/user/register/register.html',
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
angular
    .module('app.layoutDetail', [])
    .directive('layoutDetailDirective', layoutDetailDirective)

function layoutDetailDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/rota/layout.detail/layout.detail.html',
        scope: {},
        controller: LayoutDetailController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

LayoutDetailController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData'];

function LayoutDetailController($scope, $stateParams, trackService, mapConfigService, leafletData) {
    var vm = this;
    vm.trackDetail = {};
    vm.center = {};

    activate();

    function activate() {
        trackService.getTrackDetail($stateParams.id).then(function (res) {
            vm.trackDetail = res.data;
            vm.trackDetail.properties.img_src = vm.trackDetail.properties.img_src.split('client')[1].replaceAll('\\', '/')
            vm.center = {
                lat: vm.trackDetail.geometry.coordinates[1],
                lng: vm.trackDetail.geometry.coordinates[0],
                zoom: 12
            }
            // console.log(vm.center);
            leafletData.getMap().then(function (map) {
                var gpx = vm.trackDetail.properties.gpx; // URL to your GPX file or the GPX itself
                new L.GPX(gpx, {
                    async: true
                }).on('loaded', function (e) {
                    map.fitBounds(e.target.getBounds());
                }).addTo(map);             
            });

        })
    }


    vm.layers = mapConfigService.getLayer();


}
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
        templateUrl: '../../components/rota/layout/layout.html',
        scope: {},
        controller: LayoutController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

LayoutController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'trackService', 'markerParser', 'mapConfigService', 'leafletMapEvents', 'leafletData', '$location'];

function LayoutController($scope, $rootScope, $state, $stateParams, trackService, markerParser, mapConfigService, leafletMapEvents, leafletData, $location) {
    var vm = this;
    vm.tracks = {};
    vm.getTrack = getTrack;
    vm.mapAutoRefresh = true;
    vm.params = {
        latNE: parseFloat($stateParams.latNE),
        lngNE: parseFloat($stateParams.lngNE),
        latSW: parseFloat($stateParams.latSW),
        lngSW: parseFloat($stateParams.lngSW),
    }
    activate();

    function activate() {
        if (vm.params.latNE && vm.params.lngNE && vm.params.latSW && vm.params.lngSW) {
            leafletData.getMap().then(function (map) {
                var bounds = [
                    [vm.params.latNE, vm.params.lngNE],
                    [vm.params.latSW, vm.params.lngSW],
                ];
                map.fitBounds(bounds);
                return vm.getTrack().then(function () {});
            });

        } else {
            return vm.getTrack().then(function () {});
        }
    }

    function getTrack() {
        return trackService.getTrack(vm.params).then(function (respond) {
            vm.tracks.data = respond.data;
            if (vm.tracks.data == []) {

            }
            markerParser.jsonToMarkerArray(vm.tracks.data).then(function (response) {
                vm.markers = markerParser.toObject(response);
                var bounds = L.geoJson(vm.tracks.data).getBounds();
                // leafletData.getMap().then(function (map) {
                //     map.fitBounds(bounds);
                // });

            }).catch(function (err) {});
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
        // console.log($location.search().latNE = 20);
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
        // console.log(vm.mapEvents);
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function (event, args) {
            if (event.name == 'leafletDirectiveMarker.mouseover') {
                vm.changeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMarker.mouseout') {
                vm.removeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMap.moveend') {
                console.log(asd);
            }
        });
    }
    var mapEvent = 'leafletDirectiveMap.moveend';

    $scope.$on(mapEvent, function (event, args) {
        // console.log(args.leafletObject);
        if (vm.mapAutoRefresh) {
            if (vm.markers != undefined) {
                vm.params.latNE = args.leafletObject.getBounds()._northEast.lat;
                vm.params.lngNE = args.leafletObject.getBounds()._northEast.lng;
                vm.params.latSW = args.leafletObject.getBounds()._southWest.lat;
                vm.params.lngSW = args.leafletObject.getBounds()._southWest.lng;
            }
            $location.search({
                'latNE': args.leafletObject.getBounds()._northEast.lat,
                'lngNE': args.leafletObject.getBounds()._northEast.lng,
                'latSW': args.leafletObject.getBounds()._southWest.lat,
                'lngSW': args.leafletObject.getBounds()._southWest.lng
            })
            leafletData.getMap().then(function (map) {
                // map.fitBounds(bounds);
                return vm.getTrack().then(function () {});
            });
        }


    })
    $scope.$on('$routeUpdate', function () {
        alert(1)
    });

}
(function () {
    'use strict';

    angular
        .module('app.rotaekle', ['app.map', 'ngAutocomplete', 'app.trackService', 'ngFileUpload', 'angular-ladda'])
        .controller('rotaEkleController', rotaEkleController)


    rotaEkleController.$inject = ['$scope', '$rootScope', 'mapConfigService', 'reverseGeocode', 'trackService', '$state', 'Upload'];

    function rotaEkleController($scope, $rootScope, mapConfigService, reverseGeocode, trackService, $state, Upload) {
        // $ocLazyLoad.load('../../services/map/map.autocomplete.js');
        var vm = this;
        vm.layers = mapConfigService.getLayer();
        vm.center = mapConfigService.getCenter();
        vm.location;

        //Track parameters
        vm.ownedBy = $rootScope.user._id;
        vm.img_src = "src";
        vm.summary;
        vm.altitude;
        vm.distance;
        vm.name = '';
        vm.coordinates = [];
        vm.uploadGPX = uploadGPX;
        vm.uploadPic = uploadPic;


        $scope.loginLoading = true;

        vm.addTrack = function () {
            trackService.addTrack(vm).then(function (addTrackResponse) {
                $state.go('layout');
            }, function (addTrackError) {

            })
        }

        function uploadPic(file) {
            if (file) {
                vm.uploading = true;
                file.upload = Upload.upload({
                        url: 'api/photos/',
                        data: {
                            file: file
                        },
                    })
                    .then(function (resp) {
                            if (resp.data.OperationResult === true) {
                                vm.img_src = resp.data.Data.path
                                $state.go('addtrack.gpx');
                            } else {

                            }
                        },
                        function (resp) { //catch error

                        })['finally'](
                        function () {
                            vm.uploading = false;
                        });
            }
        }

        function uploadGPX(file) {
            if (file) {
                vm.uploading = true;
                file.upload = Upload.upload({
                        url: 'api/gpx',
                        data: {
                            file: file
                        },
                    })
                    .then(function (resp) {
                            if (resp.data.OperationResult === true) {
                                vm.gpx = resp.data.Data.path
                                $state.go('addtrack.finish');
                            } else {

                            }
                        },
                        function (resp) { //catch error

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

                });
            $scope.markers.mainMarker.lat = leafEvent.latlng.lat;
            $scope.markers.mainMarker.lng = leafEvent.latlng.lng;
            vm.coordinates = [leafEvent.latlng.lng, leafEvent.latlng.lat];
        });
    }

})();

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
                    "id": val[i]._id,
                    "name": val[i].properties.name,
                    "altitude" : val[i].properties.altitude,
                    "distance" : val[i].properties.distance,
                    "summary" : val[i].properties.summary,
                    "owner": val[i].properties.ownedBy,
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
		addTrack: addTrack,
		getTrackDetail:getTrackDetail,
	};
	return service;

	function getTrack(params) {
		return $http({
			method: 'GET',
			url: 'api/tracks?latNE='+ params.latNE+'&lngNE='+params.lngNE +'&latSW='+params.latSW +'&lngSW='+params.lngSW,
			headers: {
				'content-type': 'application/json; charset=utf-8'
			},
		})
	};

	function getTrackDetail(id) {
		return $http({
			method: 'GET',
			url: 'api/tracks/'+id,
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
				"ownedBy": track.ownedBy,
				"gpx": track.gpx,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJsYXlvdXQuZGV0YWlsL2xheW91dC5kZXRhaWwuanMiLCJsYXlvdXQvbGF5b3V0LmpzIiwicm90YWVrbGUvcm90YWVrbGUuanMiLCJyb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIm1hcC9tYXAuYXV0b2NvbXBsZXRlLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8s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RyxTQUFTOzs7UUFHOUMsT0FBTyxTQUFTOztNQUVsQixPQUFPLFNBQVM7Ozs7O0FBS3RCO0VBQ0UsT0FBTztFQUNQLFFBQVEsV0FBVyxTQUFTOzt5Q0NuQjlCLFNBQVMsZUFBZSxJQUFJLE9BQU87SUFDL0IsSUFBSSxNQUFNO0lBQ1YsSUFBSSxnQkFBZ0IsU0FBUyxnQkFBZ0IsS0FBSyxLQUFLO1FBQ25ELElBQUksV0FBVyxJQUFJLE9BQU8sS0FBSztRQUMvQixJQUFJLFdBQVcsR0FBRztRQUNsQixJQUFJLFNBQVMsSUFBSSxPQUFPLEtBQUssT0FBTyxLQUFLO1FBQ3pDLFNBQVMsUUFBUTtZQUNiLFFBQVE7V0FDVCxTQUFTLFdBQVc7WUFDbkIsSUFBSSxhQUFhLFVBQVUsU0FBUyxHQUFHO2dCQUNuQyxPQUFPLFNBQVMsUUFBUSxVQUFVLEdBQUc7bUJBQ2xDO2dCQUNILE9BQU8sU0FBUyxRQUFROztXQUU3QixVQUFVLEtBQUs7WUFDZCxPQUFPLFNBQVMsUUFBUTs7UUFFNUIsT0FBTyxTQUFTOztJQUVwQixPQUFPOzs7QUFHWDtFQUNFLE9BQU87RUFDUCxRQUFRLGtCQUFrQixnQkFBZ0IiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uIChzZWFyY2gsIHJlcGxhY2VtZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlbWVudCk7XHJcbn07XHJcblxyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcuZ2VvY29kZS1hdXRvY29tcGxldGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGF0KS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChxdWVyeSwgcHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZWRpY3Rpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICAkLmdldEpTT04oJ2h0dHBzOi8vZ2VvY29kZS1tYXBzLnlhbmRleC5ydS8xLngvP3Jlc3VsdHM9NSZiYm94PTI0LjEyNTk3NywzNC40NTIyMTh+NDUuMTA5ODYzLDQyLjYwMTYyMCZmb3JtYXQ9anNvbiZsYW5nPXRyX1RSJmdlb2NvZGU9JyArIHF1ZXJ5LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubmFtZSArICcsICcgK2RhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbi5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdsYXQ6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5Qb2ludC5wb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLmtpbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRfdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJib3g6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5ib3VuZGVkQnkuRW52ZWxvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRlc2NyaXB0aW9uLmluZGV4T2YoJ1TDvHJraXllJykgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChwcmVkaWN0aW9ucyAmJiBwcmVkaWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHJlc3VsdHMgPSAkLm1hcChwcmVkaWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZ1bmN0aW9uIChwcmVkaWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGRlc3QgPSBwcmVkaWN0aW9uLm5hbWUgKyBcIiwgXCIgKyBwcmVkaWN0aW9uLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRlc3QgPSBkZXN0LnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MocHJlZGljdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFmdGVyU2VsZWN0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSAnL2EvJyArIGl0ZW0ubmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJz9sYXRTVz0nICsgaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nU1c9JyArIGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzBdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxhdE5FPScgKyBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVsxXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdORT0nICsgaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpdGVtID0gJzxzcGFuIGNsYXNzPVwiaXRlbS1hZGRyZXNzXCI+JyArIGl0ZW0gKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICBmaXRUb0VsZW1lbnQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoYXQpLm9uKCd0eXBlYWhlYWQ6Y2hhbmdlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICQodGhhdCkudmFsKGl0ZW0uZmluZCgnYT5zcGFuLml0ZW0tYWRkcmVzcycpLnRleHQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgJ2FwcC5uYXZiYXInLFxyXG4gICAgJ2FwcC5sb2dpbicsXHJcbiAgICAnYXBwLnJlZ2lzdGVyJyxcclxuICAgICdhcHAuY2FyZCcsIFxyXG4gICAgJ2FwcC5wcm9maWxlJyxcclxuICAgICdhcHAudXNlclNlcnZpY2UnLFxyXG4gICAgJ2FwcC50cmFja1NlcnZpY2UnLFxyXG4gICAgJ2FwcC5tYXJrZXJQYXJzZXInLFxyXG4gICAgJ2FwcC5tYXAnLFxyXG4gICAgJ2FwcC5jb250ZW50JywgICAgXHJcbiAgICAnYXBwLnJvdGEnLFxyXG4gICAgJ29jLmxhenlMb2FkJyxcclxuICAgICd1aS5yb3V0ZXInLFxyXG4gICAgJ2xlYWZsZXQtZGlyZWN0aXZlJyxcclxuICAgICduZ0F1dG9jb21wbGV0ZSdcclxuICBdKVxyXG4gIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJywnJGxvZ1Byb3ZpZGVyJywnJG9jTGF6eUxvYWRQcm92aWRlcicsJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsJGNvbXBpbGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH0pO1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cHJvZmlsZS1kaXJlY3RpdmU+PC9wcm9maWxlLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocHJvZmlsZVN0YXRlKTtcclxuICB9XSlcclxuICAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCB1c2VyU2VydmljZSkge1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGdldFVzZXIoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgICAgcmV0dXJuIHVzZXJTZXJ2aWNlLmdldFVzZXIoKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uZC5kYXRhLk9wZXJhdGlvblJlc3VsdCkgXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUudXNlciA9IHJlc3BvbmQuZGF0YS51c2VyO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmZsYWdMb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICB9IFxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB9KSgpOyBcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb250ZW50JywgWydhcHAuaGVhZGVyJywgJ2FwcC5mb290ZXInLCd1aS5yb3V0ZXInXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgIC8vICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnLyMvJyk7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJ2RlZmF1bHRTdGF0ZScsIFxyXG4gICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvbGFuZGluZy9sYW5kaW5nLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShkZWZhdWx0U3RhdGUpO1xyXG4gICAgfSlcclxuICBcclxufSkoKTsiLCIiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhJywgWydhcHAubGF5b3V0JywgJ2FwcC5sYXlvdXREZXRhaWwnLCAnYXBwLnJvdGFla2xlJywgJ3VpLnJvdXRlciddKVxyXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgICAgICB2YXIgbGF5b3V0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGF5b3V0JyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9hL3t0ZXJtfT9sYXRTVyZsbmdTVyZsYXRORSZsbmdORScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48bGF5b3V0LWRpcmVjdGl2ZT48L2xheW91dC1kaXJlY3RpdmU+JyxcclxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobGF5b3V0U3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxheW91dERldGFpbFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2xheW91dERldGFpbCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YS86aWQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PGxheW91dC1kZXRhaWwtZGlyZWN0aXZlPjwvbGF5b3V0LWRldGFpbC1kaXJlY3RpdmU+J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsYXlvdXREZXRhaWxTdGF0ZSk7XHJcbiBcclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2snLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGFla2xlJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlL3JvdGFla2xlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3JvdGFFa2xlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdyb3RhRWtsZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTG9jYXRpb25TdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5sb2NhdGlvbicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva29udW0nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uaHRtbCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tMb2NhdGlvblN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja01ldGFTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5tZXRhJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iaWxnaScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5tZXRhL3JvdGFla2xlLm1ldGEuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja01ldGFTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tJbWFnZVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmltYWdlJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXNpbWxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5pbWFnZS9yb3RhZWtsZS5pbWFnZS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrSW1hZ2VTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tHUFhTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5ncHgnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2dweCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5ncHgvcm90YWVrbGUuZ3B4Lmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tHUFhTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tGaW5pc2hTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5maW5pc2gnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2theWRldCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5maW5pc2gvcm90YWVrbGUuZmluaXNoLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tGaW5pc2hTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZm9vdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdmb290ZXJEaXJlY3RpdmUnLCBmb290ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gZm9vdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgfTtcclxuICBcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxufSkoKTsgXHJcbiBcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuaGVhZGVyJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnaGVhZGxpbmVEaXJlY3RpdmUnLCBoZWFkbGluZURpcmVjdGl2ZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaGVhZGxpbmVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2hlYWRsaW5lL2hlYWRsaW5lLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEhlYWRsaW5lQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuICAgIH1cclxuXHJcbiAgICBIZWFkbGluZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRsaW5lQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuICAgICAgICB2bS5zZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdGVybTogdm0uZWxtYVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiNBdXRvY29tcGxldGVcIikuZm9jdXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjQXV0b2NvbXBsZXRlXCIpLm9mZnNldCgpLnRvcCAtIDgwXHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4qIEBkZXNjIGNhcmQgY29tcG9uZW50IFxyXG4qIEBleGFtcGxlIDxjYXJkPjwvY2FyZD5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNhcmQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2NhcmREaXJlY3RpdmUnLCBjYXJkRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vY2FyZC9jYXJkLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnPCcsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6ICc8JyxcclxuICAgICAgICAgICAgb3duZXI6JzwnLFxyXG4gICAgICAgICAgICBpbWdTcmM6JzwnLFxyXG4gICAgICAgICAgICBpZDogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQ2FyZENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7IFxyXG4gICAgdm0uaW1nU3JjID0gdm0uaW1nU3JjLnNwbGl0KCdjbGllbnQnKVsxXTtcclxufSBcclxuIiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsb2dpbkRpcmVjdGl2ZScsIGxvZ2luRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGxvZ2luRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogRm9vdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdwcm9maWxlRGlyZWN0aXZlJywgcHJvZmlsZURpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9wcm9maWxlL3Byb2ZpbGUuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogcHJvZmlsZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG5wcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3VzZXJTZXJ2aWNlJywgJ3RyYWNrU2VydmljZScsICdtYXJrZXJQYXJzZXInXTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVDb250cm9sbGVyKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlLHRyYWNrU2VydmljZSxtYXJrZXJQYXJzZXIpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgXHJcbiAgICB9XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubmF2YmFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCduYXZiYXJEaXJlY3RpdmUnLCBuYXZiYXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gbmF2YmFyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9uYXZiYXIvbmF2YmFyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBuYXZiYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJlZ2lzdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcmVjdGl2ZScsIHJlZ2lzdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9yZWdpc3Rlci9yZWdpc3Rlci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogcmVnaXN0ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubGF5b3V0RGV0YWlsJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsYXlvdXREZXRhaWxEaXJlY3RpdmUnLCBsYXlvdXREZXRhaWxEaXJlY3RpdmUpXHJcblxyXG5mdW5jdGlvbiBsYXlvdXREZXRhaWxEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL2xheW91dC5kZXRhaWwvbGF5b3V0LmRldGFpbC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogTGF5b3V0RGV0YWlsQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5MYXlvdXREZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnXTtcclxuXHJcbmZ1bmN0aW9uIExheW91dERldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja0RldGFpbCA9IHt9O1xyXG4gICAgdm0uY2VudGVyID0ge307XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0cmFja1NlcnZpY2UuZ2V0VHJhY2tEZXRhaWwoJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjLnNwbGl0KCdjbGllbnQnKVsxXS5yZXBsYWNlQWxsKCdcXFxcJywgJy8nKVxyXG4gICAgICAgICAgICB2bS5jZW50ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIHpvb206IDEyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codm0uY2VudGVyKTtcclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3B4ID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5ncHg7IC8vIFVSTCB0byB5b3VyIEdQWCBmaWxlIG9yIHRoZSBHUFggaXRzZWxmXHJcbiAgICAgICAgICAgICAgICBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgfSkuYWRkVG8obWFwKTsgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcblxyXG5cclxufSIsIi8qKlxyXG4gKiBAZGVzYyBNYWluIGxheW91dCBmb3IgYXBwbGljYXRpb25cclxuICogQGV4YW1wbGUgPGxheW91dC1kaXJlY3RpdmU+PC9sYXlvdXQtZGlyZWN0aXZlPlxyXG4gKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxheW91dCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbGF5b3V0RGlyZWN0aXZlJywgbGF5b3V0RGlyZWN0aXZlKVxyXG5cclxuZnVuY3Rpb24gbGF5b3V0RGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9sYXlvdXQvbGF5b3V0Lmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICBjb250cm9sbGVyOiBMYXlvdXRDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbkxheW91dENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFya2VyUGFyc2VyJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldE1hcEV2ZW50cycsICdsZWFmbGV0RGF0YScsICckbG9jYXRpb24nXTtcclxuXHJcbmZ1bmN0aW9uIExheW91dENvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLCBtYXJrZXJQYXJzZXIsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXRNYXBFdmVudHMsIGxlYWZsZXREYXRhLCAkbG9jYXRpb24pIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIHZtLmdldFRyYWNrID0gZ2V0VHJhY2s7XHJcbiAgICB2bS5tYXBBdXRvUmVmcmVzaCA9IHRydWU7XHJcbiAgICB2bS5wYXJhbXMgPSB7XHJcbiAgICAgICAgbGF0TkU6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxhdE5FKSxcclxuICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgIGxhdFNXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRTVyksXHJcbiAgICAgICAgbG5nU1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxuZ1NXKSxcclxuICAgIH1cclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRyYWNrKCkge1xyXG4gICAgICAgIHJldHVybiB0cmFja1NlcnZpY2UuZ2V0VHJhY2sodm0ucGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrcy5kYXRhID0gcmVzcG9uZC5kYXRhO1xyXG4gICAgICAgICAgICBpZiAodm0udHJhY2tzLmRhdGEgPT0gW10pIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFya2VyUGFyc2VyLmpzb25Ub01hcmtlckFycmF5KHZtLnRyYWNrcy5kYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2VycyA9IG1hcmtlclBhcnNlci50b09iamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gTC5nZW9Kc29uKHZtLnRyYWNrcy5kYXRhKS5nZXRCb3VuZHMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgdm0uY2hhbmdlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICAvLyB2YXIgc3dhcCA9IG1hcmtlci5pY29uO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uID0gbWFya2VyLmljb25fc3dhcDtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbl9zd2FwID0gc3dhcDtcclxuICAgICAgICAvLyBpZiAobWFya2VyLmZvY3VzKVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpLmxhdE5FID0gMjApO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwNGMwMCcsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcbiAgICBmb3IgKHZhciBrIGluIHZtLm1hcEV2ZW50cykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZtLm1hcEV2ZW50cyk7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLicgKyB2bS5tYXBFdmVudHNba107XHJcbiAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2VJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3V0Jykge1xyXG4gICAgICAgICAgICAgICAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcC5tb3ZlZW5kJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXNkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdmFyIG1hcEV2ZW50ID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAubW92ZWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudCwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYXJncy5sZWFmbGV0T2JqZWN0KTtcclxuICAgICAgICBpZiAodm0ubWFwQXV0b1JlZnJlc2gpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm1hcmtlcnMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0TkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nU1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAnbGF0TkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAnbG5nTkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmcsXHJcbiAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAnbG5nU1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9KVxyXG4gICAgJHNjb3BlLiRvbignJHJvdXRlVXBkYXRlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFsZXJ0KDEpXHJcbiAgICB9KTtcclxuXHJcbn0iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YWVrbGUnLCBbJ2FwcC5tYXAnLCAnbmdBdXRvY29tcGxldGUnLCAnYXBwLnRyYWNrU2VydmljZScsICduZ0ZpbGVVcGxvYWQnLCAnYW5ndWxhci1sYWRkYSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdyb3RhRWtsZUNvbnRyb2xsZXInLCByb3RhRWtsZUNvbnRyb2xsZXIpXHJcblxyXG5cclxuICAgIHJvdGFFa2xlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ3JldmVyc2VHZW9jb2RlJywgJ3RyYWNrU2VydmljZScsICckc3RhdGUnLCAnVXBsb2FkJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YUVrbGVDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgbWFwQ29uZmlnU2VydmljZSwgcmV2ZXJzZUdlb2NvZGUsIHRyYWNrU2VydmljZSwgJHN0YXRlLCBVcGxvYWQpIHtcclxuICAgICAgICAvLyAkb2NMYXp5TG9hZC5sb2FkKCcuLi8uLi9zZXJ2aWNlcy9tYXAvbWFwLmF1dG9jb21wbGV0ZS5qcycpO1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgdm0ubG9jYXRpb247XHJcblxyXG4gICAgICAgIC8vVHJhY2sgcGFyYW1ldGVyc1xyXG4gICAgICAgIHZtLm93bmVkQnkgPSAkcm9vdFNjb3BlLnVzZXIuX2lkO1xyXG4gICAgICAgIHZtLmltZ19zcmMgPSBcInNyY1wiO1xyXG4gICAgICAgIHZtLnN1bW1hcnk7XHJcbiAgICAgICAgdm0uYWx0aXR1ZGU7XHJcbiAgICAgICAgdm0uZGlzdGFuY2U7XHJcbiAgICAgICAgdm0ubmFtZSA9ICcnO1xyXG4gICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW107XHJcbiAgICAgICAgdm0udXBsb2FkR1BYID0gdXBsb2FkR1BYO1xyXG4gICAgICAgIHZtLnVwbG9hZFBpYyA9IHVwbG9hZFBpYztcclxuXHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB2bS5hZGRUcmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdHJhY2tTZXJ2aWNlLmFkZFRyYWNrKHZtKS50aGVuKGZ1bmN0aW9uIChhZGRUcmFja1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dCcpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoYWRkVHJhY2tFcnJvcikge1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZFBpYyhmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3Bob3Rvcy8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWdfc3JjID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRHUFgoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9ncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncHggPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5maW5pc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgYW5ndWxhci5leHRlbmQoJHNjb3BlLCB7XHJcbiAgICAgICAgICAgIG1hcmtlcnM6IHtcclxuICAgICAgICAgICAgICAgIG1haW5NYXJrZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYXQ6IHZtLmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxuZzogdm0uY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCYcWfa2EgYmlyIG5va3RheWEgdMSxa2xheWFyYWsga2F5ZMSxci5cIixcclxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKFwibGVhZmxldERpcmVjdGl2ZU1hcC5jbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGxlYWZFdmVudCA9IGFyZ3MubGVhZmxldEV2ZW50O1xyXG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZS5nZW9jb2RlTGF0bG5nKGxlYWZFdmVudC5sYXRsbmcubGF0LCBsZWFmRXZlbnQubGF0bG5nLmxuZykudGhlbihmdW5jdGlvbiAoZ2VvY29kZVN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2NhdGlvbiA9IGdlb2NvZGVTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcmtlcnMubWFpbk1hcmtlci5sYXQgPSBsZWFmRXZlbnQubGF0bG5nLmxhdDtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcmtlcnMubWFpbk1hcmtlci5sbmcgPSBsZWFmRXZlbnQubGF0bG5nLmxuZztcclxuICAgICAgICAgICAgdm0uY29vcmRpbmF0ZXMgPSBbbGVhZkV2ZW50LmxhdGxuZy5sbmcsIGxlYWZFdmVudC5sYXRsbmcubGF0XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiIiwiLyoqXHJcbiAqIEBkZXNjIFNlcnZpY2VzIHRoYXQgY29udmVydHMgZ2VvanNvbiBmZWF0dXJlcyB0byBtYXJrZXJzIGZvciBoYW5kbGluZyBsYXRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hcmtlclBhcnNlcigkcSkge1xyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0anNvblRvTWFya2VyQXJyYXk6IGpzb25Ub01hcmtlckFycmF5LFxyXG4gICAgICAgIHRvT2JqZWN0OiB0b09iamVjdFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuXHJcblx0Ly8gY29udmVydCBmZWF0dXJlIGdlb2pzb24gdG8gYXJyYXkgb2YgbWFya2Vyc1xyXG5cdGZ1bmN0aW9uIGpzb25Ub01hcmtlckFycmF5KHZhbCkge1xyXG4gICAgICAgIHZhciBkZWZlcmVkID0gJHEuZGVmZXIoKTsgLy8gZGVmZXJlZCBvYmplY3QgcmVzdWx0IG9mIGFzeW5jIG9wZXJhdGlvblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICAgICAgdmFyIG1hcmsgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXllcjogXCJyb3RhbGFyXCIsXHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIGxuZzogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgIGljb246IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwNGMwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBpY29uX3N3YXAgOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdmFsW2ldLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFsdGl0dWRlXCIgOiB2YWxbaV0ucHJvcGVydGllcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCIgOiB2YWxbaV0ucHJvcGVydGllcy5kaXN0YW5jZSxcclxuICAgICAgICAgICAgICAgICAgICBcInN1bW1hcnlcIiA6IHZhbFtpXS5wcm9wZXJ0aWVzLnN1bW1hcnksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvd25lclwiOiB2YWxbaV0ucHJvcGVydGllcy5vd25lZEJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1nX3NyY1wiOnZhbFtpXS5wcm9wZXJ0aWVzLmltZ19zcmMsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2gobWFyayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG91dHB1dCkge1xyXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcclxuICAgICAgICB2YXIgcnYgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IHVuZGVmaW5lZCkgcnZbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICByZXR1cm4gcnY7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAubWFya2VyUGFyc2VyJywgW10pXHJcbi5mYWN0b3J5KCdtYXJrZXJQYXJzZXInLCBtYXJrZXJQYXJzZXIpOyIsImZ1bmN0aW9uIHRyYWNrU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBlbmRwb2ludCA9ICdodHRwOmxvY2FsaG9zdDo4MDgwLydcclxuXHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRUcmFjazogZ2V0VHJhY2ssXHJcblx0XHRhZGRUcmFjazogYWRkVHJhY2ssXHJcblx0XHRnZXRUcmFja0RldGFpbDpnZXRUcmFja0RldGFpbCxcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFjayhwYXJhbXMpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3M/bGF0TkU9JysgcGFyYW1zLmxhdE5FKycmbG5nTkU9JytwYXJhbXMubG5nTkUgKycmbGF0U1c9JytwYXJhbXMubGF0U1cgKycmbG5nU1c9JytwYXJhbXMubG5nU1csXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH0sXHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrRGV0YWlsKGlkKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycraWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gYWRkVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXRhOiAkLnBhcmFtKHtcclxuXHRcdFx0XHRcIm5hbWVcIjogdHJhY2submFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFwiYWx0aXR1ZGVcIjogdHJhY2suYWx0aXR1ZGUsXHJcblx0XHRcdFx0XCJzdW1tYXJ5XCI6IHRyYWNrLnN1bW1hcnksXHJcblx0XHRcdFx0XCJpbWdfc3JjXCI6IHRyYWNrLmltZ19zcmMsXHJcblx0XHRcdFx0XCJjb29yZGluYXRlc1wiOiB0cmFjay5jb29yZGluYXRlcyxcclxuXHRcdFx0XHRcIm93bmVkQnlcIjogdHJhY2sub3duZWRCeSxcclxuXHRcdFx0XHRcImdweFwiOiB0cmFjay5ncHgsXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAudHJhY2tTZXJ2aWNlJywgW10pXHJcblx0LmZhY3RvcnkoJ3RyYWNrU2VydmljZScsIHRyYWNrU2VydmljZSk7IiwiZnVuY3Rpb24gdXNlclNlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFVzZXI6IGdldFVzZXIsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgXHRyZXR1cm4gJGh0dHAoe1xyXG4gICAgXHRcdG1ldGhvZDogJ0dFVCcsXHJcbiAgICBcdFx0dXJsOiAnYXBpL3Byb2ZpbGUnXHJcbiAgICBcdH0pXHJcbiAgICB9OyBcclxufSBcclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAudXNlclNlcnZpY2UnLCBbXSlcclxuLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgdXNlclNlcnZpY2UpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBBIGRpcmVjdGl2ZSBmb3IgYWRkaW5nIGdvb2dsZSBwbGFjZXMgYXV0b2NvbXBsZXRlIHRvIGEgdGV4dCBib3hcclxuICogZ29vZ2xlIHBsYWNlcyBhdXRvY29tcGxldGUgaW5mbzogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcGxhY2VzXHJcbiAqXHJcbiAqIFNpbXBsZSBVc2FnZTpcclxuICpcclxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmctYXV0b2NvbXBsZXRlPVwicmVzdWx0XCIvPlxyXG4gKlxyXG4gKiBjcmVhdGVzIHRoZSBhdXRvY29tcGxldGUgdGV4dCBib3ggYW5kIGdpdmVzIHlvdSBhY2Nlc3MgdG8gdGhlIHJlc3VsdFxyXG4gKlxyXG4gKiAgICsgYG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiYDogc3BlY2lmaWVzIHRoZSBkaXJlY3RpdmUsICRzY29wZS5yZXN1bHQgd2lsbCBob2xkIHRoZSB0ZXh0Ym94IHJlc3VsdFxyXG4gKlxyXG4gKlxyXG4gKiBBZHZhbmNlZCBVc2FnZTpcclxuICpcclxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmctYXV0b2NvbXBsZXRlPVwicmVzdWx0XCIgZGV0YWlscz1cImRldGFpbHNcIiBvcHRpb25zPVwib3B0aW9uc1wiLz5cclxuICpcclxuICogICArIGBuZy1hdXRvY29tcGxldGU9XCJyZXN1bHRcImA6IHNwZWNpZmllcyB0aGUgZGlyZWN0aXZlLCAkc2NvcGUucmVzdWx0IHdpbGwgaG9sZCB0aGUgdGV4dGJveCBhdXRvY29tcGxldGUgcmVzdWx0XHJcbiAqXHJcbiAqICAgKyBgZGV0YWlscz1cImRldGFpbHNcImA6ICRzY29wZS5kZXRhaWxzIHdpbGwgaG9sZCB0aGUgYXV0b2NvbXBsZXRlJ3MgbW9yZSBkZXRhaWxlZCByZXN1bHQ7IGxhdGxuZy4gYWRkcmVzcyBjb21wb25lbnRzLCBldGMuXHJcbiAqXHJcbiAqICAgKyBgb3B0aW9ucz1cIm9wdGlvbnNcImA6IG9wdGlvbnMgcHJvdmlkZWQgYnkgdGhlIHVzZXIgdGhhdCBmaWx0ZXIgdGhlIGF1dG9jb21wbGV0ZSByZXN1bHRzXHJcbiAqXHJcbiAqICAgICAgKyBvcHRpb25zID0ge1xyXG4gKiAgICAgICAgICAgdHlwZXM6IHR5cGUsICAgICAgICBzdHJpbmcsIHZhbHVlcyBjYW4gYmUgJ2dlb2NvZGUnLCAnZXN0YWJsaXNobWVudCcsICcocmVnaW9ucyknLCBvciAnKGNpdGllcyknXHJcbiAqICAgICAgICAgICBib3VuZHM6IGJvdW5kcywgICAgIGdvb2dsZSBtYXBzIExhdExuZ0JvdW5kcyBPYmplY3RcclxuICogICAgICAgICAgIGNvdW50cnk6IGNvdW50cnkgICAgc3RyaW5nLCBJU08gMzE2Ni0xIEFscGhhLTIgY29tcGF0aWJsZSBjb3VudHJ5IGNvZGUuIGV4YW1wbGVzOyAnY2EnLCAndXMnLCAnZ2InXHJcbiAqICAgICAgICAgfVxyXG4gKlxyXG4gKlxyXG4gKi9cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCBcIm5nQXV0b2NvbXBsZXRlXCIsIFtdKVxyXG4gIC5kaXJlY3RpdmUoJ25nQXV0b2NvbXBsZXRlJywgZnVuY3Rpb24oJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgc2NvcGU6IHtcclxuICAgICAgICBkZXRhaWxzOiAnPScsXHJcbiAgICAgICAgbmdBdXRvY29tcGxldGU6ICc9JyxcclxuICAgICAgICBvcHRpb25zOiAnPSdcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbW9kZWwpIHtcclxuXHJcbiAgICAgICAgLy9vcHRpb25zIGZvciBhdXRvY29tcGxldGVcclxuICAgICAgICB2YXIgb3B0c1xyXG5cclxuICAgICAgICAvL2NvbnZlcnQgb3B0aW9ucyBwcm92aWRlZCB0byBvcHRzXHJcbiAgICAgICAgdmFyIGluaXRPcHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBvcHRzID0ge31cclxuICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zLnR5cGVzKSB7XHJcbiAgICAgICAgICAgICAgb3B0cy50eXBlcyA9IFtdXHJcbiAgICAgICAgICAgICAgb3B0cy50eXBlcy5wdXNoKHNjb3BlLm9wdGlvbnMudHlwZXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNjb3BlLm9wdGlvbnMuYm91bmRzKSB7XHJcbiAgICAgICAgICAgICAgb3B0cy5ib3VuZHMgPSBzY29wZS5vcHRpb25zLmJvdW5kc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zLmNvdW50cnkpIHtcclxuICAgICAgICAgICAgICBvcHRzLmNvbXBvbmVudFJlc3RyaWN0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNvdW50cnk6IHNjb3BlLm9wdGlvbnMuY291bnRyeVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbml0T3B0cygpXHJcblxyXG4gICAgICAgIC8vY3JlYXRlIG5ldyBhdXRvY29tcGxldGVcclxuICAgICAgICAvL3JlaW5pdGlhbGl6ZXMgb24gZXZlcnkgY2hhbmdlIG9mIHRoZSBvcHRpb25zIHByb3ZpZGVkXHJcbiAgICAgICAgdmFyIG5ld0F1dG9jb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2NvcGUuZ1BsYWNlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5BdXRvY29tcGxldGUoZWxlbWVudFswXSwgb3B0cyk7XHJcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihzY29wZS5nUGxhY2UsICdwbGFjZV9jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcclxuLy8gICAgICAgICAgICAgIGlmIChzY29wZS5kZXRhaWxzKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5kZXRhaWxzID0gc2NvcGUuZ1BsYWNlLmdldFBsYWNlKCk7XHJcbi8vICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgc2NvcGUubmdBdXRvY29tcGxldGUgPSBlbGVtZW50LnZhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld0F1dG9jb21wbGV0ZSgpXHJcblxyXG4gICAgICAgIC8vd2F0Y2ggb3B0aW9ucyBwcm92aWRlZCB0byBkaXJlY3RpdmVcclxuICAgICAgICBzY29wZS53YXRjaE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICByZXR1cm4gc2NvcGUub3B0aW9uc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2NvcGUuJHdhdGNoKHNjb3BlLndhdGNoT3B0aW9ucywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaW5pdE9wdHMoKVxyXG4gICAgICAgICAgbmV3QXV0b2NvbXBsZXRlKClcclxuICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSAnJztcclxuICAgICAgICAgIHNjb3BlLm5nQXV0b2NvbXBsZXRlID0gZWxlbWVudC52YWwoKTtcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTsiLCJmdW5jdGlvbiBtYXBDb25maWdTZXJ2aWNlKCkge1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgIGdldExheWVyOiBnZXRMYXllcixcclxuICAgICAgICBnZXRDZW50ZXI6IGdldENlbnRlcixcclxuICAgIH07XHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllcigpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgIGJhc2VsYXllcnM6IHtcclxuICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdBcmF6aScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3InLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3ZlcmxheXM6IHtcclxuICAgICAgICAgICAgcm90YWxhcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dyb3VwJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdSb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENlbnRlcigpIHtcclxuICAgICAgICB2YXIgY2VudGVyID0ge1xyXG4gICAgICAgICAgICBsYXQ6IDM5LjkwMzI5MTgsXHJcbiAgICAgICAgICAgIGxuZzogMzIuNjIyMzM5NixcclxuICAgICAgICAgICAgem9vbTogNlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2VudGVyO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm1hcCcsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ21hcENvbmZpZ1NlcnZpY2UnLCBtYXBDb25maWdTZXJ2aWNlKTsiLCJmdW5jdGlvbiBnZW9jb2RlKCRxKSB7XHJcbiAgcmV0dXJuIHsgXHJcbiAgICBnZW9jb2RlQWRkcmVzczogZnVuY3Rpb24oYWRkcmVzcykge1xyXG4gICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7ICdhZGRyZXNzJzogYWRkcmVzcyB9LCBmdW5jdGlvbiAocmVzdWx0cywgc3RhdHVzKSB7XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAvLyB3aW5kb3cuZmluZExvY2F0aW9uKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdnZW9jb2RlJywgZ2VvY29kZSk7IiwiZnVuY3Rpb24gcmV2ZXJzZUdlb2NvZGUoJHEsICRodHRwKSB7XHJcbiAgICB2YXIgb2JqID0ge307XHJcbiAgICBvYmouZ2VvY29kZUxhdGxuZyA9IGZ1bmN0aW9uIGdlb2NvZGVQb3NpdGlvbihsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoe1xyXG4gICAgICAgICAgICBsYXRMbmc6IGxhdGxuZ1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2VzICYmIHJlc3BvbnNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZXNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgncmV2ZXJzZUdlb2NvZGUnLCByZXZlcnNlR2VvY29kZSk7Il19
