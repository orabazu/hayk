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
    // vm.imgSrc = vm.imgSrc.split('client')[1];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicHJvZmlsZS9wcm9maWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJsYXlvdXQvbGF5b3V0LmpzIiwibGF5b3V0LmRldGFpbC9sYXlvdXQuZGV0YWlsLmpzIiwicm90YWVrbGUvcm90YWVrbGUuanMiLCJyb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIm1hcC9tYXAuYXV0b2NvbXBsZXRlLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8s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TyxTQUFTOzs7OztBQUt0QjtFQUNFLE9BQU87RUFDUCxRQUFRLFdBQVcsU0FBUzs7eUNDbkI5QixTQUFTLGVBQWUsSUFBSSxPQUFPO0lBQy9CLElBQUksTUFBTTtJQUNWLElBQUksZ0JBQWdCLFNBQVMsZ0JBQWdCLEtBQUssS0FBSztRQUNuRCxJQUFJLFdBQVcsSUFBSSxPQUFPLEtBQUs7UUFDL0IsSUFBSSxXQUFXLEdBQUc7UUFDbEIsSUFBSSxTQUFTLElBQUksT0FBTyxLQUFLLE9BQU8sS0FBSztRQUN6QyxTQUFTLFFBQVE7WUFDYixRQUFRO1dBQ1QsU0FBUyxXQUFXO1lBQ25CLElBQUksYUFBYSxVQUFVLFNBQVMsR0FBRztnQkFDbkMsT0FBTyxTQUFTLFFBQVEsVUFBVSxHQUFHO21CQUNsQztnQkFDSCxPQUFPLFNBQVMsUUFBUTs7V0FFN0IsVUFBVSxLQUFLO1lBQ2QsT0FBTyxTQUFTLFFBQVE7O1FBRTVCLE9BQU8sU0FBUzs7SUFFcEIsT0FBTzs7O0FBR1g7RUFDRSxPQUFPO0VBQ1AsUUFBUSxrQkFBa0IsZ0JBQWdCIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldC5zcGxpdChzZWFyY2gpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdlb2NvZGUtYXV0b2NvbXBsZXRlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICQodGhhdCkudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmVkaWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwczovL2dlb2NvZGUtbWFwcy55YW5kZXgucnUvMS54Lz9yZXN1bHRzPTUmYmJveD0yNC4xMjU5NzcsMzQuNDUyMjE4fjQ1LjEwOTg2Myw0Mi42MDE2MjAmZm9ybWF0PWpzb24mbGFuZz10cl9UUiZnZW9jb2RlPScgKyBxdWVyeSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm5hbWUgKyAnLCAnICtkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24ucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb25nbGF0OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuUG9pbnQucG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YS5raW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0X3R5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYm94OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuYm91bmRlZEJ5LkVudmVsb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kZXNjcmlwdGlvbi5pbmRleE9mKCdUw7xya2l5ZScpID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9ucy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAocHJlZGljdGlvbnMgJiYgcHJlZGljdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXN1bHRzID0gJC5tYXAocHJlZGljdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jdGlvbiAocHJlZGljdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHZhciBkZXN0ID0gcHJlZGljdGlvbi5uYW1lICsgXCIsIFwiICsgcHJlZGljdGlvbi5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0ID0gZGVzdC5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzKHByZWRpY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlclNlbGVjdDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gJy9hLycgKyBpdGVtLm5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICAgICc/bGF0U1c9JyArIGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzFdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ1NXPScgKyBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVswXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsYXRORT0nICsgaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nTkU9JyArIGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9ICc8c3BhbiBjbGFzcz1cIml0ZW0tYWRkcmVzc1wiPicgKyBpdGVtICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgZml0VG9FbGVtZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGF0KS5vbigndHlwZWFoZWFkOmNoYW5nZScsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQpLnZhbChpdGVtLmZpbmQoJ2E+c3Bhbi5pdGVtLWFkZHJlc3MnKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICdhcHAubmF2YmFyJyxcclxuICAgICdhcHAubG9naW4nLFxyXG4gICAgJ2FwcC5yZWdpc3RlcicsXHJcbiAgICAnYXBwLmNhcmQnLCBcclxuICAgICdhcHAucHJvZmlsZScsXHJcbiAgICAnYXBwLnVzZXJTZXJ2aWNlJyxcclxuICAgICdhcHAudHJhY2tTZXJ2aWNlJyxcclxuICAgICdhcHAubWFya2VyUGFyc2VyJyxcclxuICAgICdhcHAubWFwJyxcclxuICAgICdhcHAuY29udGVudCcsICAgIFxyXG4gICAgJ2FwcC5yb3RhJyxcclxuICAgICdvYy5sYXp5TG9hZCcsXHJcbiAgICAndWkucm91dGVyJyxcclxuICAgICdsZWFmbGV0LWRpcmVjdGl2ZScsXHJcbiAgICAnbmdBdXRvY29tcGxldGUnXHJcbiAgXSlcclxuICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCckbG9jYXRpb25Qcm92aWRlcicsJyRsb2dQcm92aWRlcicsJyRvY0xhenlMb2FkUHJvdmlkZXInLCckY29tcGlsZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJGxvZ1Byb3ZpZGVyLCAkb2NMYXp5TG9hZFByb3ZpZGVyLCRjb21waWxlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAkb2NMYXp5TG9hZFByb3ZpZGVyLmNvbmZpZyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlXHJcbiAgICB9KTtcclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xyXG4gICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgdmFyIGxvZ2luU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdsb2dpbicsXHJcbiAgICAgIHVybDogJy9naXJpcycsXHJcbiAgICAgIHRlbXBsYXRlOiAnPGxvZ2luLWRpcmVjdGl2ZT48L2xvZ2luLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobG9naW5TdGF0ZSk7XHJcblxyXG4gICAgdmFyIHJlZ2lzdGVyU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdyZWdpc3RlcicsXHJcbiAgICAgIHVybDogJy9rYXlpdCcsXHJcbiAgICAgIHRlbXBsYXRlOiAnPHJlZ2lzdGVyLWRpcmVjdGl2ZT48L3JlZ2lzdGVyLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocmVnaXN0ZXJTdGF0ZSk7XHJcblxyXG4gICAgdmFyIHByb2ZpbGVTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3Byb2ZpbGUnLFxyXG4gICAgICB1cmw6ICcvcHJvZmlsJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHByb2ZpbGUtZGlyZWN0aXZlPjwvcHJvZmlsZS1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHByb2ZpbGVTdGF0ZSk7XHJcbiAgfV0pXHJcbiAgLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIHJldHVybiBnZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbmQuZGF0YS5PcGVyYXRpb25SZXN1bHQpIFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXNwb25kLmRhdGEudXNlcjtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mbGFnTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgfSkoKTsgXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29udGVudCcsIFsnYXBwLmhlYWRlcicsICdhcHAuZm9vdGVyJywndWkucm91dGVyJ10pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0U3RhdGUnLCBcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2xhbmRpbmcvbGFuZGluZy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmYXVsdFN0YXRlKTtcclxuICAgIH0pXHJcbiAgXHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YScsIFsnYXBwLmxheW91dCcsICdhcHAubGF5b3V0RGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIGxheW91dFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2xheW91dCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYS97dGVybX0/bGF0U1cmbG5nU1cmbGF0TkUmbG5nTkUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PGxheW91dC1kaXJlY3RpdmU+PC9sYXlvdXQtZGlyZWN0aXZlPicsXHJcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxheW91dFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXlvdXREZXRhaWxTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdsYXlvdXREZXRhaWwnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGEvOmlkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxsYXlvdXQtZGV0YWlsLWRpcmVjdGl2ZT48L2xheW91dC1kZXRhaWwtZGlyZWN0aXZlPidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobGF5b3V0RGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrSW1hZ2VTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5pbWFnZScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVzaW1sZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuaW1hZ2Uvcm90YWVrbGUuaW1hZ2UuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ltYWdlU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrR1BYU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZ3B4JyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9ncHgnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZ3B4L3JvdGFla2xlLmdweC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrR1BYU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrRmluaXNoU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZmluaXNoJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rYXlkZXQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZmluaXNoL3JvdGFla2xlLmZpbmlzaC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrRmluaXNoU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZvb3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnZm9vdGVyRGlyZWN0aXZlJywgZm9vdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGZvb3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcbn0pKCk7IFxyXG4gXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmhlYWRlcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2hlYWRsaW5lRGlyZWN0aXZlJywgaGVhZGxpbmVEaXJlY3RpdmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlYWRsaW5lRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9oZWFkbGluZS9oZWFkbGluZS5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBIZWFkbGluZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgSGVhZGxpbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkbGluZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiAgICAgICAgdm0uc2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dCcsIHtcclxuICAgICAgICAgICAgICAgIHRlcm06IHZtLmVsbWFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjQXV0b2NvbXBsZXRlXCIpLmZvY3VzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKFwiI0F1dG9jb21wbGV0ZVwiKS5vZmZzZXQoKS50b3AgLSA4MFxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuKiBAZGVzYyBjYXJkIGNvbXBvbmVudCBcclxuKiBAZXhhbXBsZSA8Y2FyZD48L2NhcmQ+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jYXJkJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdjYXJkRGlyZWN0aXZlJywgY2FyZERpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBjYXJkRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29tbW9uL2NhcmQvY2FyZC5odG1sJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICB0aXRsZTogJzwnLFxyXG4gICAgICAgICAgICBzdW1tYXJ5OiAnPCcsXHJcbiAgICAgICAgICAgIG93bmVyOic8JyxcclxuICAgICAgICAgICAgaW1nU3JjOic8JyxcclxuICAgICAgICAgICAgaWQ6ICc8JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IENhcmRDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2FyZENvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzOyBcclxuICAgIC8vIHZtLmltZ1NyYyA9IHZtLmltZ1NyYy5zcGxpdCgnY2xpZW50JylbMV07XHJcbn0gXHJcbiIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sb2dpbicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbG9naW5EaXJlY3RpdmUnLCBsb2dpbkRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBsb2dpbkRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbG9naW4vbG9naW4uaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IEZvb3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubmF2YmFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCduYXZiYXJEaXJlY3RpdmUnLCBuYXZiYXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gbmF2YmFyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9uYXZiYXIvbmF2YmFyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBuYXZiYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3Byb2ZpbGVEaXJlY3RpdmUnLCBwcm9maWxlRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBwcm9maWxlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5cclxuXHJcbnByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAndXNlclNlcnZpY2UnLCAndHJhY2tTZXJ2aWNlJywgJ21hcmtlclBhcnNlciddO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UsdHJhY2tTZXJ2aWNlLG1hcmtlclBhcnNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yZWdpc3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncmVnaXN0ZXJEaXJlY3RpdmUnLCByZWdpc3RlckRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiByZWdpc3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvcmVnaXN0ZXIvcmVnaXN0ZXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IHJlZ2lzdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiAqIEBkZXNjIE1haW4gbGF5b3V0IGZvciBhcHBsaWNhdGlvblxyXG4gKiBAZXhhbXBsZSA8bGF5b3V0LWRpcmVjdGl2ZT48L2xheW91dC1kaXJlY3RpdmU+XHJcbiAqL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubGF5b3V0JywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsYXlvdXREaXJlY3RpdmUnLCBsYXlvdXREaXJlY3RpdmUpXHJcblxyXG5mdW5jdGlvbiBsYXlvdXREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL2xheW91dC9sYXlvdXQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IExheW91dENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuTGF5b3V0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbiddO1xyXG5cclxuZnVuY3Rpb24gTGF5b3V0Q29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsIG1hcmtlclBhcnNlciwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldE1hcEV2ZW50cywgbGVhZmxldERhdGEsICRsb2NhdGlvbikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgdm0uZ2V0VHJhY2sgPSBnZXRUcmFjaztcclxuICAgIHZtLm1hcEF1dG9SZWZyZXNoID0gdHJ1ZTtcclxuICAgIHZtLnBhcmFtcyA9IHtcclxuICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgIGxuZ05FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdORSksXHJcbiAgICAgICAgbGF0U1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxhdFNXKSxcclxuICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgfVxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICBpZiAodm0ucGFyYW1zLmxhdE5FICYmIHZtLnBhcmFtcy5sbmdORSAmJiB2bS5wYXJhbXMubGF0U1cgJiYgdm0ucGFyYW1zLmxuZ1NXKSB7XHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdE5FLCB2bS5wYXJhbXMubG5nTkVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0U1csIHZtLnBhcmFtcy5sbmdTV10sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VHJhY2soKSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYWNrU2VydmljZS5nZXRUcmFjayh2bS5wYXJhbXMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tzLmRhdGEgPSByZXNwb25kLmRhdGE7XHJcbiAgICAgICAgICAgIGlmICh2bS50cmFja3MuZGF0YSA9PSBbXSkge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXJrZXJQYXJzZXIuanNvblRvTWFya2VyQXJyYXkodm0udHJhY2tzLmRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXJrZXJzID0gbWFya2VyUGFyc2VyLnRvT2JqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBMLmdlb0pzb24odm0udHJhY2tzLmRhdGEpLmdldEJvdW5kcygpO1xyXG4gICAgICAgICAgICAgICAgLy8gbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgdm0uY2VudGVyID0gbWFwQ29uZmlnU2VydmljZS5nZXRDZW50ZXIoKTtcclxuXHJcbiAgICB2bS5jaGFuZ2VJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIC8vIHZhciBzd2FwID0gbWFya2VyLmljb247XHJcbiAgICAgICAgLy8gbWFya2VyLmljb24gPSBtYXJrZXIuaWNvbl9zd2FwO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uX3N3YXAgPSBzd2FwO1xyXG4gICAgICAgIC8vIGlmIChtYXJrZXIuZm9jdXMpXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkbG9jYXRpb24uc2VhcmNoKCkubGF0TkUgPSAyMCk7XHJcbiAgICAgICAgbWFya2VyLmljb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS5yZW1vdmVJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjMDA0YzAwJyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0uem9vbU1hcmtlciA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICB2YXIgbGF0TG5ncyA9IFtcclxuICAgICAgICAgICAgW21hcmtlci5sYXQsIG1hcmtlci5sbmddXHJcbiAgICAgICAgXTtcclxuICAgICAgICB2YXIgbWFya2VyQm91bmRzID0gTC5sYXRMbmdCb3VuZHMobGF0TG5ncyk7XHJcbiAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcC5maXRCb3VuZHMobWFya2VyQm91bmRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5tYXBFdmVudHMgPSBsZWFmbGV0TWFwRXZlbnRzLmdldEF2YWlsYWJsZU1hcEV2ZW50cygpO1xyXG5cclxuICAgIGZvciAodmFyIGsgaW4gdm0ubWFwRXZlbnRzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codm0ubWFwRXZlbnRzKTtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuJyArIHZtLm1hcEV2ZW50c1trXTtcclxuICAgICAgICAkc2NvcGUuJG9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIHZtLmNoYW5nZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdXQnKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFwLm1vdmVlbmQnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhc2QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbWFwRXZlbnQgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC5tb3ZlZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50LCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmdzLmxlYWZsZXRPYmplY3QpO1xyXG4gICAgICAgIGlmICh2bS5tYXBBdXRvUmVmcmVzaCkge1xyXG4gICAgICAgICAgICBpZiAodm0ubWFya2VycyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdDtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sbmdORSA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZztcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sYXRTVyA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdDtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxuZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgICdsYXRORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICdsYXRTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICdsbmdTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxuZ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH0pXHJcbiAgICAkc2NvcGUuJG9uKCckcm91dGVVcGRhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWxlcnQoMSlcclxuICAgIH0pO1xyXG5cclxufSIsImFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXREZXRhaWwnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xheW91dERldGFpbERpcmVjdGl2ZScsIGxheW91dERldGFpbERpcmVjdGl2ZSlcclxuXHJcbmZ1bmN0aW9uIGxheW91dERldGFpbERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvbGF5b3V0LmRldGFpbC9sYXlvdXQuZGV0YWlsLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICBjb250cm9sbGVyOiBMYXlvdXREZXRhaWxDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbkxheW91dERldGFpbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0RGF0YSddO1xyXG5cclxuZnVuY3Rpb24gTGF5b3V0RGV0YWlsQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0RGF0YSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrRGV0YWlsID0ge307XHJcbiAgICB2bS5jZW50ZXIgPSB7fTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMuc3BsaXQoJ2NsaWVudCcpWzFdLnJlcGxhY2VBbGwoJ1xcXFwnLCAnLycpXHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2bS5jZW50ZXIpO1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBncHggPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmdweDsgLy8gVVJMIHRvIHlvdXIgR1BYIGZpbGUgb3IgdGhlIEdQWCBpdHNlbGZcclxuICAgICAgICAgICAgICAgIG5ldyBMLkdQWChncHgsIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSkub24oJ2xvYWRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhlLnRhcmdldC5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICB9KS5hZGRUbyhtYXApOyAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuXHJcblxyXG59IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGFla2xlJywgWydhcHAubWFwJywgJ25nQXV0b2NvbXBsZXRlJywgJ2FwcC50cmFja1NlcnZpY2UnLCAnbmdGaWxlVXBsb2FkJywgJ2FuZ3VsYXItbGFkZGEnXSlcclxuICAgICAgICAuY29udHJvbGxlcigncm90YUVrbGVDb250cm9sbGVyJywgcm90YUVrbGVDb250cm9sbGVyKVxyXG5cclxuXHJcbiAgICByb3RhRWtsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnbWFwQ29uZmlnU2VydmljZScsICdyZXZlcnNlR2VvY29kZScsICd0cmFja1NlcnZpY2UnLCAnJHN0YXRlJywgJ1VwbG9hZCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGFFa2xlQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIG1hcENvbmZpZ1NlcnZpY2UsIHJldmVyc2VHZW9jb2RlLCB0cmFja1NlcnZpY2UsICRzdGF0ZSwgVXBsb2FkKSB7XHJcbiAgICAgICAgLy8gJG9jTGF6eUxvYWQubG9hZCgnLi4vLi4vc2VydmljZXMvbWFwL21hcC5hdXRvY29tcGxldGUuanMnKTtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICB2bS5vd25lZEJ5ID0gJHJvb3RTY29wZS51c2VyLl9pZDtcclxuICAgICAgICB2bS5pbWdfc3JjID0gXCJzcmNcIjtcclxuICAgICAgICB2bS5zdW1tYXJ5O1xyXG4gICAgICAgIHZtLmFsdGl0dWRlO1xyXG4gICAgICAgIHZtLmRpc3RhbmNlO1xyXG4gICAgICAgIHZtLm5hbWUgPSAnJztcclxuICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtdO1xyXG4gICAgICAgIHZtLnVwbG9hZEdQWCA9IHVwbG9hZEdQWDtcclxuICAgICAgICB2bS51cGxvYWRQaWMgPSB1cGxvYWRQaWM7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUubG9naW5Mb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdm0uYWRkVHJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRyYWNrU2VydmljZS5hZGRUcmFjayh2bSkudGhlbihmdW5jdGlvbiAoYWRkVHJhY2tSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGFkZFRyYWNrRXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRQaWMoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9waG90b3MvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW1nX3NyYyA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkR1BYKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvZ3B4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3B4ID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZmluaXNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xyXG4gICAgICAgICAgICBtYXJrZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYWluTWFya2VyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2bS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZtLmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmHFn2thIGJpciBub2t0YXlhIHTEsWtsYXlhcmFrIGtheWTEsXIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbihcImxlYWZsZXREaXJlY3RpdmVNYXAuY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWFmRXZlbnQgPSBhcmdzLmxlYWZsZXRFdmVudDtcclxuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUuZ2VvY29kZUxhdGxuZyhsZWFmRXZlbnQubGF0bG5nLmxhdCwgbGVhZkV2ZW50LmxhdGxuZy5sbmcpLnRoZW4oZnVuY3Rpb24gKGdlb2NvZGVTdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9jYXRpb24gPSBnZW9jb2RlU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubGF0ID0gbGVhZkV2ZW50LmxhdGxuZy5sYXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubG5nID0gbGVhZkV2ZW50LmxhdGxuZy5sbmc7XHJcbiAgICAgICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW2xlYWZFdmVudC5sYXRsbmcubG5nLCBsZWFmRXZlbnQubGF0bG5nLmxhdF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIiIsIi8qKlxyXG4gKiBAZGVzYyBTZXJ2aWNlcyB0aGF0IGNvbnZlcnRzIGdlb2pzb24gZmVhdHVyZXMgdG8gbWFya2VycyBmb3IgaGFuZGxpbmcgbGF0ZXJcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXJrZXJQYXJzZXIoJHEpIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGpzb25Ub01hcmtlckFycmF5OiBqc29uVG9NYXJrZXJBcnJheSxcclxuICAgICAgICB0b09iamVjdDogdG9PYmplY3RcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuXHRmdW5jdGlvbiBqc29uVG9NYXJrZXJBcnJheSh2YWwpIHtcclxuICAgICAgICB2YXIgZGVmZXJlZCA9ICRxLmRlZmVyKCk7IC8vIGRlZmVyZWQgb2JqZWN0IHJlc3VsdCBvZiBhc3luYyBvcGVyYXRpb25cclxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICAgIHZhciBtYXJrID0ge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXI6IFwicm90YWxhclwiLFxyXG4gICAgICAgICAgICAgICAgbGF0OiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDRjMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuYWx0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXN0YW5jZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW1tYXJ5XCIgOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjp2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG1hcmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvdXRwdXQpIHtcclxuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBkZWZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XHJcbiAgICAgICAgdmFyIHJ2ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgaWYgKGFycmF5W2ldICE9PSB1bmRlZmluZWQpIHJ2W2ldID0gYXJyYXlbaV07XHJcbiAgICAgICAgcmV0dXJuIHJ2OyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLm1hcmtlclBhcnNlcicsIFtdKVxyXG4uZmFjdG9yeSgnbWFya2VyUGFyc2VyJywgbWFya2VyUGFyc2VyKTsiLCJmdW5jdGlvbiB0cmFja1NlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgZW5kcG9pbnQgPSAnaHR0cDpsb2NhbGhvc3Q6ODA4MC8nXHJcblxyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VHJhY2s6IGdldFRyYWNrLFxyXG5cdFx0YWRkVHJhY2s6IGFkZFRyYWNrLFxyXG5cdFx0Z2V0VHJhY2tEZXRhaWw6Z2V0VHJhY2tEZXRhaWwsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2socGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzP2xhdE5FPScrIHBhcmFtcy5sYXRORSsnJmxuZ05FPScrcGFyYW1zLmxuZ05FICsnJmxhdFNXPScrcGFyYW1zLmxhdFNXICsnJmxuZ1NXPScrcGFyYW1zLmxuZ1NXLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFja0RldGFpbChpZCkge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nK2lkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRyYWNrKHRyYWNrKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcycsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF0YTogJC5wYXJhbSh7XHJcblx0XHRcdFx0XCJuYW1lXCI6IHRyYWNrLm5hbWUsXHJcblx0XHRcdFx0XCJkaXN0YW5jZVwiOiB0cmFjay5kaXN0YW5jZSxcclxuXHRcdFx0XHRcImFsdGl0dWRlXCI6IHRyYWNrLmFsdGl0dWRlLFxyXG5cdFx0XHRcdFwic3VtbWFyeVwiOiB0cmFjay5zdW1tYXJ5LFxyXG5cdFx0XHRcdFwiaW1nX3NyY1wiOiB0cmFjay5pbWdfc3JjLFxyXG5cdFx0XHRcdFwiY29vcmRpbmF0ZXNcIjogdHJhY2suY29vcmRpbmF0ZXMsXHJcblx0XHRcdFx0XCJvd25lZEJ5XCI6IHRyYWNrLm93bmVkQnksXHJcblx0XHRcdFx0XCJncHhcIjogdHJhY2suZ3B4LFxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLnRyYWNrU2VydmljZScsIFtdKVxyXG5cdC5mYWN0b3J5KCd0cmFja1NlcnZpY2UnLCB0cmFja1NlcnZpY2UpOyIsImZ1bmN0aW9uIHVzZXJTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRVc2VyOiBnZXRVc2VyLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgIFx0cmV0dXJuICRodHRwKHtcclxuICAgIFx0XHRtZXRob2Q6ICdHRVQnLFxyXG4gICAgXHRcdHVybDogJ2FwaS9wcm9maWxlJ1xyXG4gICAgXHR9KVxyXG4gICAgfTsgXHJcbn0gXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLnVzZXJTZXJ2aWNlJywgW10pXHJcbi5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQSBkaXJlY3RpdmUgZm9yIGFkZGluZyBnb29nbGUgcGxhY2VzIGF1dG9jb21wbGV0ZSB0byBhIHRleHQgYm94XHJcbiAqIGdvb2dsZSBwbGFjZXMgYXV0b2NvbXBsZXRlIGluZm86IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3BsYWNlc1xyXG4gKlxyXG4gKiBTaW1wbGUgVXNhZ2U6XHJcbiAqXHJcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiLz5cclxuICpcclxuICogY3JlYXRlcyB0aGUgYXV0b2NvbXBsZXRlIHRleHQgYm94IGFuZCBnaXZlcyB5b3UgYWNjZXNzIHRvIHRoZSByZXN1bHRcclxuICpcclxuICogICArIGBuZy1hdXRvY29tcGxldGU9XCJyZXN1bHRcImA6IHNwZWNpZmllcyB0aGUgZGlyZWN0aXZlLCAkc2NvcGUucmVzdWx0IHdpbGwgaG9sZCB0aGUgdGV4dGJveCByZXN1bHRcclxuICpcclxuICpcclxuICogQWR2YW5jZWQgVXNhZ2U6XHJcbiAqXHJcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiIGRldGFpbHM9XCJkZXRhaWxzXCIgb3B0aW9ucz1cIm9wdGlvbnNcIi8+XHJcbiAqXHJcbiAqICAgKyBgbmctYXV0b2NvbXBsZXRlPVwicmVzdWx0XCJgOiBzcGVjaWZpZXMgdGhlIGRpcmVjdGl2ZSwgJHNjb3BlLnJlc3VsdCB3aWxsIGhvbGQgdGhlIHRleHRib3ggYXV0b2NvbXBsZXRlIHJlc3VsdFxyXG4gKlxyXG4gKiAgICsgYGRldGFpbHM9XCJkZXRhaWxzXCJgOiAkc2NvcGUuZGV0YWlscyB3aWxsIGhvbGQgdGhlIGF1dG9jb21wbGV0ZSdzIG1vcmUgZGV0YWlsZWQgcmVzdWx0OyBsYXRsbmcuIGFkZHJlc3MgY29tcG9uZW50cywgZXRjLlxyXG4gKlxyXG4gKiAgICsgYG9wdGlvbnM9XCJvcHRpb25zXCJgOiBvcHRpb25zIHByb3ZpZGVkIGJ5IHRoZSB1c2VyIHRoYXQgZmlsdGVyIHRoZSBhdXRvY29tcGxldGUgcmVzdWx0c1xyXG4gKlxyXG4gKiAgICAgICsgb3B0aW9ucyA9IHtcclxuICogICAgICAgICAgIHR5cGVzOiB0eXBlLCAgICAgICAgc3RyaW5nLCB2YWx1ZXMgY2FuIGJlICdnZW9jb2RlJywgJ2VzdGFibGlzaG1lbnQnLCAnKHJlZ2lvbnMpJywgb3IgJyhjaXRpZXMpJ1xyXG4gKiAgICAgICAgICAgYm91bmRzOiBib3VuZHMsICAgICBnb29nbGUgbWFwcyBMYXRMbmdCb3VuZHMgT2JqZWN0XHJcbiAqICAgICAgICAgICBjb3VudHJ5OiBjb3VudHJ5ICAgIHN0cmluZywgSVNPIDMxNjYtMSBBbHBoYS0yIGNvbXBhdGlibGUgY291bnRyeSBjb2RlLiBleGFtcGxlczsgJ2NhJywgJ3VzJywgJ2diJ1xyXG4gKiAgICAgICAgIH1cclxuICpcclxuICpcclxuICovXHJcblxyXG5hbmd1bGFyLm1vZHVsZSggXCJuZ0F1dG9jb21wbGV0ZVwiLCBbXSlcclxuICAuZGlyZWN0aXZlKCduZ0F1dG9jb21wbGV0ZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgZGV0YWlsczogJz0nLFxyXG4gICAgICAgIG5nQXV0b2NvbXBsZXRlOiAnPScsXHJcbiAgICAgICAgb3B0aW9uczogJz0nXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG1vZGVsKSB7XHJcblxyXG4gICAgICAgIC8vb3B0aW9ucyBmb3IgYXV0b2NvbXBsZXRlXHJcbiAgICAgICAgdmFyIG9wdHNcclxuXHJcbiAgICAgICAgLy9jb252ZXJ0IG9wdGlvbnMgcHJvdmlkZWQgdG8gb3B0c1xyXG4gICAgICAgIHZhciBpbml0T3B0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgb3B0cyA9IHt9XHJcbiAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy50eXBlcykge1xyXG4gICAgICAgICAgICAgIG9wdHMudHlwZXMgPSBbXVxyXG4gICAgICAgICAgICAgIG9wdHMudHlwZXMucHVzaChzY29wZS5vcHRpb25zLnR5cGVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zLmJvdW5kcykge1xyXG4gICAgICAgICAgICAgIG9wdHMuYm91bmRzID0gc2NvcGUub3B0aW9ucy5ib3VuZHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy5jb3VudHJ5KSB7XHJcbiAgICAgICAgICAgICAgb3B0cy5jb21wb25lbnRSZXN0cmljdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudHJ5OiBzY29wZS5vcHRpb25zLmNvdW50cnlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaW5pdE9wdHMoKVxyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgYXV0b2NvbXBsZXRlXHJcbiAgICAgICAgLy9yZWluaXRpYWxpemVzIG9uIGV2ZXJ5IGNoYW5nZSBvZiB0aGUgb3B0aW9ucyBwcm92aWRlZFxyXG4gICAgICAgIHZhciBuZXdBdXRvY29tcGxldGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNjb3BlLmdQbGFjZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGVsZW1lbnRbMF0sIG9wdHMpO1xyXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoc2NvcGUuZ1BsYWNlLCAncGxhY2VfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgICBpZiAoc2NvcGUuZGV0YWlscykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuZGV0YWlscyA9IHNjb3BlLmdQbGFjZS5nZXRQbGFjZSgpO1xyXG4vLyAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHNjb3BlLm5nQXV0b2NvbXBsZXRlID0gZWxlbWVudC52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdBdXRvY29tcGxldGUoKVxyXG5cclxuICAgICAgICAvL3dhdGNoIG9wdGlvbnMgcHJvdmlkZWQgdG8gZGlyZWN0aXZlXHJcbiAgICAgICAgc2NvcGUud2F0Y2hPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIHNjb3BlLm9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNjb3BlLiR3YXRjaChzY29wZS53YXRjaE9wdGlvbnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGluaXRPcHRzKClcclxuICAgICAgICAgIG5ld0F1dG9jb21wbGV0ZSgpXHJcbiAgICAgICAgICBlbGVtZW50WzBdLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICBzY29wZS5uZ0F1dG9jb21wbGV0ZSA9IGVsZW1lbnQudmFsKCk7XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSk7IiwiZnVuY3Rpb24gbWFwQ29uZmlnU2VydmljZSgpIHtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBnZXRMYXllcjogZ2V0TGF5ZXIsXHJcbiAgICAgICAgZ2V0Q2VudGVyOiBnZXRDZW50ZXIsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXIoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG92ZXJsYXlzOiB7XHJcbiAgICAgICAgICAgIHJvdGFsYXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnUm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgbGF0OiAzOS45MDMyOTE4LFxyXG4gICAgICAgICAgICBsbmc6IDMyLjYyMjMzOTYsXHJcbiAgICAgICAgICAgIHpvb206IDZcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbnRlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXAnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXBDb25maWdTZXJ2aWNlJywgbWFwQ29uZmlnU2VydmljZSk7IiwiZnVuY3Rpb24gZ2VvY29kZSgkcSkge1xyXG4gIHJldHVybiB7IFxyXG4gICAgZ2VvY29kZUFkZHJlc3M6IGZ1bmN0aW9uKGFkZHJlc3MpIHtcclxuICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IGFkZHJlc3MgfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcclxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgICAgLy8gd2luZG93LmZpbmRMb2NhdGlvbihyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgnZ2VvY29kZScsIGdlb2NvZGUpOyIsImZ1bmN0aW9uIHJldmVyc2VHZW9jb2RlKCRxLCAkaHR0cCkge1xyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgb2JqLmdlb2NvZGVMYXRsbmcgPSBmdW5jdGlvbiBnZW9jb2RlUG9zaXRpb24obGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHtcclxuICAgICAgICAgICAgbGF0TG5nOiBsYXRsbmdcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlcyAmJiByZXNwb25zZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2VzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ3JldmVyc2VHZW9jb2RlJywgcmV2ZXJzZUdlb2NvZGUpOyJdfQ==
