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

    HeadlineController.$inject = ['$scope', '$state', '$interval', '$q'];

    function HeadlineController($scope, $state, $interval, $q) {
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

LayoutController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'trackService',
    'markerParser', 'mapConfigService', 'leafletMapEvents', 'leafletData', '$location', '$window'
];

function LayoutController($scope, $rootScope, $state, $stateParams, trackService,
    markerParser, mapConfigService, leafletMapEvents, leafletData, $location, $window) {
    var vm = this;
    vm.tracks = {};
    vm.getTrack = getTrack;
    vm.mapAutoRefresh = true;
    vm.openMap = openMap;
    vm.params = {
        latNE: parseFloat($stateParams.latNE), 
        lngNE: parseFloat($stateParams.lngNE),
        latSW: parseFloat($stateParams.latSW),
        lngSW: parseFloat($stateParams.lngSW),
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
                vm.markersEmpty = angular.equals(Object.keys(vm.markers).length,0);
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
                // vm.params.latNE = args.leafletObject.getBounds()._northEast.lat;
                // vm.params.lngNE = args.leafletObject.getBounds()._northEast.lng;
                // vm.params.latSW = args.leafletObject.getBounds()._southWest.lat;
                // vm.params.lngSW = args.leafletObject.getBounds()._southWest.lng;
                vm.params.latNE = 50.429517947;
                vm.params.lngNE = 49.790039062;
                vm.params.latSW = 24.126701958;
                vm.params.lngSW = 19.775390625;
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


    })
    $scope.$on('$routeUpdate', function () {
        alert(1)
    });

    vm.toggleTitle = ' Harita';
    function openMap() {
        vm.mapActive = !vm.mapActive;
        $('.data-viz').toggleClass('map-open');
        $('.map-auto-refresh').toggleClass('refresh-open');
        (vm.toggleTitle == ' Harita' ? vm.toggleTitle = ' Liste' : vm.toggleTitle = ' Harita' )
        
        console.log($('.data-viz').width());
        leafletData.getMap().then(function (map) {
            map.invalidateSize();
        });
    }



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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJyb3RhZWtsZS9yb3RhZWtsZS5qcyIsImxheW91dC5kZXRhaWwvbGF5b3V0LmRldGFpbC5qcyIsImxheW91dC9sYXlvdXQuanMiLCJyb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIm1hcC9tYXAuYXV0b2NvbXBsZXRlLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8s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LFFBQVEsRUFBRSxXQUFXLFdBQVcsVUFBVSxTQUFTLFFBQVE7UUFDbEUsSUFBSSxVQUFVLE9BQU8sS0FBSyxlQUFlLElBQUk7VUFDM0MsT0FBTyxTQUFTLFFBQVEsUUFBUSxHQUFHLFNBQVM7OztRQUc5QyxPQUFPLFNBQVM7O01BRWxCLE9BQU8sU0FBUzs7Ozs7QUFLdEI7RUFDRSxPQUFPO0VBQ1AsUUFBUSxXQUFXLFNBQVM7O3lDQ25COUIsU0FBUyxlQUFlLElBQUksT0FBTztJQUMvQixJQUFJLE1BQU07SUFDVixJQUFJLGdCQUFnQixTQUFTLGdCQUFnQixLQUFLLEtBQUs7UUFDbkQsSUFBSSxXQUFXLElBQUksT0FBTyxLQUFLO1FBQy9CLElBQUksV0FBVyxHQUFHO1FBQ2xCLElBQUksU0FBUyxJQUFJLE9BQU8sS0FBSyxPQUFPLEtBQUs7UUFDekMsU0FBUyxRQUFRO1lBQ2IsUUFBUTtXQUNULFNBQVMsV0FBVztZQUNuQixJQUFJLGFBQWEsVUFBVSxTQUFTLEdBQUc7Z0JBQ25DLE9BQU8sU0FBUyxRQUFRLFVBQVUsR0FBRzttQkFDbEM7Z0JBQ0gsT0FBTyxTQUFTLFFBQVE7O1dBRTdCLFVBQVUsS0FBSztZQUNkLE9BQU8sU0FBUyxRQUFROztRQUU1QixPQUFPLFNBQVM7O0lBRXBCLE9BQU87OztBQUdYO0VBQ0UsT0FBTztFQUNQLFFBQVEsa0JBQWtCLGdCQUFnQiIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24gKHNlYXJjaCwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiB0YXJnZXQuc3BsaXQoc2VhcmNoKS5qb2luKHJlcGxhY2VtZW50KTtcclxufTtcclxuXHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5nZW9jb2RlLWF1dG9jb21wbGV0ZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAkKHRoYXQpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24gKHF1ZXJ5LCBwcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJlZGljdGlvbnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICQuZ2V0SlNPTignaHR0cHM6Ly9nZW9jb2RlLW1hcHMueWFuZGV4LnJ1LzEueC8/cmVzdWx0cz01JmJib3g9MjQuMTI1OTc3LDM0LjQ1MjIxOH40NS4xMDk4NjMsNDIuNjAxNjIwJmZvcm1hdD1qc29uJmxhbmc9dHJfVFImZ2VvY29kZT0nICsgcXVlcnksIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5uYW1lICsgJywgJyArIGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbi5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdsYXQ6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5Qb2ludC5wb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLmtpbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRfdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJib3g6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5ib3VuZGVkQnkuRW52ZWxvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRlc2NyaXB0aW9uLmluZGV4T2YoJ1TDvHJraXllJykgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChwcmVkaWN0aW9ucyAmJiBwcmVkaWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHJlc3VsdHMgPSAkLm1hcChwcmVkaWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZ1bmN0aW9uIChwcmVkaWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGRlc3QgPSBwcmVkaWN0aW9uLm5hbWUgKyBcIiwgXCIgKyBwcmVkaWN0aW9uLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRlc3QgPSBkZXN0LnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MocHJlZGljdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFmdGVyU2VsZWN0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSAnL2EvJyArIGl0ZW0ubmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJz9sYXRTVz0nICsgaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nU1c9JyArIGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzBdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxhdE5FPScgKyBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVsxXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdORT0nICsgaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpdGVtID0gJzxzcGFuIGNsYXNzPVwiaXRlbS1hZGRyZXNzXCI+JyArIGl0ZW0gKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICBmaXRUb0VsZW1lbnQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoYXQpLm9uKCd0eXBlYWhlYWQ6Y2hhbmdlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICQodGhhdCkudmFsKGl0ZW0uZmluZCgnYT5zcGFuLml0ZW0tYWRkcmVzcycpLnRleHQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxud2luZG93Lm1vYmlsZWNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoZWNrID0gZmFsc2U7XHJcbiAgICAoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLCA0KSkpIGNoZWNrID0gdHJ1ZTtcclxuICAgIH0pKG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmEpO1xyXG4gICAgcmV0dXJuIGNoZWNrO1xyXG59O1xyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXHJcbiAgICAnYXBwLm5hdmJhcicsXHJcbiAgICAnYXBwLmxvZ2luJyxcclxuICAgICdhcHAucmVnaXN0ZXInLFxyXG4gICAgJ2FwcC5jYXJkJywgXHJcbiAgICAnYXBwLnByb2ZpbGUnLFxyXG4gICAgJ2FwcC51c2VyU2VydmljZScsXHJcbiAgICAnYXBwLnRyYWNrU2VydmljZScsXHJcbiAgICAnYXBwLm1hcmtlclBhcnNlcicsXHJcbiAgICAnYXBwLm1hcCcsXHJcbiAgICAnYXBwLmNvbnRlbnQnLCAgICBcclxuICAgICdhcHAucm90YScsXHJcbiAgICAnb2MubGF6eUxvYWQnLFxyXG4gICAgJ3VpLnJvdXRlcicsXHJcbiAgICAnbGVhZmxldC1kaXJlY3RpdmUnLFxyXG4gICAgJ25nQXV0b2NvbXBsZXRlJ1xyXG4gIF0pXHJcbiAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywnJGxvY2F0aW9uUHJvdmlkZXInLCckbG9nUHJvdmlkZXInLCckb2NMYXp5TG9hZFByb3ZpZGVyJywnJGNvbXBpbGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRsb2dQcm92aWRlciwgJG9jTGF6eUxvYWRQcm92aWRlciwkY29tcGlsZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgJG9jTGF6eUxvYWRQcm92aWRlci5jb25maWcoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbiAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKGZhbHNlKTtcclxuICAgIC8vICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnLyMvJyk7XHJcbiAgICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xyXG5cclxuICAgIFxyXG5cclxuICAgIHZhciBsb2dpblN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAnbG9naW4nLFxyXG4gICAgICB1cmw6ICcvZ2lyaXMnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxsb2dpbi1kaXJlY3RpdmU+PC9sb2dpbi1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxvZ2luU3RhdGUpO1xyXG5cclxuICAgIHZhciByZWdpc3RlclN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncmVnaXN0ZXInLFxyXG4gICAgICB1cmw6ICcva2F5aXQnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxyZWdpc3Rlci1kaXJlY3RpdmU+PC9yZWdpc3Rlci1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJlZ2lzdGVyU3RhdGUpO1xyXG5cclxuICAgIHZhciBwcm9maWxlU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdwcm9maWxlJyxcclxuICAgICAgdXJsOiAnL3Byb2ZpbCcsXHJcbiAgICAgIHRlbXBsYXRlOiAnPHByb2ZpbGUtZGlyZWN0aXZlPjwvcHJvZmlsZS1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHByb2ZpbGVTdGF0ZSk7XHJcbiAgfV0pXHJcbiAgLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIHJldHVybiBnZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbmQuZGF0YS5PcGVyYXRpb25SZXN1bHQpIFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXNwb25kLmRhdGEudXNlcjtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mbGFnTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgfSkoKTsgXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29udGVudCcsIFsnYXBwLmhlYWRlcicsICdhcHAuZm9vdGVyJywndWkucm91dGVyJ10pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0U3RhdGUnLCBcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2xhbmRpbmcvbGFuZGluZy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmYXVsdFN0YXRlKTtcclxuICAgIH0pXHJcbiAgXHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YScsIFsnYXBwLmxheW91dCcsICdhcHAubGF5b3V0RGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIGxheW91dFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2xheW91dCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYS97dGVybX0/bGF0U1cmbG5nU1cmbGF0TkUmbG5nTkUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PGxheW91dC1kaXJlY3RpdmU+PC9sYXlvdXQtZGlyZWN0aXZlPicsXHJcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxheW91dFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXlvdXREZXRhaWxTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdsYXlvdXREZXRhaWwnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGEvOmlkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxsYXlvdXQtZGV0YWlsLWRpcmVjdGl2ZT48L2xheW91dC1kZXRhaWwtZGlyZWN0aXZlPidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobGF5b3V0RGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrSW1hZ2VTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5pbWFnZScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVzaW1sZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuaW1hZ2Uvcm90YWVrbGUuaW1hZ2UuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ltYWdlU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrR1BYU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZ3B4JyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9ncHgnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZ3B4L3JvdGFla2xlLmdweC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrR1BYU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrRmluaXNoU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZmluaXNoJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rYXlkZXQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZmluaXNoL3JvdGFla2xlLmZpbmlzaC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrRmluaXNoU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZvb3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnZm9vdGVyRGlyZWN0aXZlJywgZm9vdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGZvb3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcbn0pKCk7IFxyXG4gXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmhlYWRlcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2hlYWRsaW5lRGlyZWN0aXZlJywgaGVhZGxpbmVEaXJlY3RpdmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlYWRsaW5lRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9oZWFkbGluZS9oZWFkbGluZS5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBIZWFkbGluZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgSGVhZGxpbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGludGVydmFsJywgJyRxJ107XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGxpbmVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkaW50ZXJ2YWwsICRxKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHZtLnNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtOiB2bS5lbG1hXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiI0F1dG9jb21wbGV0ZVwiKS5mb2N1cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNBdXRvY29tcGxldGVcIikub2Zmc2V0KCkudG9wIC0gODBcclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICAkaW50ZXJ2YWwoY2hhbmdlQmcsIDY1MDApO1xyXG5cclxuICAgICAgICB2YXIgaSA9IDE7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZUJnKCkge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgLy9yZXN0YXJ0XHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIC8vIHZhciBpbWdVcmwgPSBcInVybCgnLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZycpXCI7XHJcbiAgICAgICAgICAgIHZhciBpbWdVcmwgPSBcIi4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGdcIjtcclxuXHJcbiAgICAgICAgICAgIHByZWxvYWQoaW1nVXJsKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIi5oZWFkbGluZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInVybChcIisgaW1nVXJsICtcIilcIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlbG9hZCh1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHVybDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWFnZS5jb21wbGV0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuKiBAZGVzYyBjYXJkIGNvbXBvbmVudCBcclxuKiBAZXhhbXBsZSA8Y2FyZD48L2NhcmQ+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jYXJkJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdjYXJkRGlyZWN0aXZlJywgY2FyZERpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBjYXJkRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29tbW9uL2NhcmQvY2FyZC5odG1sJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICB0aXRsZTogJzwnLFxyXG4gICAgICAgICAgICBzdW1tYXJ5OiAnPCcsXHJcbiAgICAgICAgICAgIG93bmVyOic8JyxcclxuICAgICAgICAgICAgaW1nU3JjOic8JyxcclxuICAgICAgICAgICAgaWQ6ICc8JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IENhcmRDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2FyZENvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzOyBcclxuICAgIC8vIHZtLmltZ1NyYyA9IHZtLmltZ1NyYy5zcGxpdCgnY2xpZW50JylbMV07XHJcbn0gXHJcbiIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sb2dpbicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbG9naW5EaXJlY3RpdmUnLCBsb2dpbkRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBsb2dpbkRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbG9naW4vbG9naW4uaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IEZvb3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncHJvZmlsZURpcmVjdGl2ZScsIHByb2ZpbGVEaXJlY3RpdmUpO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZURpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvcHJvZmlsZS9wcm9maWxlLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IHByb2ZpbGVDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblxyXG5cclxucHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICd1c2VyU2VydmljZScsICd0cmFja1NlcnZpY2UnLCAnbWFya2VyUGFyc2VyJ107XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlQ29udHJvbGxlcigkcm9vdFNjb3BlLCB1c2VyU2VydmljZSx0cmFja1NlcnZpY2UsbWFya2VyUGFyc2VyKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gIFxyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuICogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4gKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm5hdmJhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbmF2YmFyRGlyZWN0aXZlJywgbmF2YmFyRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIG5hdmJhckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbmF2YmFyL25hdmJhci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogbmF2YmFyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpOyBcclxuXHJcbiAgICB2bS5vcGVuTmF2ID0gb3Blbk5hdjtcclxuICAgIHZtLmNsb3NlTmF2ID0gY2xvc2VOYXY7XHJcblxyXG5cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gb3Blbk5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ICA9IFwiMCVcIjtcclxuICAgIH1cclxuXHJcblxyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJlZ2lzdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcmVjdGl2ZScsIHJlZ2lzdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9yZWdpc3Rlci9yZWdpc3Rlci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogcmVnaXN0ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YWVrbGUnLCBbJ2FwcC5tYXAnLCAnbmdBdXRvY29tcGxldGUnLCAnYXBwLnRyYWNrU2VydmljZScsICduZ0ZpbGVVcGxvYWQnLCAnYW5ndWxhci1sYWRkYSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdyb3RhRWtsZUNvbnRyb2xsZXInLCByb3RhRWtsZUNvbnRyb2xsZXIpXHJcblxyXG5cclxuICAgIHJvdGFFa2xlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ3JldmVyc2VHZW9jb2RlJywgJ3RyYWNrU2VydmljZScsICckc3RhdGUnLCAnVXBsb2FkJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YUVrbGVDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgbWFwQ29uZmlnU2VydmljZSwgcmV2ZXJzZUdlb2NvZGUsIHRyYWNrU2VydmljZSwgJHN0YXRlLCBVcGxvYWQpIHtcclxuICAgICAgICAvLyAkb2NMYXp5TG9hZC5sb2FkKCcuLi8uLi9zZXJ2aWNlcy9tYXAvbWFwLmF1dG9jb21wbGV0ZS5qcycpO1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgdm0ubG9jYXRpb247XHJcblxyXG4gICAgICAgIC8vVHJhY2sgcGFyYW1ldGVyc1xyXG4gICAgICAgIHZtLm93bmVkQnkgPSAkcm9vdFNjb3BlLnVzZXIuX2lkO1xyXG4gICAgICAgIHZtLmltZ19zcmMgPSBcInNyY1wiO1xyXG4gICAgICAgIHZtLnN1bW1hcnk7XHJcbiAgICAgICAgdm0uYWx0aXR1ZGU7XHJcbiAgICAgICAgdm0uZGlzdGFuY2U7XHJcbiAgICAgICAgdm0ubmFtZSA9ICcnO1xyXG4gICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW107XHJcbiAgICAgICAgdm0udXBsb2FkR1BYID0gdXBsb2FkR1BYO1xyXG4gICAgICAgIHZtLnVwbG9hZFBpYyA9IHVwbG9hZFBpYztcclxuXHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB2bS5hZGRUcmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdHJhY2tTZXJ2aWNlLmFkZFRyYWNrKHZtKS50aGVuKGZ1bmN0aW9uIChhZGRUcmFja1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dCcpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoYWRkVHJhY2tFcnJvcikge1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZFBpYyhmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3Bob3Rvcy8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWdfc3JjID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRHUFgoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9ncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncHggPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5maW5pc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgYW5ndWxhci5leHRlbmQoJHNjb3BlLCB7XHJcbiAgICAgICAgICAgIG1hcmtlcnM6IHtcclxuICAgICAgICAgICAgICAgIG1haW5NYXJrZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYXQ6IHZtLmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxuZzogdm0uY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCYcWfa2EgYmlyIG5va3RheWEgdMSxa2xheWFyYWsga2F5ZMSxci5cIixcclxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKFwibGVhZmxldERpcmVjdGl2ZU1hcC5jbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGxlYWZFdmVudCA9IGFyZ3MubGVhZmxldEV2ZW50O1xyXG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZS5nZW9jb2RlTGF0bG5nKGxlYWZFdmVudC5sYXRsbmcubGF0LCBsZWFmRXZlbnQubGF0bG5nLmxuZykudGhlbihmdW5jdGlvbiAoZ2VvY29kZVN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2NhdGlvbiA9IGdlb2NvZGVTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcmtlcnMubWFpbk1hcmtlci5sYXQgPSBsZWFmRXZlbnQubGF0bG5nLmxhdDtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcmtlcnMubWFpbk1hcmtlci5sbmcgPSBsZWFmRXZlbnQubGF0bG5nLmxuZztcclxuICAgICAgICAgICAgdm0uY29vcmRpbmF0ZXMgPSBbbGVhZkV2ZW50LmxhdGxuZy5sbmcsIGxlYWZFdmVudC5sYXRsbmcubGF0XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxheW91dERldGFpbCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbGF5b3V0RGV0YWlsRGlyZWN0aXZlJywgbGF5b3V0RGV0YWlsRGlyZWN0aXZlKVxyXG5cclxuZnVuY3Rpb24gbGF5b3V0RGV0YWlsRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9sYXlvdXQuZGV0YWlsL2xheW91dC5kZXRhaWwuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IExheW91dERldGFpbENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuTGF5b3V0RGV0YWlsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXREYXRhJ107XHJcblxyXG5mdW5jdGlvbiBMYXlvdXREZXRhaWxDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXREYXRhKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tEZXRhaWwgPSB7fTtcclxuICAgIHZtLmNlbnRlciA9IHt9O1xyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgdHJhY2tTZXJ2aWNlLmdldFRyYWNrRGV0YWlsKCRzdGF0ZVBhcmFtcy5pZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrRGV0YWlsID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuaW1nX3NyYyA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuaW1nX3NyYy5zcGxpdCgnY2xpZW50JylbMV0ucmVwbGFjZUFsbCgnXFxcXCcsICcvJylcclxuICAgICAgICAgICAgdm0uY2VudGVyID0ge1xyXG4gICAgICAgICAgICAgICAgbGF0OiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIGxuZzogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICB6b29tOiAxMlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZtLmNlbnRlcik7XHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgbmV3IEwuR1BYKGdweCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KS5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGUudGFyZ2V0LmdldEJvdW5kcygpKTtcclxuICAgICAgICAgICAgICAgIH0pLmFkZFRvKG1hcCk7ICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG5cclxuXHJcbn0iLCIvKipcclxuICogQGRlc2MgTWFpbiBsYXlvdXQgZm9yIGFwcGxpY2F0aW9uXHJcbiAqIEBleGFtcGxlIDxsYXlvdXQtZGlyZWN0aXZlPjwvbGF5b3V0LWRpcmVjdGl2ZT5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xheW91dERpcmVjdGl2ZScsIGxheW91dERpcmVjdGl2ZSlcclxuXHJcbmZ1bmN0aW9uIGxheW91dERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvbGF5b3V0L2xheW91dC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogTGF5b3V0Q29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5MYXlvdXRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gTGF5b3V0Q29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsXHJcbiAgICBtYXJrZXJQYXJzZXIsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXRNYXBFdmVudHMsIGxlYWZsZXREYXRhLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIHZtLmdldFRyYWNrID0gZ2V0VHJhY2s7XHJcbiAgICB2bS5tYXBBdXRvUmVmcmVzaCA9IHRydWU7XHJcbiAgICB2bS5vcGVuTWFwID0gb3Blbk1hcDtcclxuICAgIHZtLnBhcmFtcyA9IHtcclxuICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLCBcclxuICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgIGxhdFNXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRTVyksXHJcbiAgICAgICAgbG5nU1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxuZ1NXKSxcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG4gICAgJHJvb3RTY29wZS5zZWFyY2hMb2NhdGlvbiA9ICRzdGF0ZVBhcmFtcy50ZXJtO1xyXG5cclxuICAgIC8vIGlmKHdpbmRvdy5tb2JpbGVjaGVjayAmJiB2bS5tYXBBY3RpdmUpe1xyXG5cclxuICAgIC8vIH1cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIGlmICh2bS5wYXJhbXMubGF0TkUgJiYgdm0ucGFyYW1zLmxuZ05FICYmIHZtLnBhcmFtcy5sYXRTVyAmJiB2bS5wYXJhbXMubG5nU1cpIHtcclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0TkUsIHZtLnBhcmFtcy5sbmdORV0sXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRTVywgdm0ucGFyYW1zLmxuZ1NXXSxcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLmdldFRyYWNrKHZtLnBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgICB2bS50cmFja3MuZGF0YSA9IHJlc3BvbmQuZGF0YTtcclxuICAgICAgICAgICAgaWYgKHZtLnRyYWNrcy5kYXRhID09IFtdKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmtlclBhcnNlci5qc29uVG9NYXJrZXJBcnJheSh2bS50cmFja3MuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnMgPSBtYXJrZXJQYXJzZXIudG9PYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IEwuZ2VvSnNvbih2bS50cmFja3MuZGF0YSkuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnNFbXB0eSA9IGFuZ3VsYXIuZXF1YWxzKE9iamVjdC5rZXlzKHZtLm1hcmtlcnMpLmxlbmd0aCwwKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgdm0uY2hhbmdlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICAvLyB2YXIgc3dhcCA9IG1hcmtlci5pY29uO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uID0gbWFya2VyLmljb25fc3dhcDtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbl9zd2FwID0gc3dhcDtcclxuICAgICAgICAvLyBpZiAobWFya2VyLmZvY3VzKVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpLmxhdE5FID0gMjApO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwNGMwMCcsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcbiAgICBmb3IgKHZhciBrIGluIHZtLm1hcEV2ZW50cykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZtLm1hcEV2ZW50cyk7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLicgKyB2bS5tYXBFdmVudHNba107XHJcbiAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2VJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3V0Jykge1xyXG4gICAgICAgICAgICAgICAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcC5tb3ZlZW5kJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXNkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdmFyIG1hcEV2ZW50ID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAubW92ZWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudCwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYXJncy5sZWFmbGV0T2JqZWN0KTtcclxuICAgICAgICBpZiAodm0ubWFwQXV0b1JlZnJlc2gpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm1hcmtlcnMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubGF0TkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubG5nTkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubGF0U1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubG5nU1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0TkUgPSA1MC40Mjk1MTc5NDc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0OS43OTAwMzkwNjI7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSAyNC4xMjY3MDE5NTg7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nU1cgPSAxOS43NzUzOTA2MjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJy5kYXRhLXZpeicpLndpZHRoKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgICAgICAnbGF0TkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ05FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICdsYXRTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG5nU1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH0pXHJcbiAgICAkc2NvcGUuJG9uKCckcm91dGVVcGRhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWxlcnQoMSlcclxuICAgIH0pO1xyXG5cclxuICAgIHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnO1xyXG4gICAgZnVuY3Rpb24gb3Blbk1hcCgpIHtcclxuICAgICAgICB2bS5tYXBBY3RpdmUgPSAhdm0ubWFwQWN0aXZlO1xyXG4gICAgICAgICQoJy5kYXRhLXZpeicpLnRvZ2dsZUNsYXNzKCdtYXAtb3BlbicpO1xyXG4gICAgICAgICQoJy5tYXAtYXV0by1yZWZyZXNoJykudG9nZ2xlQ2xhc3MoJ3JlZnJlc2gtb3BlbicpO1xyXG4gICAgICAgICh2bS50b2dnbGVUaXRsZSA9PSAnIEhhcml0YScgPyB2bS50b2dnbGVUaXRsZSA9ICcgTGlzdGUnIDogdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YScgKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy5kYXRhLXZpeicpLndpZHRoKCkpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxufSIsIiIsIi8qKlxyXG4gKiBAZGVzYyBTZXJ2aWNlcyB0aGF0IGNvbnZlcnRzIGdlb2pzb24gZmVhdHVyZXMgdG8gbWFya2VycyBmb3IgaGFuZGxpbmcgbGF0ZXJcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXJrZXJQYXJzZXIoJHEpIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGpzb25Ub01hcmtlckFycmF5OiBqc29uVG9NYXJrZXJBcnJheSxcclxuICAgICAgICB0b09iamVjdDogdG9PYmplY3RcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuXHRmdW5jdGlvbiBqc29uVG9NYXJrZXJBcnJheSh2YWwpIHtcclxuICAgICAgICB2YXIgZGVmZXJlZCA9ICRxLmRlZmVyKCk7IC8vIGRlZmVyZWQgb2JqZWN0IHJlc3VsdCBvZiBhc3luYyBvcGVyYXRpb25cclxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICAgIHZhciBtYXJrID0ge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXI6IFwicm90YWxhclwiLFxyXG4gICAgICAgICAgICAgICAgbGF0OiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDRjMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuYWx0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXN0YW5jZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW1tYXJ5XCIgOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjp2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG1hcmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvdXRwdXQpIHtcclxuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBkZWZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XHJcbiAgICAgICAgdmFyIHJ2ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgaWYgKGFycmF5W2ldICE9PSB1bmRlZmluZWQpIHJ2W2ldID0gYXJyYXlbaV07XHJcbiAgICAgICAgcmV0dXJuIHJ2OyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLm1hcmtlclBhcnNlcicsIFtdKVxyXG4uZmFjdG9yeSgnbWFya2VyUGFyc2VyJywgbWFya2VyUGFyc2VyKTsiLCJmdW5jdGlvbiB0cmFja1NlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgZW5kcG9pbnQgPSAnaHR0cDpsb2NhbGhvc3Q6ODA4MC8nXHJcblxyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VHJhY2s6IGdldFRyYWNrLFxyXG5cdFx0YWRkVHJhY2s6IGFkZFRyYWNrLFxyXG5cdFx0Z2V0VHJhY2tEZXRhaWw6Z2V0VHJhY2tEZXRhaWwsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2socGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzP2xhdE5FPScrIHBhcmFtcy5sYXRORSsnJmxuZ05FPScrcGFyYW1zLmxuZ05FICsnJmxhdFNXPScrcGFyYW1zLmxhdFNXICsnJmxuZ1NXPScrcGFyYW1zLmxuZ1NXLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFja0RldGFpbChpZCkge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nK2lkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRyYWNrKHRyYWNrKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcycsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF0YTogJC5wYXJhbSh7XHJcblx0XHRcdFx0XCJuYW1lXCI6IHRyYWNrLm5hbWUsXHJcblx0XHRcdFx0XCJkaXN0YW5jZVwiOiB0cmFjay5kaXN0YW5jZSxcclxuXHRcdFx0XHRcImFsdGl0dWRlXCI6IHRyYWNrLmFsdGl0dWRlLFxyXG5cdFx0XHRcdFwic3VtbWFyeVwiOiB0cmFjay5zdW1tYXJ5LFxyXG5cdFx0XHRcdFwiaW1nX3NyY1wiOiB0cmFjay5pbWdfc3JjLFxyXG5cdFx0XHRcdFwiY29vcmRpbmF0ZXNcIjogdHJhY2suY29vcmRpbmF0ZXMsXHJcblx0XHRcdFx0XCJvd25lZEJ5XCI6IHRyYWNrLm93bmVkQnksXHJcblx0XHRcdFx0XCJncHhcIjogdHJhY2suZ3B4LFxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLnRyYWNrU2VydmljZScsIFtdKVxyXG5cdC5mYWN0b3J5KCd0cmFja1NlcnZpY2UnLCB0cmFja1NlcnZpY2UpOyIsImZ1bmN0aW9uIHVzZXJTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRVc2VyOiBnZXRVc2VyLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgIFx0cmV0dXJuICRodHRwKHtcclxuICAgIFx0XHRtZXRob2Q6ICdHRVQnLFxyXG4gICAgXHRcdHVybDogJ2FwaS9wcm9maWxlJ1xyXG4gICAgXHR9KVxyXG4gICAgfTsgXHJcbn0gXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLnVzZXJTZXJ2aWNlJywgW10pXHJcbi5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQSBkaXJlY3RpdmUgZm9yIGFkZGluZyBnb29nbGUgcGxhY2VzIGF1dG9jb21wbGV0ZSB0byBhIHRleHQgYm94XHJcbiAqIGdvb2dsZSBwbGFjZXMgYXV0b2NvbXBsZXRlIGluZm86IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3BsYWNlc1xyXG4gKlxyXG4gKiBTaW1wbGUgVXNhZ2U6XHJcbiAqXHJcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiLz5cclxuICpcclxuICogY3JlYXRlcyB0aGUgYXV0b2NvbXBsZXRlIHRleHQgYm94IGFuZCBnaXZlcyB5b3UgYWNjZXNzIHRvIHRoZSByZXN1bHRcclxuICpcclxuICogICArIGBuZy1hdXRvY29tcGxldGU9XCJyZXN1bHRcImA6IHNwZWNpZmllcyB0aGUgZGlyZWN0aXZlLCAkc2NvcGUucmVzdWx0IHdpbGwgaG9sZCB0aGUgdGV4dGJveCByZXN1bHRcclxuICpcclxuICpcclxuICogQWR2YW5jZWQgVXNhZ2U6XHJcbiAqXHJcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiIGRldGFpbHM9XCJkZXRhaWxzXCIgb3B0aW9ucz1cIm9wdGlvbnNcIi8+XHJcbiAqXHJcbiAqICAgKyBgbmctYXV0b2NvbXBsZXRlPVwicmVzdWx0XCJgOiBzcGVjaWZpZXMgdGhlIGRpcmVjdGl2ZSwgJHNjb3BlLnJlc3VsdCB3aWxsIGhvbGQgdGhlIHRleHRib3ggYXV0b2NvbXBsZXRlIHJlc3VsdFxyXG4gKlxyXG4gKiAgICsgYGRldGFpbHM9XCJkZXRhaWxzXCJgOiAkc2NvcGUuZGV0YWlscyB3aWxsIGhvbGQgdGhlIGF1dG9jb21wbGV0ZSdzIG1vcmUgZGV0YWlsZWQgcmVzdWx0OyBsYXRsbmcuIGFkZHJlc3MgY29tcG9uZW50cywgZXRjLlxyXG4gKlxyXG4gKiAgICsgYG9wdGlvbnM9XCJvcHRpb25zXCJgOiBvcHRpb25zIHByb3ZpZGVkIGJ5IHRoZSB1c2VyIHRoYXQgZmlsdGVyIHRoZSBhdXRvY29tcGxldGUgcmVzdWx0c1xyXG4gKlxyXG4gKiAgICAgICsgb3B0aW9ucyA9IHtcclxuICogICAgICAgICAgIHR5cGVzOiB0eXBlLCAgICAgICAgc3RyaW5nLCB2YWx1ZXMgY2FuIGJlICdnZW9jb2RlJywgJ2VzdGFibGlzaG1lbnQnLCAnKHJlZ2lvbnMpJywgb3IgJyhjaXRpZXMpJ1xyXG4gKiAgICAgICAgICAgYm91bmRzOiBib3VuZHMsICAgICBnb29nbGUgbWFwcyBMYXRMbmdCb3VuZHMgT2JqZWN0XHJcbiAqICAgICAgICAgICBjb3VudHJ5OiBjb3VudHJ5ICAgIHN0cmluZywgSVNPIDMxNjYtMSBBbHBoYS0yIGNvbXBhdGlibGUgY291bnRyeSBjb2RlLiBleGFtcGxlczsgJ2NhJywgJ3VzJywgJ2diJ1xyXG4gKiAgICAgICAgIH1cclxuICpcclxuICpcclxuICovXHJcblxyXG5hbmd1bGFyLm1vZHVsZSggXCJuZ0F1dG9jb21wbGV0ZVwiLCBbXSlcclxuICAuZGlyZWN0aXZlKCduZ0F1dG9jb21wbGV0ZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgZGV0YWlsczogJz0nLFxyXG4gICAgICAgIG5nQXV0b2NvbXBsZXRlOiAnPScsXHJcbiAgICAgICAgb3B0aW9uczogJz0nXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG1vZGVsKSB7XHJcblxyXG4gICAgICAgIC8vb3B0aW9ucyBmb3IgYXV0b2NvbXBsZXRlXHJcbiAgICAgICAgdmFyIG9wdHNcclxuXHJcbiAgICAgICAgLy9jb252ZXJ0IG9wdGlvbnMgcHJvdmlkZWQgdG8gb3B0c1xyXG4gICAgICAgIHZhciBpbml0T3B0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgb3B0cyA9IHt9XHJcbiAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy50eXBlcykge1xyXG4gICAgICAgICAgICAgIG9wdHMudHlwZXMgPSBbXVxyXG4gICAgICAgICAgICAgIG9wdHMudHlwZXMucHVzaChzY29wZS5vcHRpb25zLnR5cGVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zLmJvdW5kcykge1xyXG4gICAgICAgICAgICAgIG9wdHMuYm91bmRzID0gc2NvcGUub3B0aW9ucy5ib3VuZHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy5jb3VudHJ5KSB7XHJcbiAgICAgICAgICAgICAgb3B0cy5jb21wb25lbnRSZXN0cmljdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudHJ5OiBzY29wZS5vcHRpb25zLmNvdW50cnlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaW5pdE9wdHMoKVxyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgYXV0b2NvbXBsZXRlXHJcbiAgICAgICAgLy9yZWluaXRpYWxpemVzIG9uIGV2ZXJ5IGNoYW5nZSBvZiB0aGUgb3B0aW9ucyBwcm92aWRlZFxyXG4gICAgICAgIHZhciBuZXdBdXRvY29tcGxldGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNjb3BlLmdQbGFjZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGVsZW1lbnRbMF0sIG9wdHMpO1xyXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoc2NvcGUuZ1BsYWNlLCAncGxhY2VfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgICBpZiAoc2NvcGUuZGV0YWlscykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuZGV0YWlscyA9IHNjb3BlLmdQbGFjZS5nZXRQbGFjZSgpO1xyXG4vLyAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHNjb3BlLm5nQXV0b2NvbXBsZXRlID0gZWxlbWVudC52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdBdXRvY29tcGxldGUoKVxyXG5cclxuICAgICAgICAvL3dhdGNoIG9wdGlvbnMgcHJvdmlkZWQgdG8gZGlyZWN0aXZlXHJcbiAgICAgICAgc2NvcGUud2F0Y2hPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIHNjb3BlLm9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNjb3BlLiR3YXRjaChzY29wZS53YXRjaE9wdGlvbnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGluaXRPcHRzKClcclxuICAgICAgICAgIG5ld0F1dG9jb21wbGV0ZSgpXHJcbiAgICAgICAgICBlbGVtZW50WzBdLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICBzY29wZS5uZ0F1dG9jb21wbGV0ZSA9IGVsZW1lbnQudmFsKCk7XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSk7IiwiZnVuY3Rpb24gbWFwQ29uZmlnU2VydmljZSgpIHtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBnZXRMYXllcjogZ2V0TGF5ZXIsXHJcbiAgICAgICAgZ2V0Q2VudGVyOiBnZXRDZW50ZXIsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXIoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG92ZXJsYXlzOiB7XHJcbiAgICAgICAgICAgIHJvdGFsYXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnUm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgbGF0OiAzOS45MDMyOTE4LFxyXG4gICAgICAgICAgICBsbmc6IDMyLjYyMjMzOTYsXHJcbiAgICAgICAgICAgIHpvb206IDZcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbnRlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXAnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXBDb25maWdTZXJ2aWNlJywgbWFwQ29uZmlnU2VydmljZSk7IiwiZnVuY3Rpb24gZ2VvY29kZSgkcSkge1xyXG4gIHJldHVybiB7IFxyXG4gICAgZ2VvY29kZUFkZHJlc3M6IGZ1bmN0aW9uKGFkZHJlc3MpIHtcclxuICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IGFkZHJlc3MgfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcclxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgICAgLy8gd2luZG93LmZpbmRMb2NhdGlvbihyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgnZ2VvY29kZScsIGdlb2NvZGUpOyIsImZ1bmN0aW9uIHJldmVyc2VHZW9jb2RlKCRxLCAkaHR0cCkge1xyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgb2JqLmdlb2NvZGVMYXRsbmcgPSBmdW5jdGlvbiBnZW9jb2RlUG9zaXRpb24obGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHtcclxuICAgICAgICAgICAgbGF0TG5nOiBsYXRsbmdcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlcyAmJiByZXNwb25zZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2VzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ3JldmVyc2VHZW9jb2RlJywgcmV2ZXJzZUdlb2NvZGUpOyJdfQ==
