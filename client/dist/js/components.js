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
                            name: data.response.GeoObjectCollection.featureMember[i].GeoObject.name + ', ' + data.response.GeoObjectCollection.featureMember[i].GeoObject.description.replace(', Türkiye', ''),
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


window.mobilecheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

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
    'app.weather',
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
      template: '<profile-directive></profile-directive>'
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
        .module('app.rota', ['app.rotalar', 'app.rotalarDetail', 'app.rotaekle', 'ui.router'])
        .config(["$stateProvider", function ($stateProvider) { // provider-injector

            var rotalarState = {
                name: 'rotalar',
                url: '/a/{term}?latSW&lngSW&latNE&lngNE',
                template: '<navbar-directive></navbar-directive><rotalar></rotalar>',
                reloadOnSearch: false,
            };
            $stateProvider.state(rotalarState);

            var rotalarDetailState = {
                name: 'rotalarDetail',
                url: '/rota/:id',
                template: '<navbar-directive></navbar-directive><rotalar-detail></rotalar-detail>'
            };
            $stateProvider.state(rotalarDetailState);
 
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

    HeadlineController.$inject = ['$scope', '$state', '$interval', '$q','$window'];

    function HeadlineController($scope, $state, $interval, $q,$window) {
        var vm = this;
        window.loadAutoComplete();
        vm.search = function () {
            $state.go('rotalar', {
                term: vm.elma
            })
        }

        $("#Autocomplete").focus(function () {
            $('html, body').animate({
                scrollTop: $("#Autocomplete").offset().top - 80
            }, 300);
        });

        // window.scrollX = 0;
        $window.scrollTo(0,0);


        $interval(changeBg, 6500);

        var i = 1;

        function changeBg() {
            if (i === 5) {
                //restart
                i = 0;
            }
            i++;
            // var imgUrl = "url('../../img/bg-" + i + ".jpg')";
            var imgUrl = "../../img/bg-" + i + ".jpg";

            preload(imgUrl).then(function () {
                angular.element(".headline")
                    .css({
                        background: "url("+ imgUrl +")",
                    });
            });
        }


        function preload(url) {
            var deffered = $q.defer(),
            image = new Image();

            image.src = url;

            if (image.complete) {

                deffered.resolve();

            } else {

                image.addEventListener('load', function () {
                    deffered.resolve();
                });

                image.addEventListener('error', function () {
                    deffered.reject();
                });
            }

            return deffered.promise;
        }


    }
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

    window.loadAutoComplete(); 

    vm.openNav = openNav;
    vm.closeNav = closeNav;




    function openNav() {
        document.getElementById("myNav").style.height = "100%";
    }

    function closeNav() {
        document.getElementById("myNav").style.height  = "0%";
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
(function () {
    'use strict';

    angular
        .module('app.rotaekle', ['app.map','app.trackService', 'ngFileUpload', 'angular-ladda'])
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
                $state.go('rotalar');
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

angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null
}
angular
    .module('app.rotalar', [])
    .directive('rotalar', rotalar)

function rotalar() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/rota/rotalar/rotalar.html',
        scope: {},
        controller: RotalarController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

RotalarController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'trackService',
    'markerParser', 'mapConfigService', 'leafletMapEvents', 'leafletData', '$location', '$window'
];

function RotalarController($scope, $rootScope, $state, $stateParams, trackService,
    markerParser, mapConfigService, leafletMapEvents, leafletData, $location, $window) {
    var vm = this;
    vm.tracks = {};
    vm.getTrack = getTrack;
    vm.mapAutoRefresh = true;
    vm.openMap = openMap;
    vm.params = {};
    if (angular.isUndefinedOrNull($stateParams.latNE) || 
    angular.isUndefinedOrNull($stateParams.lngNE) || 
    angular.isUndefinedOrNull($stateParams.latSW) || 
    angular.isUndefinedOrNull($stateParams.lngSW)
    ) {
        vm.params.latNE = 44.292;
        vm.params.lngNE = 41.264;
        vm.params.latSW = 32.805;
        vm.params.lngSW = 27.773;
    } else {
        vm.params = {
            latNE: parseFloat($stateParams.latNE),
            lngNE: parseFloat($stateParams.lngNE),
            latSW: parseFloat($stateParams.latSW),
            lngSW: parseFloat($stateParams.lngSW),
        };
    }


    activate();
    $rootScope.searchLocation = $stateParams.term;

    // if(window.mobilecheck && vm.mapActive){

    // }
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
                vm.markersEmpty = angular.equals(Object.keys(vm.markers).length, 0);
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
        //  console.log(vm.mapEvents);
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function (event, args) {
            if (event.name == 'leafletDirectiveMarker.mouseover') {
                vm.changeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMarker.mouseout') {
                vm.removeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMap.moveend') {
                // console.log(asd);
            }
        });
    }
    var mapEvent = 'leafletDirectiveMap.dragend';

    $scope.$on(mapEvent, function (event, args) {
        //  console.log(args.leafletObject);
        if (vm.mapAutoRefresh) {
            if (vm.markers != undefined) {
                vm.params.latNE = args.leafletObject.getBounds()._northEast.lat;
                vm.params.lngNE = args.leafletObject.getBounds()._northEast.lng;
                vm.params.latSW = args.leafletObject.getBounds()._southWest.lat;
                vm.params.lngSW = args.leafletObject.getBounds()._southWest.lng;
            }
            if ($('.data-viz').width() > 0) {
                $location.search({
                    'latNE': args.leafletObject.getBounds()._northEast.lat,
                    'lngNE': args.leafletObject.getBounds()._northEast.lng,
                    'latSW': args.leafletObject.getBounds()._southWest.lat,
                    'lngSW': args.leafletObject.getBounds()._southWest.lng
                })
            }

            leafletData.getMap().then(function (map) {
                // map.fitBounds(bounds);
                return vm.getTrack().then(function () {});
            });

        }


    });

    vm.toggleTitle = ' Harita';

    function openMap() {
        vm.mapActive = !vm.mapActive;
        $('.data-viz').toggleClass('map-open');
        $('.map-auto-refresh').toggleClass('refresh-open');
        (vm.toggleTitle == ' Harita' ? vm.toggleTitle = ' Liste' : vm.toggleTitle = ' Harita')

        // console.log($('.data-viz').width());
        leafletData.getMap().then(function (map) {
            map.invalidateSize();
        });
    }



}
angular
    .module('app.rotalarDetail', [])
    .directive('rotalarDetail', rotalarDetail)

function rotalarDetail() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/rota/rotalar.detail/rotalar.detail.html',
        scope: {},
        controller: RotalarDetailController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

RotalarDetailController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData', 'weatherAPI'];

function RotalarDetailController($scope, $stateParams, trackService, mapConfigService, leafletData, weatherAPI) {
    var vm = this;
    vm.trackDetail = {};
    vm.center = {};

    activate();

    function activate() {
        trackService.getTrackDetail($stateParams.id).then(function (res) {
            vm.trackDetail = res.data;
            vm.trackDetail.properties.img_src = vm.trackDetail.properties.img_src;
            vm.center = {
                lat: vm.trackDetail.geometry.coordinates[1],
                lng: vm.trackDetail.geometry.coordinates[0],
                zoom: 12
            }

            vm.gpxData = {};

            weatherAPI.darkSkyWeather(vm.trackDetail.geometry.coordinates[1], vm.trackDetail.geometry.coordinates[0]).then(function (res) {
                vm.weather = res;
                var skycons = new Skycons({
                    color: 'black'
                });
                skycons.add("icon1", res.currently.icon);
                skycons.play();

                var skycons = new Skycons({
                    color: 'white'
                });
                skycons.add("icon2", res.currently.icon);
                skycons.play();
                var skyconsDaily = new Skycons({
                    color: 'black'
                });
                var skyconsDailyWhite = new Skycons({
                    color: 'white'
                });
                setTimeout(function () {
                    angular.forEach(vm.weather.daily.data, function (value, key) {

                        var s = key + 10;
                        var k = key + 20;
                        var ss = "icon" + s;
                        var kk = "icon" + k;

                        skyconsDaily.add(ss, value.icon)
                        skyconsDailyWhite.add(kk, value.icon)
                        skyconsDaily.play();
                        skyconsDailyWhite.play();
                    });
                }, 0);
            })

            leafletData.getMap().then(function (map) {
                map.scrollWheelZoom.disable();
                map.dragging.disable();
                // map.addControl(new L.Control.Fullscreen());
                
                var gpx = vm.trackDetail.properties.gpx; // URL to your GPX file or the GPX itself
                var g = new L.GPX(gpx, {
                    async: true,
                    polyline_options: {
                        color: 'yellow',
                        dashArray: '10,10',
                        weight: '3',
                        opacity: '0.9'
                    },
                    marker_options: {
                        wptIconUrls: {
                            '': 'img/icon-go.svg',
                            'Geocache Found': 'img/gpx/geocache.png',
                            'Park': 'img/gpx/tree.png'
                        },
                        startIconUrl: 'img/icon-go.svg',
                        endIconUrl: 'img/icon-stop.svg',
                        shadowUrl: 'img/pin-shadow.png'
                    },

                });
                g.on('loaded', function (e) {
                    vm.gpxData.distance = e.target.get_distance();
                    vm.gpxData.eleMin = e.target.get_elevation_min();
                    vm.gpxData.eleMax = e.target.get_elevation_max();
                    vm.data = {
                        dataset0: e.target.get_elevation_data()
                    }

                    map.fitBounds(e.target.getBounds());
                });
                g.addTo(map);
            });

        })

    }


    vm.layers = mapConfigService.getLayerForDetail();
    var controls =  {
                    fullscreen: {
                        position: 'topleft'
                    }
                }
    vm.controls = controls;

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
(function () {
    'use strict';

    var serviceId = 'weatherAPI';

    angular.module('app.weather', [])
        .factory(serviceId, ['$q', '$http', weatherAPI]);

    function weatherAPI($q, $http) {
        var service = {
            weather: weather,
            forecast: forecast,
            darkSkyWeather: darkSkyWeather,
            appid: 'fa2d593aa58e90fde328426e64a64e38'
        };
        return service;

        function weather(lat, lng) {
            var deferred = $q.defer();
            $http({
                dataType: 'json',
                data: '',
                method: 'GET',
                url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + service.appid + '&units=metric&lang=tr'
            }).then(
                function (res) {
                    if (res.data.cod === 200) {
                        var offsetHours = 0;
                        var offsetMinutes = 0;
                        // Calculate current hour using offset from UTC.
                        var datetime = new Date((res.data.dt * 1000) + (offsetHours * 3600000) + (offsetMinutes * 60000));
                        var sunrise = new Date(res.data.sys.sunrise * 1000 + (offsetHours * 3600000) + (offsetMinutes * 60000));
                        var sunset = new Date(res.data.sys.sunset * 1000 + (offsetHours * 3600000) + (offsetMinutes * 60000));
                        var dataCurrent = {}
                        dataCurrent.datetime = datetime;
                        dataCurrent.currentHour = dataCurrent.datetime.getUTCHours();
                        dataCurrent.sunriseHour = sunrise.getUTCHours();
                        dataCurrent.sunsetHour = sunset.getUTCHours();
                        dataCurrent.weatherClass;
                        // Hour between sunset and sunrise being night time
                        var night = false;
                        if (dataCurrent.currentHour >= dataCurrent.sunsetHour || dataCurrent.currentHour <= dataCurrent.sunriseHour) {
                            night = true;
                        }
                        // Format weather description
                        dataCurrent.weatherDescription = res.data.weather[0].description.charAt(0).toUpperCase() + res.data.weather[0].description.slice(1);
                        // Change weather icon class according to weather code.
                        if (night) {
                            switch (res.data.weather[0].id) {
                                case 200:
                                case 201:
                                case 202:
                                case 210:
                                case 211:
                                case 212:
                                case 221:
                                    dataCurrent.weatherClass = "wi-night-alt-thunderstorm";
                                    break;
                                case 230:
                                case 231:
                                case 232:
                                case 901:
                                    dataCurrent.weatherClass = "wi-night-alt-storm-showers";
                                    break;
                                case 300:
                                case 301:
                                case 302:
                                case 310:
                                case 311:
                                case 312:
                                case 313:
                                case 314:
                                case 321:
                                case 621:
                                case 622:
                                    dataCurrent.weatherClass = "wi-night-alt-showers";
                                    break;
                                case 500:
                                case 501:
                                case 502:
                                case 503:
                                case 504:
                                case 511:
                                case 520:
                                case 521:
                                case 522:
                                case 531:
                                    dataCurrent.weatherClass = "wi-night-alt-rain";
                                    break;
                                case 600:
                                case 601:
                                case 602:
                                case 611:
                                case 612:
                                    dataCurrent.weatherClass = "wi-night-alt-snow";
                                    break;
                                case 615:
                                case 616:
                                case 620:
                                case 611:
                                case 612:
                                    dataCurrent.weatherClass = "wi-night-alt-rain-mix";
                                    break;
                                case 701:
                                case 721:
                                case 741:
                                    dataCurrent.weatherClass = "wi-night-fog";
                                    break;
                                case 800:
                                case 951:
                                    dataCurrent.weatherClass = "wi-night-clear";
                                    break;
                                case 801:
                                case 802:
                                case 803:
                                case 804:
                                    dataCurrent.weatherClass = "wi-night-alt-cloudy";
                                    break;
                                case 906:
                                    dataCurrent.weatherClass = "wi-night-alt-hail";
                                    break;
                                case 906:
                                    dataCurrent.weatherClass = "wi-night-alt-cloudy-windy";
                                    break;
                            }
                        } else {
                            switch (res.data.weather[0].id) {
                                case 200:
                                case 201:
                                case 202:
                                case 210:
                                case 211:
                                case 212:
                                case 221:
                                    dataCurrent.weatherClass = "wi-day-thunderstorm";
                                    break;
                                case 230:
                                case 231:
                                case 232:
                                case 901:
                                    dataCurrent.weatherClass = "wi-day-storm-showers";
                                    break;
                                case 300:
                                case 301:
                                case 302:
                                case 310:
                                case 311:
                                case 312:
                                case 313:
                                case 314:
                                case 321:
                                case 621:
                                case 622:
                                    dataCurrent.weatherClass = "wi-day-showers";
                                    break;
                                case 500:
                                case 501:
                                case 502:
                                case 503:
                                case 504:
                                case 511:
                                case 520:
                                case 521:
                                case 522:
                                case 531:
                                    dataCurrent.weatherClass = "wi-day-rain";
                                    break;
                                case 600:
                                case 601:
                                case 602:
                                case 611:
                                case 612:
                                    dataCurrent.weatherClass = "wi-day-snow";
                                    break;
                                case 615:
                                case 616:
                                case 620:
                                case 611:
                                case 612:
                                    dataCurrent.weatherClass = "wi-day-rain-mix";
                                    break;
                                case 701:
                                case 721:
                                case 741:
                                    dataCurrent.weatherClass = "wi-day-fog";
                                    break;
                                case 800:
                                case 951:
                                    dataCurrent.weatherClass = "wi-day-sunny";
                                    break;
                                case 801:
                                case 802:
                                case 803:
                                case 804:
                                    dataCurrent.weatherClass = "wi-day-cloudy";
                                    break;
                                case 906:
                                    dataCurrent.weatherClass = "wi-day-hail";
                                    break;
                                case 906:
                                    dataCurrent.weatherClass = "wi-day-cloudy-windy";
                                    break;
                            }

                        }
                        switch (res.data.weather[0].id) {
                            case 731:
                            case 751:
                            case 761:
                            case 762:
                                dataCurrent.weatherClass = "wi-dust";
                                break;
                            case 711:
                                dataCurrent.weatherClass = "wi-smoke";
                                break;
                            case 771:
                            case 957:
                            case 958:
                            case 959:
                            case 960:
                                dataCurrent.weatherClass = "wi-strong-wind";
                                break;
                            case 781:
                            case 900:
                                dataCurrent.weatherClass = "wi-tornado";
                                break;
                            case 902:
                            case 961:
                            case 962:
                                dataCurrent.weatherClass = "wi-hurricane";
                                break;
                            case 903:
                                dataCurrent.weatherClass = "wi-snowflake-cold";
                                break;
                            case 904:
                                dataCurrent.weatherClass = "wi-hot";
                                break;
                            case 905:
                            case 951:
                            case 952:
                            case 953:
                            case 954:
                            case 955:
                            case 956:
                                dataCurrent.weatherClass = "wi-windy";
                                break;
                        }
                        deferred.resolve({
                            dataCurrent: dataCurrent,
                            data: res.data
                        })
                    } else {
                        deferred.resolve(response);
                    }

                },
                function (reject) {
                    deferred.reject({
                        data: reject.code,
                        errorType: 2
                    });
                });
            return deferred.promise;
        }

        function forecast(lat, lng) {

        }

        function darkSkyWeather(lat, lng) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'api/weather/' + lat + '/' + lng,
                headers: {
                    'content-type': 'application/json; charset=utf-8'
                }
            }).then(
                function (res) {
                    if (res.data.OperationResult) {
                        var data = res.data.data;
                        data.currently.time = new Date((data.currently.time * 1000));
                        angular.forEach(data.daily.data, function (value, key) {
                            data.daily.data[key].time =  new Date((value.time * 1000));
                        });
                        deferred.resolve(data);
                    } else {
                        deferred.resolve(false);
                    }
                },
                function (reject) {
                    deferred.reject({
                        data: reject.code,
                        errorType: 2
                    });
                });
            return deferred.promise;
        }
    }
})();
function mapConfigService() {

    var service = {
        getLayer: getLayer,
        getCenter: getCenter,
        getLayerForDetail: getLayerForDetail,
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

                Mapbox_Satellite: {
                    name: 'Uydu',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JhYmF6b3IiLCJhIjoidG9LRHliNCJ9.SHYbmfen-jwKWCYDiOBUWQ',
                    type: 'xyz',
                    attribution: 'Map tiles by Mapbox'
                },
                Mapbox_Outdoor: {
                    name: 'Outdoor',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JhYmF6b3IiLCJhIjoidG9LRHliNCJ9.SHYbmfen-jwKWCYDiOBUWQ',
                    type: 'xyz',
                    attribution: 'Map tiles by Mapbox'
                },
                Thunderforest_Outdoors: {
                    name: 'Outdoor 2',
                    url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=2e7a3315a7c845548fbd8a1cf221a985',
                    type: 'xyz',
                },
                Thunderforest_Lanscape: {
                    name: 'İzohips',
                    url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=2e7a3315a7c845548fbd8a1cf221a985',
                    type: 'xyz',
                },
                Yandex: {
                    name: 'Yandex Yol',
                    type: 'yandex', 
                    layerOptions: {
                        layerType: 'map',
                    }
                },

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

    function getLayerForDetail() {
        var layers = {
            baselayers: {
                Thunderforest_Outdoors: {
                    name: 'Outdoor 2',
                    url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=2e7a3315a7c845548fbd8a1cf221a985',
                    type: 'xyz',
                },
                Stamen_Terrain: {
                    name: 'Arazi',
                    url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
                    type: 'xyz',
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                },
                Mapbox_Satellite: {
                    name: 'Uydu',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JhYmF6b3IiLCJhIjoidG9LRHliNCJ9.SHYbmfen-jwKWCYDiOBUWQ',
                    type: 'xyz',
                    attribution: 'Map tiles by Mapbox'
                },
                Mapbox_Outdoor: {
                    name: 'Outdoor',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JhYmF6b3IiLCJhIjoidG9LRHliNCJ9.SHYbmfen-jwKWCYDiOBUWQ',
                    type: 'xyz',
                    attribution: 'Map tiles by Mapbox'
                },
                Thunderforest_Outdoors: {
                    name: 'Outdoor 2',
                    url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=2e7a3315a7c845548fbd8a1cf221a985',
                    type: 'xyz',
                },
                Yandex: {
                    name: 'Yandex Yol',
                    type: 'yandex', 
                    layerOptions: {
                        layerType: 'map',
                    }
                },
            }
        }
        return layers;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiaGVhZGxpbmUvaGVhZGxpbmUuanMiLCJmb290ZXIvZm9vdGVyLmpzIiwiY2FyZC9jYXJkLmpzIiwibmF2YmFyL25hdmJhci5qcyIsImxvZ2luL2xvZ2luLmpzIiwicHJvZmlsZS9wcm9maWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJyb3RhZWtsZS9yb3RhZWtsZS5qcyIsInJvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmpzIiwicm90YWxhci9yb3RhbGFyLmpzIiwicm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuanMiLCJtYXJrZXJwYXJzZXIuanMiLCJ0cmFjay5qcyIsInVzZXIuanMiLCJ3ZWF0aGVyQVBJLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8sT0FBTyxL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OztXQUU3QixVQUFVLEtBQUs7WUFDZCxPQUFPLFNBQVMsUUFBUTs7UUFFNUIsT0FBTyxTQUFTOztJQUVwQixPQUFPOzs7QUFHWDtFQUNFLE9BQU87RUFDUCxRQUFRLGtCQUFrQixnQkFBZ0IiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uIChzZWFyY2gsIHJlcGxhY2VtZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlbWVudCk7XHJcbn07XHJcblxyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcuZ2VvY29kZS1hdXRvY29tcGxldGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGF0KS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChxdWVyeSwgcHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZWRpY3Rpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICAkLmdldEpTT04oJ2h0dHBzOi8vZ2VvY29kZS1tYXBzLnlhbmRleC5ydS8xLngvP3Jlc3VsdHM9NSZiYm94PTI0LjEyNTk3NywzNC40NTIyMTh+NDUuMTA5ODYzLDQyLjYwMTYyMCZmb3JtYXQ9anNvbiZsYW5nPXRyX1RSJmdlb2NvZGU9JyArIHF1ZXJ5LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubmFtZSArICcsICcgKyBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24ucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb25nbGF0OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuUG9pbnQucG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YS5raW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0X3R5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYm94OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuYm91bmRlZEJ5LkVudmVsb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kZXNjcmlwdGlvbi5pbmRleE9mKCdUw7xya2l5ZScpID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9ucy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAocHJlZGljdGlvbnMgJiYgcHJlZGljdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXN1bHRzID0gJC5tYXAocHJlZGljdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jdGlvbiAocHJlZGljdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHZhciBkZXN0ID0gcHJlZGljdGlvbi5uYW1lICsgXCIsIFwiICsgcHJlZGljdGlvbi5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0ID0gZGVzdC5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzKHByZWRpY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlclNlbGVjdDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gJy9hLycgKyBpdGVtLm5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICAgICc/bGF0U1c9JyArIGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzFdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ1NXPScgKyBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVswXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsYXRORT0nICsgaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nTkU9JyArIGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9ICc8c3BhbiBjbGFzcz1cIml0ZW0tYWRkcmVzc1wiPicgKyBpdGVtICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgZml0VG9FbGVtZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGF0KS5vbigndHlwZWFoZWFkOmNoYW5nZScsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQpLnZhbChpdGVtLmZpbmQoJ2E+c3Bhbi5pdGVtLWFkZHJlc3MnKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbndpbmRvdy5tb2JpbGVjaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGVjayA9IGZhbHNlO1xyXG4gICAgKGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgaWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCwgNCkpKSBjaGVjayA9IHRydWU7XHJcbiAgICB9KShuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgd2luZG93Lm9wZXJhKTtcclxuICAgIHJldHVybiBjaGVjaztcclxufTtcclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgJ2FwcC5uYXZiYXInLFxyXG4gICAgJ2FwcC5sb2dpbicsXHJcbiAgICAnYXBwLnJlZ2lzdGVyJyxcclxuICAgICdhcHAuY2FyZCcsIFxyXG4gICAgJ2FwcC5wcm9maWxlJyxcclxuICAgICdhcHAudXNlclNlcnZpY2UnLFxyXG4gICAgJ2FwcC50cmFja1NlcnZpY2UnLFxyXG4gICAgJ2FwcC5tYXJrZXJQYXJzZXInLFxyXG4gICAgJ2FwcC5tYXAnLFxyXG4gICAgJ2FwcC5jb250ZW50JywgICAgXHJcbiAgICAnYXBwLnJvdGEnLFxyXG4gICAgJ29jLmxhenlMb2FkJyxcclxuICAgICd1aS5yb3V0ZXInLFxyXG4gICAgJ2xlYWZsZXQtZGlyZWN0aXZlJyxcclxuICAgICdhcHAud2VhdGhlcicsXHJcbiAgXSlcclxuICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCckbG9jYXRpb25Qcm92aWRlcicsJyRsb2dQcm92aWRlcicsJyRvY0xhenlMb2FkUHJvdmlkZXInLCckY29tcGlsZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJGxvZ1Byb3ZpZGVyLCAkb2NMYXp5TG9hZFByb3ZpZGVyLCRjb21waWxlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAkb2NMYXp5TG9hZFByb3ZpZGVyLmNvbmZpZyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlXHJcbiAgICB9KTtcclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xyXG4gICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgdmFyIGxvZ2luU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdsb2dpbicsXHJcbiAgICAgIHVybDogJy9naXJpcycsXHJcbiAgICAgIHRlbXBsYXRlOiAnPGxvZ2luLWRpcmVjdGl2ZT48L2xvZ2luLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobG9naW5TdGF0ZSk7XHJcblxyXG4gICAgdmFyIHJlZ2lzdGVyU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdyZWdpc3RlcicsXHJcbiAgICAgIHVybDogJy9rYXlpdCcsXHJcbiAgICAgIHRlbXBsYXRlOiAnPHJlZ2lzdGVyLWRpcmVjdGl2ZT48L3JlZ2lzdGVyLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocmVnaXN0ZXJTdGF0ZSk7XHJcblxyXG4gICAgdmFyIHByb2ZpbGVTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3Byb2ZpbGUnLFxyXG4gICAgICB1cmw6ICcvcHJvZmlsJyxcclxuICAgICAgdGVtcGxhdGU6ICc8cHJvZmlsZS1kaXJlY3RpdmU+PC9wcm9maWxlLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocHJvZmlsZVN0YXRlKTtcclxuICB9XSlcclxuICAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCB1c2VyU2VydmljZSkge1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGdldFVzZXIoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgICAgcmV0dXJuIHVzZXJTZXJ2aWNlLmdldFVzZXIoKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uZC5kYXRhLk9wZXJhdGlvblJlc3VsdCkgXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUudXNlciA9IHJlc3BvbmQuZGF0YS51c2VyO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmZsYWdMb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICB9IFxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB9KSgpOyBcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb250ZW50JywgWydhcHAuaGVhZGVyJywgJ2FwcC5mb290ZXInLCd1aS5yb3V0ZXInXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgIC8vICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnLyMvJyk7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJ2RlZmF1bHRTdGF0ZScsIFxyXG4gICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvbGFuZGluZy9sYW5kaW5nLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShkZWZhdWx0U3RhdGUpO1xyXG4gICAgfSlcclxuICBcclxufSkoKTsiLCIiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhJywgWydhcHAucm90YWxhcicsICdhcHAucm90YWxhckRldGFpbCcsICdhcHAucm90YWVrbGUnLCAndWkucm91dGVyJ10pXHJcbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgICAgIHZhciByb3RhbGFyU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYS97dGVybX0/bGF0U1cmbG5nU1cmbGF0TkUmbG5nTkUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHJvdGFsYXI+PC9yb3RhbGFyPicsXHJcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJvdGFsYXJTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcm90YWxhckRldGFpbFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvdGFsYXJEZXRhaWwnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGEvOmlkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxyb3RhbGFyLWRldGFpbD48L3JvdGFsYXItZGV0YWlsPidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocm90YWxhckRldGFpbFN0YXRlKTtcclxuIFxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjaycsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YWVrbGUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUvcm90YWVrbGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncm90YUVrbGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3JvdGFFa2xlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tMb2NhdGlvblN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmxvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rb251bScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5odG1sJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0xvY2F0aW9uU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTWV0YVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLm1ldGEnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2JpbGdpJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLm1ldGEvcm90YWVrbGUubWV0YS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTWV0YVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ltYWdlU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Jlc2ltbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmltYWdlL3JvdGFla2xlLmltYWdlLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tJbWFnZVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0dQWFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmdweCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZ3B4JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmdweC9yb3RhZWtsZS5ncHguaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0dQWFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ZpbmlzaFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmZpbmlzaCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva2F5ZGV0JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmZpbmlzaC9yb3RhZWtsZS5maW5pc2guaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ZpbmlzaFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmhlYWRlcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2hlYWRsaW5lRGlyZWN0aXZlJywgaGVhZGxpbmVEaXJlY3RpdmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlYWRsaW5lRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9oZWFkbGluZS9oZWFkbGluZS5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBIZWFkbGluZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgSGVhZGxpbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGludGVydmFsJywgJyRxJywnJHdpbmRvdyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRsaW5lQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJGludGVydmFsLCAkcSwkd2luZG93KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHZtLnNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdyb3RhbGFyJywge1xyXG4gICAgICAgICAgICAgICAgdGVybTogdm0uZWxtYVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiNBdXRvY29tcGxldGVcIikuZm9jdXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjQXV0b2NvbXBsZXRlXCIpLm9mZnNldCgpLnRvcCAtIDgwXHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHdpbmRvdy5zY3JvbGxYID0gMDtcclxuICAgICAgICAkd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcblxyXG5cclxuICAgICAgICAkaW50ZXJ2YWwoY2hhbmdlQmcsIDY1MDApO1xyXG5cclxuICAgICAgICB2YXIgaSA9IDE7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZUJnKCkge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgLy9yZXN0YXJ0XHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIC8vIHZhciBpbWdVcmwgPSBcInVybCgnLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZycpXCI7XHJcbiAgICAgICAgICAgIHZhciBpbWdVcmwgPSBcIi4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGdcIjtcclxuXHJcbiAgICAgICAgICAgIHByZWxvYWQoaW1nVXJsKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIi5oZWFkbGluZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInVybChcIisgaW1nVXJsICtcIilcIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlbG9hZCh1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHVybDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWFnZS5jb21wbGV0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZm9vdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdmb290ZXJEaXJlY3RpdmUnLCBmb290ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gZm9vdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgfTtcclxuICBcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxufSkoKTsgXHJcbiBcclxuIiwiLyoqXHJcbiogQGRlc2MgY2FyZCBjb21wb25lbnQgXHJcbiogQGV4YW1wbGUgPGNhcmQ+PC9jYXJkPlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY2FyZCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnY2FyZERpcmVjdGl2ZScsIGNhcmREaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gY2FyZERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9jYXJkL2NhcmQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICc8JyxcclxuICAgICAgICAgICAgc3VtbWFyeTogJzwnLFxyXG4gICAgICAgICAgICBvd25lcjonPCcsXHJcbiAgICAgICAgICAgIGltZ1NyYzonPCcsXHJcbiAgICAgICAgICAgIGlkOiAnPCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiBDYXJkQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENhcmRDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpczsgXHJcbiAgICAvLyB2bS5pbWdTcmMgPSB2bS5pbWdTcmMuc3BsaXQoJ2NsaWVudCcpWzFdO1xyXG59IFxyXG4iLCIvKipcclxuICogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4gKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiAqL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubmF2YmFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCduYXZiYXJEaXJlY3RpdmUnLCBuYXZiYXJEaXJlY3RpdmUpO1xyXG5cclxuZnVuY3Rpb24gbmF2YmFyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9uYXZiYXIvbmF2YmFyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBuYXZiYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7IFxyXG5cclxuICAgIHZtLm9wZW5OYXYgPSBvcGVuTmF2O1xyXG4gICAgdm0uY2xvc2VOYXYgPSBjbG9zZU5hdjtcclxuXHJcblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VOYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgID0gXCIwJVwiO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubG9naW4nLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xvZ2luRGlyZWN0aXZlJywgbG9naW5EaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gbG9naW5EaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL2xvZ2luL2xvZ2luLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBGb290ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3Byb2ZpbGVEaXJlY3RpdmUnLCBwcm9maWxlRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBwcm9maWxlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5cclxuXHJcbnByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAndXNlclNlcnZpY2UnLCAndHJhY2tTZXJ2aWNlJywgJ21hcmtlclBhcnNlciddO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UsdHJhY2tTZXJ2aWNlLG1hcmtlclBhcnNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yZWdpc3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncmVnaXN0ZXJEaXJlY3RpdmUnLCByZWdpc3RlckRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiByZWdpc3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvcmVnaXN0ZXIvcmVnaXN0ZXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IHJlZ2lzdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGFla2xlJywgWydhcHAubWFwJywnYXBwLnRyYWNrU2VydmljZScsICduZ0ZpbGVVcGxvYWQnLCAnYW5ndWxhci1sYWRkYSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdyb3RhRWtsZUNvbnRyb2xsZXInLCByb3RhRWtsZUNvbnRyb2xsZXIpXHJcblxyXG5cclxuICAgIHJvdGFFa2xlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ3JldmVyc2VHZW9jb2RlJywgJ3RyYWNrU2VydmljZScsICckc3RhdGUnLCAnVXBsb2FkJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YUVrbGVDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgbWFwQ29uZmlnU2VydmljZSwgcmV2ZXJzZUdlb2NvZGUsIHRyYWNrU2VydmljZSwgJHN0YXRlLCBVcGxvYWQpIHtcclxuICAgICAgICAvLyAkb2NMYXp5TG9hZC5sb2FkKCcuLi8uLi9zZXJ2aWNlcy9tYXAvbWFwLmF1dG9jb21wbGV0ZS5qcycpO1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgdm0ubG9jYXRpb247XHJcblxyXG4gICAgICAgIC8vVHJhY2sgcGFyYW1ldGVyc1xyXG4gICAgICAgIHZtLm93bmVkQnkgPSAkcm9vdFNjb3BlLnVzZXIuX2lkO1xyXG4gICAgICAgIHZtLmltZ19zcmMgPSBcInNyY1wiO1xyXG4gICAgICAgIHZtLnN1bW1hcnk7XHJcbiAgICAgICAgdm0uYWx0aXR1ZGU7XHJcbiAgICAgICAgdm0uZGlzdGFuY2U7XHJcbiAgICAgICAgdm0ubmFtZSA9ICcnO1xyXG4gICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW107XHJcbiAgICAgICAgdm0udXBsb2FkR1BYID0gdXBsb2FkR1BYO1xyXG4gICAgICAgIHZtLnVwbG9hZFBpYyA9IHVwbG9hZFBpYztcclxuXHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB2bS5hZGRUcmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdHJhY2tTZXJ2aWNlLmFkZFRyYWNrKHZtKS50aGVuKGZ1bmN0aW9uIChhZGRUcmFja1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3JvdGFsYXInKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGFkZFRyYWNrRXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRQaWMoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9waG90b3MvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW1nX3NyYyA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkR1BYKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvZ3B4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3B4ID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZmluaXNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xyXG4gICAgICAgICAgICBtYXJrZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYWluTWFya2VyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2bS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZtLmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmHFn2thIGJpciBub2t0YXlhIHTEsWtsYXlhcmFrIGtheWTEsXIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbihcImxlYWZsZXREaXJlY3RpdmVNYXAuY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWFmRXZlbnQgPSBhcmdzLmxlYWZsZXRFdmVudDtcclxuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUuZ2VvY29kZUxhdGxuZyhsZWFmRXZlbnQubGF0bG5nLmxhdCwgbGVhZkV2ZW50LmxhdGxuZy5sbmcpLnRoZW4oZnVuY3Rpb24gKGdlb2NvZGVTdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9jYXRpb24gPSBnZW9jb2RlU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubGF0ID0gbGVhZkV2ZW50LmxhdGxuZy5sYXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubG5nID0gbGVhZkV2ZW50LmxhdGxuZy5sbmc7XHJcbiAgICAgICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW2xlYWZFdmVudC5sYXRsbmcubG5nLCBsZWFmRXZlbnQubGF0bG5nLmxhdF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIiIsImFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICByZXR1cm4gYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpIHx8IHZhbCA9PT0gbnVsbFxyXG59XHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yb3RhbGFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyb3RhbGFyJywgcm90YWxhcilcclxuXHJcbmZ1bmN0aW9uIHJvdGFsYXIoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFsYXIvcm90YWxhci5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogUm90YWxhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuUm90YWxhckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLFxyXG4gICAgJ21hcmtlclBhcnNlcicsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXRNYXBFdmVudHMnLCAnbGVhZmxldERhdGEnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnXHJcbl07XHJcblxyXG5mdW5jdGlvbiBSb3RhbGFyQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsXHJcbiAgICBtYXJrZXJQYXJzZXIsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXRNYXBFdmVudHMsIGxlYWZsZXREYXRhLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIHZtLmdldFRyYWNrID0gZ2V0VHJhY2s7XHJcbiAgICB2bS5tYXBBdXRvUmVmcmVzaCA9IHRydWU7XHJcbiAgICB2bS5vcGVuTWFwID0gb3Blbk1hcDtcclxuICAgIHZtLnBhcmFtcyA9IHt9O1xyXG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxhdE5FKSB8fCBcclxuICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxuZ05FKSB8fCBcclxuICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxhdFNXKSB8fCBcclxuICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxuZ1NXKVxyXG4gICAgKSB7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gNDQuMjkyO1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdORSA9IDQxLjI2NDtcclxuICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSAzMi44MDU7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gMjcuNzczO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2bS5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGxhdE5FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRORSksXHJcbiAgICAgICAgICAgIGxuZ05FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdORSksXHJcbiAgICAgICAgICAgIGxhdFNXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRTVyksXHJcbiAgICAgICAgICAgIGxuZ1NXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdTVyksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuICAgICRyb290U2NvcGUuc2VhcmNoTG9jYXRpb24gPSAkc3RhdGVQYXJhbXMudGVybTtcclxuXHJcbiAgICAvLyBpZih3aW5kb3cubW9iaWxlY2hlY2sgJiYgdm0ubWFwQWN0aXZlKXtcclxuXHJcbiAgICAvLyB9XHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICBpZiAodm0ucGFyYW1zLmxhdE5FICYmIHZtLnBhcmFtcy5sbmdORSAmJiB2bS5wYXJhbXMubGF0U1cgJiYgdm0ucGFyYW1zLmxuZ1NXKSB7XHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdE5FLCB2bS5wYXJhbXMubG5nTkVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0U1csIHZtLnBhcmFtcy5sbmdTV10sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VHJhY2soKSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYWNrU2VydmljZS5nZXRUcmFjayh2bS5wYXJhbXMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tzLmRhdGEgPSByZXNwb25kLmRhdGE7XHJcbiAgICAgICAgICAgIGlmICh2bS50cmFja3MuZGF0YSA9PSBbXSkge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXJrZXJQYXJzZXIuanNvblRvTWFya2VyQXJyYXkodm0udHJhY2tzLmRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXJrZXJzID0gbWFya2VyUGFyc2VyLnRvT2JqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBMLmdlb0pzb24odm0udHJhY2tzLmRhdGEpLmdldEJvdW5kcygpO1xyXG4gICAgICAgICAgICAgICAgLy8gbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXJrZXJzRW1wdHkgPSBhbmd1bGFyLmVxdWFscyhPYmplY3Qua2V5cyh2bS5tYXJrZXJzKS5sZW5ndGgsIDApO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgdm0uY2VudGVyID0gbWFwQ29uZmlnU2VydmljZS5nZXRDZW50ZXIoKTtcclxuXHJcbiAgICB2bS5jaGFuZ2VJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIC8vIHZhciBzd2FwID0gbWFya2VyLmljb247XHJcbiAgICAgICAgLy8gbWFya2VyLmljb24gPSBtYXJrZXIuaWNvbl9zd2FwO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uX3N3YXAgPSBzd2FwO1xyXG4gICAgICAgIC8vIGlmIChtYXJrZXIuZm9jdXMpXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkbG9jYXRpb24uc2VhcmNoKCkubGF0TkUgPSAyMCk7XHJcbiAgICAgICAgbWFya2VyLmljb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS5yZW1vdmVJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjMDA0YzAwJyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0uem9vbU1hcmtlciA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICB2YXIgbGF0TG5ncyA9IFtcclxuICAgICAgICAgICAgW21hcmtlci5sYXQsIG1hcmtlci5sbmddXHJcbiAgICAgICAgXTtcclxuICAgICAgICB2YXIgbWFya2VyQm91bmRzID0gTC5sYXRMbmdCb3VuZHMobGF0TG5ncyk7XHJcbiAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcC5maXRCb3VuZHMobWFya2VyQm91bmRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5tYXBFdmVudHMgPSBsZWFmbGV0TWFwRXZlbnRzLmdldEF2YWlsYWJsZU1hcEV2ZW50cygpO1xyXG5cclxuICAgIGZvciAodmFyIGsgaW4gdm0ubWFwRXZlbnRzKSB7XHJcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKHZtLm1hcEV2ZW50cyk7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLicgKyB2bS5tYXBFdmVudHNba107XHJcbiAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2VJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3V0Jykge1xyXG4gICAgICAgICAgICAgICAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcC5tb3ZlZW5kJykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXNkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdmFyIG1hcEV2ZW50ID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuZHJhZ2VuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudCwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKGFyZ3MubGVhZmxldE9iamVjdCk7XHJcbiAgICAgICAgaWYgKHZtLm1hcEF1dG9SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXJrZXJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcuZGF0YS12aXonKS53aWR0aCgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdE5FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ1NXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICB2bS50b2dnbGVUaXRsZSA9ICcgSGFyaXRhJztcclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuTWFwKCkge1xyXG4gICAgICAgIHZtLm1hcEFjdGl2ZSA9ICF2bS5tYXBBY3RpdmU7XHJcbiAgICAgICAgJCgnLmRhdGEtdml6JykudG9nZ2xlQ2xhc3MoJ21hcC1vcGVuJyk7XHJcbiAgICAgICAgJCgnLm1hcC1hdXRvLXJlZnJlc2gnKS50b2dnbGVDbGFzcygncmVmcmVzaC1vcGVuJyk7XHJcbiAgICAgICAgKHZtLnRvZ2dsZVRpdGxlID09ICcgSGFyaXRhJyA/IHZtLnRvZ2dsZVRpdGxlID0gJyBMaXN0ZScgOiB2bS50b2dnbGVUaXRsZSA9ICcgSGFyaXRhJylcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJCgnLmRhdGEtdml6Jykud2lkdGgoKSk7XHJcbiAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59IiwiYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJvdGFsYXJEZXRhaWwnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JvdGFsYXJEZXRhaWwnLCByb3RhbGFyRGV0YWlsKVxyXG5cclxuZnVuY3Rpb24gcm90YWxhckRldGFpbCgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJEZXRhaWxDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJEZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnLCAnd2VhdGhlckFQSSddO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckRldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEsIHdlYXRoZXJBUEkpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja0RldGFpbCA9IHt9O1xyXG4gICAgdm0uY2VudGVyID0ge307XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0cmFja1NlcnZpY2UuZ2V0VHJhY2tEZXRhaWwoJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjO1xyXG4gICAgICAgICAgICB2bS5jZW50ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIHpvb206IDEyXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLmdweERhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHdlYXRoZXJBUEkuZGFya1NreVdlYXRoZXIodm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sIHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHZtLndlYXRoZXIgPSByZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29ucyA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLmFkZChcImljb24xXCIsIHJlcy5jdXJyZW50bHkuaWNvbik7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLnBsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29ucyA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLmFkZChcImljb24yXCIsIHJlcy5jdXJyZW50bHkuaWNvbik7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zRGFpbHkgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdibGFjaydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseVdoaXRlID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS53ZWF0aGVyLmRhaWx5LmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGtleSArIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgayA9IGtleSArIDIwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3MgPSBcImljb25cIiArIHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrayA9IFwiaWNvblwiICsgaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseS5hZGQoc3MsIHZhbHVlLmljb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseVdoaXRlLmFkZChraywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmRyYWdnaW5nLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5hZGRDb250cm9sKG5ldyBMLkNvbnRyb2wuRnVsbHNjcmVlbigpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiAnMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjknXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cHRJY29uVXJsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyc6ICdpbWcvaWNvbi1nby5zdmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0dlb2NhY2hlIEZvdW5kJzogJ2ltZy9ncHgvZ2VvY2FjaGUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQYXJrJzogJ2ltZy9ncHgvdHJlZS5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SWNvblVybDogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEljb25Vcmw6ICdpbWcvaWNvbi1zdG9wLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1VybDogJ2ltZy9waW4tc2hhZG93LnBuZydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmRpc3RhbmNlID0gZS50YXJnZXQuZ2V0X2Rpc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNaW4gPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21pbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZWxlTWF4ID0gZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9tYXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc2V0MDogZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9kYXRhKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllckZvckRldGFpbCgpO1xyXG4gICAgdmFyIGNvbnRyb2xzID0gIHtcclxuICAgICAgICAgICAgICAgICAgICBmdWxsc2NyZWVuOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wbGVmdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICB2bS5jb250cm9scyA9IGNvbnRyb2xzO1xyXG5cclxufSIsIi8qKlxyXG4gKiBAZGVzYyBTZXJ2aWNlcyB0aGF0IGNvbnZlcnRzIGdlb2pzb24gZmVhdHVyZXMgdG8gbWFya2VycyBmb3IgaGFuZGxpbmcgbGF0ZXJcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXJrZXJQYXJzZXIoJHEpIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGpzb25Ub01hcmtlckFycmF5OiBqc29uVG9NYXJrZXJBcnJheSxcclxuICAgICAgICB0b09iamVjdDogdG9PYmplY3RcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuXHRmdW5jdGlvbiBqc29uVG9NYXJrZXJBcnJheSh2YWwpIHtcclxuICAgICAgICB2YXIgZGVmZXJlZCA9ICRxLmRlZmVyKCk7IC8vIGRlZmVyZWQgb2JqZWN0IHJlc3VsdCBvZiBhc3luYyBvcGVyYXRpb25cclxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICAgIHZhciBtYXJrID0ge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXI6IFwicm90YWxhclwiLFxyXG4gICAgICAgICAgICAgICAgbGF0OiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDRjMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuYWx0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXN0YW5jZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW1tYXJ5XCIgOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjp2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG1hcmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvdXRwdXQpIHtcclxuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBkZWZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XHJcbiAgICAgICAgdmFyIHJ2ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgaWYgKGFycmF5W2ldICE9PSB1bmRlZmluZWQpIHJ2W2ldID0gYXJyYXlbaV07XHJcbiAgICAgICAgcmV0dXJuIHJ2OyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLm1hcmtlclBhcnNlcicsIFtdKVxyXG4uZmFjdG9yeSgnbWFya2VyUGFyc2VyJywgbWFya2VyUGFyc2VyKTsiLCJmdW5jdGlvbiB0cmFja1NlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgZW5kcG9pbnQgPSAnaHR0cDpsb2NhbGhvc3Q6ODA4MC8nXHJcblxyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VHJhY2s6IGdldFRyYWNrLFxyXG5cdFx0YWRkVHJhY2s6IGFkZFRyYWNrLFxyXG5cdFx0Z2V0VHJhY2tEZXRhaWw6Z2V0VHJhY2tEZXRhaWwsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2socGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzP2xhdE5FPScrIHBhcmFtcy5sYXRORSsnJmxuZ05FPScrcGFyYW1zLmxuZ05FICsnJmxhdFNXPScrcGFyYW1zLmxhdFNXICsnJmxuZ1NXPScrcGFyYW1zLmxuZ1NXLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFja0RldGFpbChpZCkge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nK2lkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRyYWNrKHRyYWNrKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcycsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF0YTogJC5wYXJhbSh7XHJcblx0XHRcdFx0XCJuYW1lXCI6IHRyYWNrLm5hbWUsXHJcblx0XHRcdFx0XCJkaXN0YW5jZVwiOiB0cmFjay5kaXN0YW5jZSxcclxuXHRcdFx0XHRcImFsdGl0dWRlXCI6IHRyYWNrLmFsdGl0dWRlLFxyXG5cdFx0XHRcdFwic3VtbWFyeVwiOiB0cmFjay5zdW1tYXJ5LFxyXG5cdFx0XHRcdFwiaW1nX3NyY1wiOiB0cmFjay5pbWdfc3JjLFxyXG5cdFx0XHRcdFwiY29vcmRpbmF0ZXNcIjogdHJhY2suY29vcmRpbmF0ZXMsXHJcblx0XHRcdFx0XCJvd25lZEJ5XCI6IHRyYWNrLm93bmVkQnksXHJcblx0XHRcdFx0XCJncHhcIjogdHJhY2suZ3B4LFxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLnRyYWNrU2VydmljZScsIFtdKVxyXG5cdC5mYWN0b3J5KCd0cmFja1NlcnZpY2UnLCB0cmFja1NlcnZpY2UpOyIsImZ1bmN0aW9uIHVzZXJTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRVc2VyOiBnZXRVc2VyLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgIFx0cmV0dXJuICRodHRwKHtcclxuICAgIFx0XHRtZXRob2Q6ICdHRVQnLFxyXG4gICAgXHRcdHVybDogJ2FwaS9wcm9maWxlJ1xyXG4gICAgXHR9KVxyXG4gICAgfTsgXHJcbn0gXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLnVzZXJTZXJ2aWNlJywgW10pXHJcbi5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBzZXJ2aWNlSWQgPSAnd2VhdGhlckFQSSc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC53ZWF0aGVyJywgW10pXHJcbiAgICAgICAgLmZhY3Rvcnkoc2VydmljZUlkLCBbJyRxJywgJyRodHRwJywgd2VhdGhlckFQSV0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdlYXRoZXJBUEkoJHEsICRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIHdlYXRoZXI6IHdlYXRoZXIsXHJcbiAgICAgICAgICAgIGZvcmVjYXN0OiBmb3JlY2FzdCxcclxuICAgICAgICAgICAgZGFya1NreVdlYXRoZXI6IGRhcmtTa3lXZWF0aGVyLFxyXG4gICAgICAgICAgICBhcHBpZDogJ2ZhMmQ1OTNhYTU4ZTkwZmRlMzI4NDI2ZTY0YTY0ZTM4J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHdlYXRoZXIobGF0LCBsbmcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PScgKyBsYXQgKyAnJmxvbj0nICsgbG5nICsgJyZhcHBpZD0nICsgc2VydmljZS5hcHBpZCArICcmdW5pdHM9bWV0cmljJmxhbmc9dHInXHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmNvZCA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRIb3VycyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRNaW51dGVzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGN1cnJlbnQgaG91ciB1c2luZyBvZmZzZXQgZnJvbSBVVEMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRldGltZSA9IG5ldyBEYXRlKChyZXMuZGF0YS5kdCAqIDEwMDApICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5yaXNlID0gbmV3IERhdGUocmVzLmRhdGEuc3lzLnN1bnJpc2UgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5zZXQgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3Vuc2V0ICogMTAwMCArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUN1cnJlbnQgPSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5kYXRldGltZSA9IGRhdGV0aW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA9IGRhdGFDdXJyZW50LmRhdGV0aW1lLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyID0gc3VucmlzZS5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5zdW5zZXRIb3VyID0gc3Vuc2V0LmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSG91ciBiZXR3ZWVuIHN1bnNldCBhbmQgc3VucmlzZSBiZWluZyBuaWdodCB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPj0gZGF0YUN1cnJlbnQuc3Vuc2V0SG91ciB8fCBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA8PSBkYXRhQ3VycmVudC5zdW5yaXNlSG91cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCB3ZWF0aGVyIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJEZXNjcmlwdGlvbiA9IHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXMuZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFuZ2Ugd2VhdGhlciBpY29uIGNsYXNzIGFjY29yZGluZyB0byB3ZWF0aGVyIGNvZGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtZm9nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWNsZWFyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS10aHVuZGVyc3Rvcm1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN0b3JtLXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNub3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW4tbWl4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzQxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN1bm55XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDczMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWR1c3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc21va2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzcxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1ODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zdHJvbmctd2luZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3ODE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXRvcm5hZG9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWh1cnJpY2FuZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbm93Zmxha2UtY29sZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1ob3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50OiBkYXRhQ3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9yZWNhc3QobGF0LCBsbmcpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkYXJrU2t5V2VhdGhlcihsYXQsIGxuZykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3dlYXRoZXIvJyArIGxhdCArICcvJyArIGxuZyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLk9wZXJhdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudGx5LnRpbWUgPSBuZXcgRGF0ZSgoZGF0YS5jdXJyZW50bHkudGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdGEuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGFpbHkuZGF0YVtrZXldLnRpbWUgPSAgbmV3IERhdGUoKHZhbHVlLnRpbWUgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCJmdW5jdGlvbiBtYXBDb25maWdTZXJ2aWNlKCkge1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgIGdldExheWVyOiBnZXRMYXllcixcclxuICAgICAgICBnZXRDZW50ZXI6IGdldENlbnRlcixcclxuICAgICAgICBnZXRMYXllckZvckRldGFpbDogZ2V0TGF5ZXJGb3JEZXRhaWwsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXIoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgTWFwYm94X1NhdGVsbGl0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdVeWR1JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc2F0ZWxsaXRlLXN0cmVldHMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X091dGRvb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L291dGRvb3JzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9MYW5zY2FwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfEsHpvaGlwcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL2xhbmRzY2FwZS97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBZYW5kZXg6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWWFuZGV4IFlvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3lhbmRleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllclR5cGU6ICdtYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvdmVybGF5czoge1xyXG4gICAgICAgICAgICAgICAgcm90YWxhcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgbGF0OiAzOS45MDMyOTE4LFxyXG4gICAgICAgICAgICBsbmc6IDMyLjYyMjMzOTYsXHJcbiAgICAgICAgICAgIHpvb206IDZcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllckZvckRldGFpbCgpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X1NhdGVsbGl0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdVeWR1JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc2F0ZWxsaXRlLXN0cmVldHMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X091dGRvb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L291dGRvb3JzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgWWFuZGV4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1lhbmRleCBZb2wnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd5YW5kZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICBsYXllck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJUeXBlOiAnbWFwJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm1hcCcsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ21hcENvbmZpZ1NlcnZpY2UnLCBtYXBDb25maWdTZXJ2aWNlKTsiLCJmdW5jdGlvbiBnZW9jb2RlKCRxKSB7XHJcbiAgcmV0dXJuIHsgXHJcbiAgICBnZW9jb2RlQWRkcmVzczogZnVuY3Rpb24oYWRkcmVzcykge1xyXG4gICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7ICdhZGRyZXNzJzogYWRkcmVzcyB9LCBmdW5jdGlvbiAocmVzdWx0cywgc3RhdHVzKSB7XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAvLyB3aW5kb3cuZmluZExvY2F0aW9uKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdnZW9jb2RlJywgZ2VvY29kZSk7IiwiZnVuY3Rpb24gcmV2ZXJzZUdlb2NvZGUoJHEsICRodHRwKSB7XHJcbiAgICB2YXIgb2JqID0ge307XHJcbiAgICBvYmouZ2VvY29kZUxhdGxuZyA9IGZ1bmN0aW9uIGdlb2NvZGVQb3NpdGlvbihsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoe1xyXG4gICAgICAgICAgICBsYXRMbmc6IGxhdGxuZ1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2VzICYmIHJlc3BvbnNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZXNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgncmV2ZXJzZUdlb2NvZGUnLCByZXZlcnNlR2VvY29kZSk7Il19
