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

RotalarDetailController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData','weatherAPI'];

function RotalarDetailController($scope, $stateParams, trackService, mapConfigService, leafletData,weatherAPI) {
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

            weatherAPI.weather(vm.trackDetail.geometry.coordinates[1],vm.trackDetail.geometry.coordinates[0]).then(function(res){
                console.log(res);
                vm.weather = res;

            })
            
            // console.log(vm.center);
            leafletData.getMap().then(function (map) {
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

                    // console.log(e.target.get_elevation_data())
                    vm.data = {
                        dataset0: e.target.get_elevation_data()
                    }

                    map.fitBounds(e.target.getBounds());
                });
                g.addTo(map);
            });

        })

    }


    vm.layers = mapConfigService.getLayer();


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
    }
})();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicHJvZmlsZS9wcm9maWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJyb3RhZWtsZS9yb3RhZWtsZS5qcyIsInJvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmpzIiwicm90YWxhci9yb3RhbGFyLmpzIiwicm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuanMiLCJtYXJrZXJwYXJzZXIuanMiLCJ0cmFjay5qcyIsInVzZXIuanMiLCJ3ZWF0aGVyQVBJLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8sT0FBTyxL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QyxTQUFTLFFBQVE7WUFDYixRQUFRO1dBQ1QsU0FBUyxXQUFXO1lBQ25CLElBQUksYUFBYSxVQUFVLFNBQVMsR0FBRztnQkFDbkMsT0FBTyxTQUFTLFFBQVEsVUFBVSxHQUFHO21CQUNsQztnQkFDSCxPQUFPLFNBQVMsUUFBUTs7V0FFN0IsVUFBVSxLQUFLO1lBQ2QsT0FBTyxTQUFTLFFBQVE7O1FBRTVCLE9BQU8sU0FBUzs7SUFFcEIsT0FBTzs7O0FBR1g7RUFDRSxPQUFPO0VBQ1AsUUFBUSxrQkFBa0IsZ0JBQWdCIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldC5zcGxpdChzZWFyY2gpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdlb2NvZGUtYXV0b2NvbXBsZXRlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICQodGhhdCkudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmVkaWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwczovL2dlb2NvZGUtbWFwcy55YW5kZXgucnUvMS54Lz9yZXN1bHRzPTUmYmJveD0yNC4xMjU5NzcsMzQuNDUyMjE4fjQ1LjEwOTg2Myw0Mi42MDE2MjAmZm9ybWF0PWpzb24mbGFuZz10cl9UUiZnZW9jb2RlPScgKyBxdWVyeSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm5hbWUgKyAnLCAnICsgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2xhdDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LlBvaW50LnBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEua2luZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdF90eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmJveDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmJvdW5kZWRCeS5FbnZlbG9wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGVzY3JpcHRpb24uaW5kZXhPZignVMO8cmtpeWUnKSA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHByZWRpY3Rpb25zICYmIHByZWRpY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVzdWx0cyA9ICQubWFwKHByZWRpY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnVuY3Rpb24gKHByZWRpY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZGVzdCA9IHByZWRpY3Rpb24ubmFtZSArIFwiLCBcIiArIHByZWRpY3Rpb24uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdCA9IGRlc3QucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2VzcyhwcmVkaWN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWZ0ZXJTZWxlY3Q6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9ICcvYS8nICsgaXRlbS5uYW1lICtcclxuICAgICAgICAgICAgICAgICAgICAnP2xhdFNXPScgKyBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVsxXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdTVz0nICsgaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbGF0TkU9JyArIGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzFdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ05FPScgKyBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSAnPHNwYW4gY2xhc3M9XCJpdGVtLWFkZHJlc3NcIj4nICsgaXRlbSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgIGZpdFRvRWxlbWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhhdCkub24oJ3R5cGVhaGVhZDpjaGFuZ2UnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGF0KS52YWwoaXRlbS5maW5kKCdhPnNwYW4uaXRlbS1hZGRyZXNzJykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG53aW5kb3cubW9iaWxlY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY2hlY2sgPSBmYWxzZTtcclxuICAgIChmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsIDQpKSkgY2hlY2sgPSB0cnVlO1xyXG4gICAgfSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XHJcbiAgICByZXR1cm4gY2hlY2s7XHJcbn07XHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICdhcHAubmF2YmFyJyxcclxuICAgICdhcHAubG9naW4nLFxyXG4gICAgJ2FwcC5yZWdpc3RlcicsXHJcbiAgICAnYXBwLmNhcmQnLCBcclxuICAgICdhcHAucHJvZmlsZScsXHJcbiAgICAnYXBwLnVzZXJTZXJ2aWNlJyxcclxuICAgICdhcHAudHJhY2tTZXJ2aWNlJyxcclxuICAgICdhcHAubWFya2VyUGFyc2VyJyxcclxuICAgICdhcHAubWFwJyxcclxuICAgICdhcHAuY29udGVudCcsICAgIFxyXG4gICAgJ2FwcC5yb3RhJyxcclxuICAgICdvYy5sYXp5TG9hZCcsXHJcbiAgICAndWkucm91dGVyJyxcclxuICAgICdsZWFmbGV0LWRpcmVjdGl2ZScsXHJcbiAgICAnYXBwLndlYXRoZXInLFxyXG4gIF0pXHJcbiAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywnJGxvY2F0aW9uUHJvdmlkZXInLCckbG9nUHJvdmlkZXInLCckb2NMYXp5TG9hZFByb3ZpZGVyJywnJGNvbXBpbGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRsb2dQcm92aWRlciwgJG9jTGF6eUxvYWRQcm92aWRlciwkY29tcGlsZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgJG9jTGF6eUxvYWRQcm92aWRlci5jb25maWcoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbiAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKGZhbHNlKTtcclxuICAgIC8vICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnLyMvJyk7XHJcbiAgICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xyXG5cclxuICAgIFxyXG5cclxuICAgIHZhciBsb2dpblN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAnbG9naW4nLFxyXG4gICAgICB1cmw6ICcvZ2lyaXMnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxsb2dpbi1kaXJlY3RpdmU+PC9sb2dpbi1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxvZ2luU3RhdGUpO1xyXG5cclxuICAgIHZhciByZWdpc3RlclN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncmVnaXN0ZXInLFxyXG4gICAgICB1cmw6ICcva2F5aXQnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxyZWdpc3Rlci1kaXJlY3RpdmU+PC9yZWdpc3Rlci1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJlZ2lzdGVyU3RhdGUpO1xyXG5cclxuICAgIHZhciBwcm9maWxlU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdwcm9maWxlJyxcclxuICAgICAgdXJsOiAnL3Byb2ZpbCcsXHJcbiAgICAgIHRlbXBsYXRlOiAnPHByb2ZpbGUtZGlyZWN0aXZlPjwvcHJvZmlsZS1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHByb2ZpbGVTdGF0ZSk7XHJcbiAgfV0pXHJcbiAgLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIHJldHVybiBnZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbmQuZGF0YS5PcGVyYXRpb25SZXN1bHQpIFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXNwb25kLmRhdGEudXNlcjtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mbGFnTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgfSkoKTsgXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29udGVudCcsIFsnYXBwLmhlYWRlcicsICdhcHAuZm9vdGVyJywndWkucm91dGVyJ10pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0U3RhdGUnLCBcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2xhbmRpbmcvbGFuZGluZy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmYXVsdFN0YXRlKTtcclxuICAgIH0pXHJcbiAgXHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YScsIFsnYXBwLnJvdGFsYXInLCAnYXBwLnJvdGFsYXJEZXRhaWwnLCAnYXBwLnJvdGFla2xlJywgJ3VpLnJvdXRlciddKVxyXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgICAgICB2YXIgcm90YWxhclN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2Eve3Rlcm19P2xhdFNXJmxuZ1NXJmxhdE5FJmxuZ05FJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxyb3RhbGFyPjwvcm90YWxhcj4nLFxyXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJEZXRhaWxTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyRGV0YWlsJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhLzppZCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhci1kZXRhaWw+PC9yb3RhbGFyLWRldGFpbD4nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJvdGFsYXJEZXRhaWxTdGF0ZSk7XHJcbiBcclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2snLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGFla2xlJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlL3JvdGFla2xlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3JvdGFFa2xlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdyb3RhRWtsZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTG9jYXRpb25TdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5sb2NhdGlvbicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva29udW0nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uaHRtbCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tMb2NhdGlvblN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja01ldGFTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5tZXRhJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iaWxnaScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5tZXRhL3JvdGFla2xlLm1ldGEuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja01ldGFTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tJbWFnZVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmltYWdlJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXNpbWxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5pbWFnZS9yb3RhZWtsZS5pbWFnZS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrSW1hZ2VTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tHUFhTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5ncHgnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2dweCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5ncHgvcm90YWVrbGUuZ3B4Lmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tHUFhTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tGaW5pc2hTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5maW5pc2gnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2theWRldCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5maW5pc2gvcm90YWVrbGUuZmluaXNoLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tGaW5pc2hTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZm9vdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdmb290ZXJEaXJlY3RpdmUnLCBmb290ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gZm9vdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgfTtcclxuICBcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxufSkoKTsgXHJcbiBcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuaGVhZGVyJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnaGVhZGxpbmVEaXJlY3RpdmUnLCBoZWFkbGluZURpcmVjdGl2ZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaGVhZGxpbmVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2hlYWRsaW5lL2hlYWRsaW5lLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEhlYWRsaW5lQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuICAgIH1cclxuXHJcbiAgICBIZWFkbGluZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICckaW50ZXJ2YWwnLCAnJHEnLCckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGxpbmVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkaW50ZXJ2YWwsICRxLCR3aW5kb3cpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiAgICAgICAgdm0uc2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3JvdGFsYXInLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtOiB2bS5lbG1hXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiI0F1dG9jb21wbGV0ZVwiKS5mb2N1cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNBdXRvY29tcGxldGVcIikub2Zmc2V0KCkudG9wIC0gODBcclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gd2luZG93LnNjcm9sbFggPSAwO1xyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuXHJcblxyXG4gICAgICAgICRpbnRlcnZhbChjaGFuZ2VCZywgNjUwMCk7XHJcblxyXG4gICAgICAgIHZhciBpID0gMTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlQmcoKSB7XHJcbiAgICAgICAgICAgIGlmIChpID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAvL3Jlc3RhcnRcclxuICAgICAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgLy8gdmFyIGltZ1VybCA9IFwidXJsKCcuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnJylcIjtcclxuICAgICAgICAgICAgdmFyIGltZ1VybCA9IFwiLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZ1wiO1xyXG5cclxuICAgICAgICAgICAgcHJlbG9hZChpbWdVcmwpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KFwiLmhlYWRsaW5lXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidXJsKFwiKyBpbWdVcmwgK1wiKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmVsb2FkKHVybCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltYWdlLmNvbXBsZXRlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4qIEBkZXNjIGNhcmQgY29tcG9uZW50IFxyXG4qIEBleGFtcGxlIDxjYXJkPjwvY2FyZD5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNhcmQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2NhcmREaXJlY3RpdmUnLCBjYXJkRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vY2FyZC9jYXJkLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnPCcsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6ICc8JyxcclxuICAgICAgICAgICAgb3duZXI6JzwnLFxyXG4gICAgICAgICAgICBpbWdTcmM6JzwnLFxyXG4gICAgICAgICAgICBpZDogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQ2FyZENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7IFxyXG4gICAgLy8gdm0uaW1nU3JjID0gdm0uaW1nU3JjLnNwbGl0KCdjbGllbnQnKVsxXTtcclxufSBcclxuIiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsb2dpbkRpcmVjdGl2ZScsIGxvZ2luRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGxvZ2luRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogRm9vdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4gKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiAqIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5uYXZiYXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ25hdmJhckRpcmVjdGl2ZScsIG5hdmJhckRpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL25hdmJhci9uYXZiYXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IG5hdmJhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmF2YmFyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTsgXHJcblxyXG4gICAgdm0ub3Blbk5hdiA9IG9wZW5OYXY7XHJcbiAgICB2bS5jbG9zZU5hdiA9IGNsb3NlTmF2O1xyXG5cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5OYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZU5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCAgPSBcIjAlXCI7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdwcm9maWxlRGlyZWN0aXZlJywgcHJvZmlsZURpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9wcm9maWxlL3Byb2ZpbGUuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogcHJvZmlsZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG5wcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3VzZXJTZXJ2aWNlJywgJ3RyYWNrU2VydmljZScsICdtYXJrZXJQYXJzZXInXTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVDb250cm9sbGVyKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlLHRyYWNrU2VydmljZSxtYXJrZXJQYXJzZXIpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgXHJcbiAgICB9XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucmVnaXN0ZXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyZWN0aXZlJywgcmVnaXN0ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gcmVnaXN0ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiByZWdpc3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhZWtsZScsIFsnYXBwLm1hcCcsJ2FwcC50cmFja1NlcnZpY2UnLCAnbmdGaWxlVXBsb2FkJywgJ2FuZ3VsYXItbGFkZGEnXSlcclxuICAgICAgICAuY29udHJvbGxlcigncm90YUVrbGVDb250cm9sbGVyJywgcm90YUVrbGVDb250cm9sbGVyKVxyXG5cclxuXHJcbiAgICByb3RhRWtsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnbWFwQ29uZmlnU2VydmljZScsICdyZXZlcnNlR2VvY29kZScsICd0cmFja1NlcnZpY2UnLCAnJHN0YXRlJywgJ1VwbG9hZCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGFFa2xlQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIG1hcENvbmZpZ1NlcnZpY2UsIHJldmVyc2VHZW9jb2RlLCB0cmFja1NlcnZpY2UsICRzdGF0ZSwgVXBsb2FkKSB7XHJcbiAgICAgICAgLy8gJG9jTGF6eUxvYWQubG9hZCgnLi4vLi4vc2VydmljZXMvbWFwL21hcC5hdXRvY29tcGxldGUuanMnKTtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICB2bS5vd25lZEJ5ID0gJHJvb3RTY29wZS51c2VyLl9pZDtcclxuICAgICAgICB2bS5pbWdfc3JjID0gXCJzcmNcIjtcclxuICAgICAgICB2bS5zdW1tYXJ5O1xyXG4gICAgICAgIHZtLmFsdGl0dWRlO1xyXG4gICAgICAgIHZtLmRpc3RhbmNlO1xyXG4gICAgICAgIHZtLm5hbWUgPSAnJztcclxuICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtdO1xyXG4gICAgICAgIHZtLnVwbG9hZEdQWCA9IHVwbG9hZEdQWDtcclxuICAgICAgICB2bS51cGxvYWRQaWMgPSB1cGxvYWRQaWM7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUubG9naW5Mb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdm0uYWRkVHJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRyYWNrU2VydmljZS5hZGRUcmFjayh2bSkudGhlbihmdW5jdGlvbiAoYWRkVHJhY2tSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdyb3RhbGFyJyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChhZGRUcmFja0Vycm9yKSB7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkUGljKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvcGhvdG9zLycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmltZ19zcmMgPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5ncHgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEdQWChmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL2dweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdweCA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmZpbmlzaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHtcclxuICAgICAgICAgICAgbWFya2Vyczoge1xyXG4gICAgICAgICAgICAgICAgbWFpbk1hcmtlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdDogdm0uY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2bS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJhxZ9rYSBiaXIgbm9rdGF5YSB0xLFrbGF5YXJhayBrYXlkxLFyLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oXCJsZWFmbGV0RGlyZWN0aXZlTWFwLmNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgbGVhZkV2ZW50ID0gYXJncy5sZWFmbGV0RXZlbnQ7XHJcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlLmdlb2NvZGVMYXRsbmcobGVhZkV2ZW50LmxhdGxuZy5sYXQsIGxlYWZFdmVudC5sYXRsbmcubG5nKS50aGVuKGZ1bmN0aW9uIChnZW9jb2RlU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvY2F0aW9uID0gZ2VvY29kZVN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxhdCA9IGxlYWZFdmVudC5sYXRsbmcubGF0O1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxuZyA9IGxlYWZFdmVudC5sYXRsbmcubG5nO1xyXG4gICAgICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtsZWFmRXZlbnQubGF0bG5nLmxuZywgbGVhZkV2ZW50LmxhdGxuZy5sYXRdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIiLCJhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgcmV0dXJuIGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGxcclxufVxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhcicsIHJvdGFsYXIpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyL3JvdGFsYXIuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLFxyXG4gICAgbWFya2VyUGFyc2VyLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0TWFwRXZlbnRzLCBsZWFmbGV0RGF0YSwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICB2bS5nZXRUcmFjayA9IGdldFRyYWNrO1xyXG4gICAgdm0ubWFwQXV0b1JlZnJlc2ggPSB0cnVlO1xyXG4gICAgdm0ub3Blbk1hcCA9IG9wZW5NYXA7XHJcbiAgICB2bS5wYXJhbXMgPSB7fTtcclxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRORSkgfHwgXHJcbiAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdORSkgfHwgXHJcbiAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRTVykgfHwgXHJcbiAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdTVylcclxuICAgICkge1xyXG4gICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IDQ0LjI5MjtcclxuICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0MS4yNjQ7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gMzIuODA1O1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IDI3Ljc3MztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdm0ucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgICAgICBsYXRTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0U1cpLFxyXG4gICAgICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcbiAgICAkcm9vdFNjb3BlLnNlYXJjaExvY2F0aW9uID0gJHN0YXRlUGFyYW1zLnRlcm07XHJcblxyXG4gICAgLy8gaWYod2luZG93Lm1vYmlsZWNoZWNrICYmIHZtLm1hcEFjdGl2ZSl7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRyYWNrKCkge1xyXG4gICAgICAgIHJldHVybiB0cmFja1NlcnZpY2UuZ2V0VHJhY2sodm0ucGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrcy5kYXRhID0gcmVzcG9uZC5kYXRhO1xyXG4gICAgICAgICAgICBpZiAodm0udHJhY2tzLmRhdGEgPT0gW10pIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFya2VyUGFyc2VyLmpzb25Ub01hcmtlckFycmF5KHZtLnRyYWNrcy5kYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2VycyA9IG1hcmtlclBhcnNlci50b09iamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gTC5nZW9Kc29uKHZtLnRyYWNrcy5kYXRhKS5nZXRCb3VuZHMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2Vyc0VtcHR5ID0gYW5ndWxhci5lcXVhbHMoT2JqZWN0LmtleXModm0ubWFya2VycykubGVuZ3RoLCAwKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgdm0uY2hhbmdlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICAvLyB2YXIgc3dhcCA9IG1hcmtlci5pY29uO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uID0gbWFya2VyLmljb25fc3dhcDtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbl9zd2FwID0gc3dhcDtcclxuICAgICAgICAvLyBpZiAobWFya2VyLmZvY3VzKVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpLmxhdE5FID0gMjApO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwNGMwMCcsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcbiAgICBmb3IgKHZhciBrIGluIHZtLm1hcEV2ZW50cykge1xyXG4gICAgICAgIC8vICBjb25zb2xlLmxvZyh2bS5tYXBFdmVudHMpO1xyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci4nICsgdm0ubWFwRXZlbnRzW2tdO1xyXG4gICAgICAgICRzY29wZS4kb24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdmVyJykge1xyXG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW91dCcpIHtcclxuICAgICAgICAgICAgICAgIHZtLnJlbW92ZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXAubW92ZWVuZCcpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFzZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHZhciBtYXBFdmVudCA9ICdsZWFmbGV0RGlyZWN0aXZlTWFwLmRyYWdlbmQnO1xyXG5cclxuICAgICRzY29wZS4kb24obWFwRXZlbnQsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIC8vICBjb25zb2xlLmxvZyhhcmdzLmxlYWZsZXRPYmplY3QpO1xyXG4gICAgICAgIGlmICh2bS5tYXBBdXRvUmVmcmVzaCkge1xyXG4gICAgICAgICAgICBpZiAodm0ubWFya2VycyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdDtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sbmdORSA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZztcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sYXRTVyA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdDtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxuZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCgnLmRhdGEtdml6Jykud2lkdGgoKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgICAgICdsYXRORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG5nTkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdFNXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxuZ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YSc7XHJcblxyXG4gICAgZnVuY3Rpb24gb3Blbk1hcCgpIHtcclxuICAgICAgICB2bS5tYXBBY3RpdmUgPSAhdm0ubWFwQWN0aXZlO1xyXG4gICAgICAgICQoJy5kYXRhLXZpeicpLnRvZ2dsZUNsYXNzKCdtYXAtb3BlbicpO1xyXG4gICAgICAgICQoJy5tYXAtYXV0by1yZWZyZXNoJykudG9nZ2xlQ2xhc3MoJ3JlZnJlc2gtb3BlbicpO1xyXG4gICAgICAgICh2bS50b2dnbGVUaXRsZSA9PSAnIEhhcml0YScgPyB2bS50b2dnbGVUaXRsZSA9ICcgTGlzdGUnIDogdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YScpXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCQoJy5kYXRhLXZpeicpLndpZHRoKCkpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxufSIsImFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yb3RhbGFyRGV0YWlsJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyb3RhbGFyRGV0YWlsJywgcm90YWxhckRldGFpbClcclxuXHJcbmZ1bmN0aW9uIHJvdGFsYXJEZXRhaWwoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFsYXIuZGV0YWlsL3JvdGFsYXIuZGV0YWlsLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICBjb250cm9sbGVyOiBSb3RhbGFyRGV0YWlsQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5Sb3RhbGFyRGV0YWlsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXREYXRhJywnd2VhdGhlckFQSSddO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckRldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEsd2VhdGhlckFQSSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrRGV0YWlsID0ge307XHJcbiAgICB2bS5jZW50ZXIgPSB7fTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmM7XHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2bS5ncHhEYXRhID0ge307XHJcblxyXG4gICAgICAgICAgICB3ZWF0aGVyQVBJLndlYXRoZXIodm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB2bS53ZWF0aGVyID0gcmVzO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZtLmNlbnRlcik7XHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiAnMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjknXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cHRJY29uVXJsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyc6ICdpbWcvaWNvbi1nby5zdmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0dlb2NhY2hlIEZvdW5kJzogJ2ltZy9ncHgvZ2VvY2FjaGUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQYXJrJzogJ2ltZy9ncHgvdHJlZS5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SWNvblVybDogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEljb25Vcmw6ICdpbWcvaWNvbi1zdG9wLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1VybDogJ2ltZy9waW4tc2hhZG93LnBuZydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmRpc3RhbmNlID0gZS50YXJnZXQuZ2V0X2Rpc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNaW4gPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21pbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZWxlTWF4ID0gZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9tYXgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9kYXRhKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNldDA6IGUudGFyZ2V0LmdldF9lbGV2YXRpb25fZGF0YSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGUudGFyZ2V0LmdldEJvdW5kcygpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuXHJcblxyXG59IiwiLyoqXHJcbiAqIEBkZXNjIFNlcnZpY2VzIHRoYXQgY29udmVydHMgZ2VvanNvbiBmZWF0dXJlcyB0byBtYXJrZXJzIGZvciBoYW5kbGluZyBsYXRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hcmtlclBhcnNlcigkcSkge1xyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0anNvblRvTWFya2VyQXJyYXk6IGpzb25Ub01hcmtlckFycmF5LFxyXG4gICAgICAgIHRvT2JqZWN0OiB0b09iamVjdFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuXHJcblx0Ly8gY29udmVydCBmZWF0dXJlIGdlb2pzb24gdG8gYXJyYXkgb2YgbWFya2Vyc1xyXG5cdGZ1bmN0aW9uIGpzb25Ub01hcmtlckFycmF5KHZhbCkge1xyXG4gICAgICAgIHZhciBkZWZlcmVkID0gJHEuZGVmZXIoKTsgLy8gZGVmZXJlZCBvYmplY3QgcmVzdWx0IG9mIGFzeW5jIG9wZXJhdGlvblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICAgICAgdmFyIG1hcmsgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXllcjogXCJyb3RhbGFyXCIsXHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIGxuZzogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgIGljb246IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwNGMwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBpY29uX3N3YXAgOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdmFsW2ldLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFsdGl0dWRlXCIgOiB2YWxbaV0ucHJvcGVydGllcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCIgOiB2YWxbaV0ucHJvcGVydGllcy5kaXN0YW5jZSxcclxuICAgICAgICAgICAgICAgICAgICBcInN1bW1hcnlcIiA6IHZhbFtpXS5wcm9wZXJ0aWVzLnN1bW1hcnksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvd25lclwiOiB2YWxbaV0ucHJvcGVydGllcy5vd25lZEJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1nX3NyY1wiOnZhbFtpXS5wcm9wZXJ0aWVzLmltZ19zcmMsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2gobWFyayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG91dHB1dCkge1xyXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcclxuICAgICAgICB2YXIgcnYgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IHVuZGVmaW5lZCkgcnZbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICByZXR1cm4gcnY7ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAubWFya2VyUGFyc2VyJywgW10pXHJcbi5mYWN0b3J5KCdtYXJrZXJQYXJzZXInLCBtYXJrZXJQYXJzZXIpOyIsImZ1bmN0aW9uIHRyYWNrU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBlbmRwb2ludCA9ICdodHRwOmxvY2FsaG9zdDo4MDgwLydcclxuXHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRUcmFjazogZ2V0VHJhY2ssXHJcblx0XHRhZGRUcmFjazogYWRkVHJhY2ssXHJcblx0XHRnZXRUcmFja0RldGFpbDpnZXRUcmFja0RldGFpbCxcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFjayhwYXJhbXMpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3M/bGF0TkU9JysgcGFyYW1zLmxhdE5FKycmbG5nTkU9JytwYXJhbXMubG5nTkUgKycmbGF0U1c9JytwYXJhbXMubGF0U1cgKycmbG5nU1c9JytwYXJhbXMubG5nU1csXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH0sXHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrRGV0YWlsKGlkKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycraWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gYWRkVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXRhOiAkLnBhcmFtKHtcclxuXHRcdFx0XHRcIm5hbWVcIjogdHJhY2submFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFwiYWx0aXR1ZGVcIjogdHJhY2suYWx0aXR1ZGUsXHJcblx0XHRcdFx0XCJzdW1tYXJ5XCI6IHRyYWNrLnN1bW1hcnksXHJcblx0XHRcdFx0XCJpbWdfc3JjXCI6IHRyYWNrLmltZ19zcmMsXHJcblx0XHRcdFx0XCJjb29yZGluYXRlc1wiOiB0cmFjay5jb29yZGluYXRlcyxcclxuXHRcdFx0XHRcIm93bmVkQnlcIjogdHJhY2sub3duZWRCeSxcclxuXHRcdFx0XHRcImdweFwiOiB0cmFjay5ncHgsXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAudHJhY2tTZXJ2aWNlJywgW10pXHJcblx0LmZhY3RvcnkoJ3RyYWNrU2VydmljZScsIHRyYWNrU2VydmljZSk7IiwiZnVuY3Rpb24gdXNlclNlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFVzZXI6IGdldFVzZXIsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgXHRyZXR1cm4gJGh0dHAoe1xyXG4gICAgXHRcdG1ldGhvZDogJ0dFVCcsXHJcbiAgICBcdFx0dXJsOiAnYXBpL3Byb2ZpbGUnXHJcbiAgICBcdH0pXHJcbiAgICB9OyBcclxufSBcclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAudXNlclNlcnZpY2UnLCBbXSlcclxuLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgdXNlclNlcnZpY2UpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHNlcnZpY2VJZCA9ICd3ZWF0aGVyQVBJJztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLndlYXRoZXInLCBbXSlcclxuICAgICAgICAuZmFjdG9yeShzZXJ2aWNlSWQsIFsnJHEnLCAnJGh0dHAnLCB3ZWF0aGVyQVBJXSk7XHJcblxyXG4gICAgZnVuY3Rpb24gd2VhdGhlckFQSSgkcSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgd2VhdGhlcjogd2VhdGhlcixcclxuICAgICAgICAgICAgZm9yZWNhc3Q6IGZvcmVjYXN0LFxyXG4gICAgICAgICAgICBhcHBpZDogJ2ZhMmQ1OTNhYTU4ZTkwZmRlMzI4NDI2ZTY0YTY0ZTM4J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHdlYXRoZXIobGF0LCBsbmcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PScgKyBsYXQgKyAnJmxvbj0nICsgbG5nICsgJyZhcHBpZD0nICsgc2VydmljZS5hcHBpZCArICcmdW5pdHM9bWV0cmljJmxhbmc9dHInXHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmNvZCA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRIb3VycyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRNaW51dGVzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGN1cnJlbnQgaG91ciB1c2luZyBvZmZzZXQgZnJvbSBVVEMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRldGltZSA9IG5ldyBEYXRlKChyZXMuZGF0YS5kdCAqIDEwMDApICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5yaXNlID0gbmV3IERhdGUocmVzLmRhdGEuc3lzLnN1bnJpc2UgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5zZXQgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3Vuc2V0ICogMTAwMCArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUN1cnJlbnQgPSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5kYXRldGltZSA9IGRhdGV0aW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA9IGRhdGFDdXJyZW50LmRhdGV0aW1lLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyID0gc3VucmlzZS5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5zdW5zZXRIb3VyID0gc3Vuc2V0LmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSG91ciBiZXR3ZWVuIHN1bnNldCBhbmQgc3VucmlzZSBiZWluZyBuaWdodCB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPj0gZGF0YUN1cnJlbnQuc3Vuc2V0SG91ciB8fCBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA8PSBkYXRhQ3VycmVudC5zdW5yaXNlSG91cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCB3ZWF0aGVyIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJEZXNjcmlwdGlvbiA9IHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXMuZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFuZ2Ugd2VhdGhlciBpY29uIGNsYXNzIGFjY29yZGluZyB0byB3ZWF0aGVyIGNvZGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtZm9nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWNsZWFyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS10aHVuZGVyc3Rvcm1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN0b3JtLXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNub3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW4tbWl4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzQxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN1bm55XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDczMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWR1c3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc21va2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzcxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1ODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zdHJvbmctd2luZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3ODE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXRvcm5hZG9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWh1cnJpY2FuZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbm93Zmxha2UtY29sZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1ob3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50OiBkYXRhQ3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9yZWNhc3QobGF0LCBsbmcpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsImZ1bmN0aW9uIG1hcENvbmZpZ1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgZ2V0TGF5ZXI6IGdldExheWVyLFxyXG4gICAgICAgIGdldENlbnRlcjogZ2V0Q2VudGVyLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvdmVybGF5czoge1xyXG4gICAgICAgICAgICByb3RhbGFyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ3JvdXAnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ1JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxheWVycztcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q2VudGVyKCkge1xyXG4gICAgICAgIHZhciBjZW50ZXIgPSB7XHJcbiAgICAgICAgICAgIGxhdDogMzkuOTAzMjkxOCxcclxuICAgICAgICAgICAgbG5nOiAzMi42MjIzMzk2LFxyXG4gICAgICAgICAgICB6b29tOiA2XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubWFwJywgW10pXHJcbiAgICAuZmFjdG9yeSgnbWFwQ29uZmlnU2VydmljZScsIG1hcENvbmZpZ1NlcnZpY2UpOyIsImZ1bmN0aW9uIGdlb2NvZGUoJHEpIHtcclxuICByZXR1cm4geyBcclxuICAgIGdlb2NvZGVBZGRyZXNzOiBmdW5jdGlvbihhZGRyZXNzKSB7XHJcbiAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiBhZGRyZXNzIH0sIGZ1bmN0aW9uIChyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICAgIC8vIHdpbmRvdy5maW5kTG9jYXRpb24ocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ2dlb2NvZGUnLCBnZW9jb2RlKTsiLCJmdW5jdGlvbiByZXZlcnNlR2VvY29kZSgkcSwgJGh0dHApIHtcclxuICAgIHZhciBvYmogPSB7fTtcclxuICAgIG9iai5nZW9jb2RlTGF0bG5nID0gZnVuY3Rpb24gZ2VvY29kZVBvc2l0aW9uKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICB2YXIgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGxhdExuZzogbGF0bG5nXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZXMgJiYgcmVzcG9uc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlc1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdyZXZlcnNlR2VvY29kZScsIHJldmVyc2VHZW9jb2RlKTsiXX0=
