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

    HeadlineController.$inject = ['$scope', '$state','$interval'];

    function HeadlineController($scope, $state,$interval) {
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
            if( i === 5){
                //restart
                i=0;
            }
            i++;
            var imgUrl = "url('../../img/bg-"+ i +".jpg')";
            angular.element(".headline")
                .css({
                    background: imgUrl,
                    // backgroundSize: "cover",
                    // backgroundPosition: "bottom",
                });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicHJvZmlsZS9wcm9maWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJsYXlvdXQvbGF5b3V0LmpzIiwibGF5b3V0LmRldGFpbC9sYXlvdXQuZGV0YWlsLmpzIiwicm90YWVrbGUvcm90YWVrbGUuanMiLCJyb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIm1hcC9tYXAuYXV0b2NvbXBsZXRlLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8s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QU8sS0FBSztRQUN6QyxTQUFTLFFBQVE7WUFDYixRQUFRO1dBQ1QsU0FBUyxXQUFXO1lBQ25CLElBQUksYUFBYSxVQUFVLFNBQVMsR0FBRztnQkFDbkMsT0FBTyxTQUFTLFFBQVEsVUFBVSxHQUFHO21CQUNsQztnQkFDSCxPQUFPLFNBQVMsUUFBUTs7V0FFN0IsVUFBVSxLQUFLO1lBQ2QsT0FBTyxTQUFTLFFBQVE7O1FBRTVCLE9BQU8sU0FBUzs7SUFFcEIsT0FBTzs7O0FBR1g7RUFDRSxPQUFPO0VBQ1AsUUFBUSxrQkFBa0IsZ0JBQWdCIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldC5zcGxpdChzZWFyY2gpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdlb2NvZGUtYXV0b2NvbXBsZXRlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICQodGhhdCkudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmVkaWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwczovL2dlb2NvZGUtbWFwcy55YW5kZXgucnUvMS54Lz9yZXN1bHRzPTUmYmJveD0yNC4xMjU5NzcsMzQuNDUyMjE4fjQ1LjEwOTg2Myw0Mi42MDE2MjAmZm9ybWF0PWpzb24mbGFuZz10cl9UUiZnZW9jb2RlPScgKyBxdWVyeSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm5hbWUgKyAnLCAnICsgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2xhdDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LlBvaW50LnBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEua2luZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdF90eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmJveDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmJvdW5kZWRCeS5FbnZlbG9wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGVzY3JpcHRpb24uaW5kZXhPZignVMO8cmtpeWUnKSA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHByZWRpY3Rpb25zICYmIHByZWRpY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVzdWx0cyA9ICQubWFwKHByZWRpY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnVuY3Rpb24gKHByZWRpY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZGVzdCA9IHByZWRpY3Rpb24ubmFtZSArIFwiLCBcIiArIHByZWRpY3Rpb24uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdCA9IGRlc3QucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2VzcyhwcmVkaWN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWZ0ZXJTZWxlY3Q6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9ICcvYS8nICsgaXRlbS5uYW1lICtcclxuICAgICAgICAgICAgICAgICAgICAnP2xhdFNXPScgKyBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVsxXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdTVz0nICsgaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbGF0TkU9JyArIGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzFdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ05FPScgKyBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSAnPHNwYW4gY2xhc3M9XCJpdGVtLWFkZHJlc3NcIj4nICsgaXRlbSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgIGZpdFRvRWxlbWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhhdCkub24oJ3R5cGVhaGVhZDpjaGFuZ2UnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGF0KS52YWwoaXRlbS5maW5kKCdhPnNwYW4uaXRlbS1hZGRyZXNzJykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG53aW5kb3cubW9iaWxlY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY2hlY2sgPSBmYWxzZTtcclxuICAgIChmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsIDQpKSkgY2hlY2sgPSB0cnVlO1xyXG4gICAgfSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XHJcbiAgICByZXR1cm4gY2hlY2s7XHJcbn07XHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICdhcHAubmF2YmFyJyxcclxuICAgICdhcHAubG9naW4nLFxyXG4gICAgJ2FwcC5yZWdpc3RlcicsXHJcbiAgICAnYXBwLmNhcmQnLCBcclxuICAgICdhcHAucHJvZmlsZScsXHJcbiAgICAnYXBwLnVzZXJTZXJ2aWNlJyxcclxuICAgICdhcHAudHJhY2tTZXJ2aWNlJyxcclxuICAgICdhcHAubWFya2VyUGFyc2VyJyxcclxuICAgICdhcHAubWFwJyxcclxuICAgICdhcHAuY29udGVudCcsICAgIFxyXG4gICAgJ2FwcC5yb3RhJyxcclxuICAgICdvYy5sYXp5TG9hZCcsXHJcbiAgICAndWkucm91dGVyJyxcclxuICAgICdsZWFmbGV0LWRpcmVjdGl2ZScsXHJcbiAgICAnbmdBdXRvY29tcGxldGUnXHJcbiAgXSlcclxuICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCckbG9jYXRpb25Qcm92aWRlcicsJyRsb2dQcm92aWRlcicsJyRvY0xhenlMb2FkUHJvdmlkZXInLCckY29tcGlsZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJGxvZ1Byb3ZpZGVyLCAkb2NMYXp5TG9hZFByb3ZpZGVyLCRjb21waWxlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAkb2NMYXp5TG9hZFByb3ZpZGVyLmNvbmZpZyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlXHJcbiAgICB9KTtcclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xyXG4gICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgdmFyIGxvZ2luU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdsb2dpbicsXHJcbiAgICAgIHVybDogJy9naXJpcycsXHJcbiAgICAgIHRlbXBsYXRlOiAnPGxvZ2luLWRpcmVjdGl2ZT48L2xvZ2luLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobG9naW5TdGF0ZSk7XHJcblxyXG4gICAgdmFyIHJlZ2lzdGVyU3RhdGUgPSB7XHJcbiAgICAgIG5hbWU6ICdyZWdpc3RlcicsXHJcbiAgICAgIHVybDogJy9rYXlpdCcsXHJcbiAgICAgIHRlbXBsYXRlOiAnPHJlZ2lzdGVyLWRpcmVjdGl2ZT48L3JlZ2lzdGVyLWRpcmVjdGl2ZT4nXHJcbiAgICB9O1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocmVnaXN0ZXJTdGF0ZSk7XHJcblxyXG4gICAgdmFyIHByb2ZpbGVTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3Byb2ZpbGUnLFxyXG4gICAgICB1cmw6ICcvcHJvZmlsJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHByb2ZpbGUtZGlyZWN0aXZlPjwvcHJvZmlsZS1kaXJlY3RpdmU+J1xyXG4gICAgfTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHByb2ZpbGVTdGF0ZSk7XHJcbiAgfV0pXHJcbiAgLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIHJldHVybiBnZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbmQuZGF0YS5PcGVyYXRpb25SZXN1bHQpIFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXNwb25kLmRhdGEudXNlcjtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mbGFnTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgfSkoKTsgXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29udGVudCcsIFsnYXBwLmhlYWRlcicsICdhcHAuZm9vdGVyJywndWkucm91dGVyJ10pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0U3RhdGUnLCBcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2xhbmRpbmcvbGFuZGluZy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmYXVsdFN0YXRlKTtcclxuICAgIH0pXHJcbiAgXHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YScsIFsnYXBwLmxheW91dCcsICdhcHAubGF5b3V0RGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIGxheW91dFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2xheW91dCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYS97dGVybX0/bGF0U1cmbG5nU1cmbGF0TkUmbG5nTkUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PGxheW91dC1kaXJlY3RpdmU+PC9sYXlvdXQtZGlyZWN0aXZlPicsXHJcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxheW91dFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXlvdXREZXRhaWxTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdsYXlvdXREZXRhaWwnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGEvOmlkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxsYXlvdXQtZGV0YWlsLWRpcmVjdGl2ZT48L2xheW91dC1kZXRhaWwtZGlyZWN0aXZlPidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobGF5b3V0RGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrSW1hZ2VTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5pbWFnZScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVzaW1sZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuaW1hZ2Uvcm90YWVrbGUuaW1hZ2UuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ltYWdlU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrR1BYU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZ3B4JyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9ncHgnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZ3B4L3JvdGFla2xlLmdweC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrR1BYU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrRmluaXNoU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZmluaXNoJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rYXlkZXQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZmluaXNoL3JvdGFla2xlLmZpbmlzaC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrRmluaXNoU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZvb3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnZm9vdGVyRGlyZWN0aXZlJywgZm9vdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGZvb3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcbn0pKCk7IFxyXG4gXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmhlYWRlcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2hlYWRsaW5lRGlyZWN0aXZlJywgaGVhZGxpbmVEaXJlY3RpdmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlYWRsaW5lRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9oZWFkbGluZS9oZWFkbGluZS5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBIZWFkbGluZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgSGVhZGxpbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCckaW50ZXJ2YWwnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkbGluZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsJGludGVydmFsKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHZtLnNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtOiB2bS5lbG1hXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiI0F1dG9jb21wbGV0ZVwiKS5mb2N1cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNBdXRvY29tcGxldGVcIikub2Zmc2V0KCkudG9wIC0gODBcclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICAkaW50ZXJ2YWwoY2hhbmdlQmcsIDY1MDApO1xyXG5cclxuICAgICAgICB2YXIgaSA9IDE7XHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlQmcoKSB7XHJcbiAgICAgICAgICAgIGlmKCBpID09PSA1KXtcclxuICAgICAgICAgICAgICAgIC8vcmVzdGFydFxyXG4gICAgICAgICAgICAgICAgaT0wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgdmFyIGltZ1VybCA9IFwidXJsKCcuLi8uLi9pbWcvYmctXCIrIGkgK1wiLmpwZycpXCI7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIi5oZWFkbGluZVwiKVxyXG4gICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogaW1nVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhY2tncm91bmRTaXplOiBcImNvdmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFja2dyb3VuZFBvc2l0aW9uOiBcImJvdHRvbVwiLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2MgY2FyZCBjb21wb25lbnQgXHJcbiogQGV4YW1wbGUgPGNhcmQ+PC9jYXJkPlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY2FyZCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnY2FyZERpcmVjdGl2ZScsIGNhcmREaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gY2FyZERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9jYXJkL2NhcmQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICc8JyxcclxuICAgICAgICAgICAgc3VtbWFyeTogJzwnLFxyXG4gICAgICAgICAgICBvd25lcjonPCcsXHJcbiAgICAgICAgICAgIGltZ1NyYzonPCcsXHJcbiAgICAgICAgICAgIGlkOiAnPCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiBDYXJkQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENhcmRDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpczsgXHJcbiAgICAvLyB2bS5pbWdTcmMgPSB2bS5pbWdTcmMuc3BsaXQoJ2NsaWVudCcpWzFdO1xyXG59IFxyXG4iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubG9naW4nLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xvZ2luRGlyZWN0aXZlJywgbG9naW5EaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gbG9naW5EaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL2xvZ2luL2xvZ2luLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBGb290ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiAqIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuICogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4gKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm5hdmJhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbmF2YmFyRGlyZWN0aXZlJywgbmF2YmFyRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIG5hdmJhckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbmF2YmFyL25hdmJhci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogbmF2YmFyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiAgICB2bS5vcGVuTmF2ID0gb3Blbk5hdjtcclxuICAgIHZtLmNsb3NlTmF2ID0gY2xvc2VOYXY7XHJcbiAgICBmdW5jdGlvbiBvcGVuTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VOYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgID0gXCIwJVwiO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncHJvZmlsZURpcmVjdGl2ZScsIHByb2ZpbGVEaXJlY3RpdmUpO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZURpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvcHJvZmlsZS9wcm9maWxlLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IHByb2ZpbGVDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblxyXG5cclxucHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICd1c2VyU2VydmljZScsICd0cmFja1NlcnZpY2UnLCAnbWFya2VyUGFyc2VyJ107XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlQ29udHJvbGxlcigkcm9vdFNjb3BlLCB1c2VyU2VydmljZSx0cmFja1NlcnZpY2UsbWFya2VyUGFyc2VyKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gIFxyXG4gICAgfVxyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJlZ2lzdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcmVjdGl2ZScsIHJlZ2lzdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9yZWdpc3Rlci9yZWdpc3Rlci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogcmVnaXN0ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuICogQGRlc2MgTWFpbiBsYXlvdXQgZm9yIGFwcGxpY2F0aW9uXHJcbiAqIEBleGFtcGxlIDxsYXlvdXQtZGlyZWN0aXZlPjwvbGF5b3V0LWRpcmVjdGl2ZT5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xheW91dERpcmVjdGl2ZScsIGxheW91dERpcmVjdGl2ZSlcclxuXHJcbmZ1bmN0aW9uIGxheW91dERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvbGF5b3V0L2xheW91dC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogTGF5b3V0Q29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5MYXlvdXRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gTGF5b3V0Q29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsXHJcbiAgICBtYXJrZXJQYXJzZXIsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXRNYXBFdmVudHMsIGxlYWZsZXREYXRhLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIHZtLmdldFRyYWNrID0gZ2V0VHJhY2s7XHJcbiAgICB2bS5tYXBBdXRvUmVmcmVzaCA9IHRydWU7XHJcbiAgICB2bS5vcGVuTWFwID0gb3Blbk1hcDtcclxuICAgIHZtLnBhcmFtcyA9IHtcclxuICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgIGxuZ05FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdORSksXHJcbiAgICAgICAgbGF0U1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxhdFNXKSxcclxuICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRyYWNrKCkge1xyXG4gICAgICAgIHJldHVybiB0cmFja1NlcnZpY2UuZ2V0VHJhY2sodm0ucGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrcy5kYXRhID0gcmVzcG9uZC5kYXRhO1xyXG4gICAgICAgICAgICBpZiAodm0udHJhY2tzLmRhdGEgPT0gW10pIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFya2VyUGFyc2VyLmpzb25Ub01hcmtlckFycmF5KHZtLnRyYWNrcy5kYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2VycyA9IG1hcmtlclBhcnNlci50b09iamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gTC5nZW9Kc29uKHZtLnRyYWNrcy5kYXRhKS5nZXRCb3VuZHMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgdm0uY2hhbmdlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICAvLyB2YXIgc3dhcCA9IG1hcmtlci5pY29uO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uID0gbWFya2VyLmljb25fc3dhcDtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbl9zd2FwID0gc3dhcDtcclxuICAgICAgICAvLyBpZiAobWFya2VyLmZvY3VzKVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpLmxhdE5FID0gMjApO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwNGMwMCcsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcbiAgICBmb3IgKHZhciBrIGluIHZtLm1hcEV2ZW50cykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZtLm1hcEV2ZW50cyk7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLicgKyB2bS5tYXBFdmVudHNba107XHJcbiAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2VJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3V0Jykge1xyXG4gICAgICAgICAgICAgICAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcC5tb3ZlZW5kJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXNkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdmFyIG1hcEV2ZW50ID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAubW92ZWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudCwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYXJncy5sZWFmbGV0T2JqZWN0KTtcclxuICAgICAgICBpZiAodm0ubWFwQXV0b1JlZnJlc2gpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm1hcmtlcnMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubGF0TkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubG5nTkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubGF0U1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5wYXJhbXMubG5nU1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0TkUgPSA1MC40Mjk1MTc5NDc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0OS43OTAwMzkwNjI7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSAyNC4xMjY3MDE5NTg7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nU1cgPSAxOS43NzUzOTA2MjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJy5kYXRhLXZpeicpLndpZHRoKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgICAgICAnbGF0TkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ05FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICdsYXRTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG5nU1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH0pXHJcbiAgICAkc2NvcGUuJG9uKCckcm91dGVVcGRhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWxlcnQoMSlcclxuICAgIH0pO1xyXG5cclxuICAgIHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnO1xyXG4gICAgZnVuY3Rpb24gb3Blbk1hcCgpIHtcclxuICAgICAgICB2bS5tYXBBY3RpdmUgPSAhdm0ubWFwQWN0aXZlO1xyXG4gICAgICAgICQoJy5kYXRhLXZpeicpLnRvZ2dsZUNsYXNzKCdtYXAtb3BlbicpO1xyXG4gICAgICAgICQoJy5tYXAtYXV0by1yZWZyZXNoJykudG9nZ2xlQ2xhc3MoJ3JlZnJlc2gtb3BlbicpO1xyXG4gICAgICAgICh2bS50b2dnbGVUaXRsZSA9PSAnIEhhcml0YScgPyB2bS50b2dnbGVUaXRsZSA9ICcgTGlzdGUnIDogdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YScgKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy5kYXRhLXZpeicpLndpZHRoKCkpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxufSIsImFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sYXlvdXREZXRhaWwnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xheW91dERldGFpbERpcmVjdGl2ZScsIGxheW91dERldGFpbERpcmVjdGl2ZSlcclxuXHJcbmZ1bmN0aW9uIGxheW91dERldGFpbERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvbGF5b3V0LmRldGFpbC9sYXlvdXQuZGV0YWlsLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICBjb250cm9sbGVyOiBMYXlvdXREZXRhaWxDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbkxheW91dERldGFpbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0RGF0YSddO1xyXG5cclxuZnVuY3Rpb24gTGF5b3V0RGV0YWlsQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0RGF0YSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrRGV0YWlsID0ge307XHJcbiAgICB2bS5jZW50ZXIgPSB7fTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMuc3BsaXQoJ2NsaWVudCcpWzFdLnJlcGxhY2VBbGwoJ1xcXFwnLCAnLycpXHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2bS5jZW50ZXIpO1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBncHggPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmdweDsgLy8gVVJMIHRvIHlvdXIgR1BYIGZpbGUgb3IgdGhlIEdQWCBpdHNlbGZcclxuICAgICAgICAgICAgICAgIG5ldyBMLkdQWChncHgsIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSkub24oJ2xvYWRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhlLnRhcmdldC5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICB9KS5hZGRUbyhtYXApOyAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuXHJcblxyXG59IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGFla2xlJywgWydhcHAubWFwJywgJ25nQXV0b2NvbXBsZXRlJywgJ2FwcC50cmFja1NlcnZpY2UnLCAnbmdGaWxlVXBsb2FkJywgJ2FuZ3VsYXItbGFkZGEnXSlcclxuICAgICAgICAuY29udHJvbGxlcigncm90YUVrbGVDb250cm9sbGVyJywgcm90YUVrbGVDb250cm9sbGVyKVxyXG5cclxuXHJcbiAgICByb3RhRWtsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnbWFwQ29uZmlnU2VydmljZScsICdyZXZlcnNlR2VvY29kZScsICd0cmFja1NlcnZpY2UnLCAnJHN0YXRlJywgJ1VwbG9hZCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGFFa2xlQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIG1hcENvbmZpZ1NlcnZpY2UsIHJldmVyc2VHZW9jb2RlLCB0cmFja1NlcnZpY2UsICRzdGF0ZSwgVXBsb2FkKSB7XHJcbiAgICAgICAgLy8gJG9jTGF6eUxvYWQubG9hZCgnLi4vLi4vc2VydmljZXMvbWFwL21hcC5hdXRvY29tcGxldGUuanMnKTtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICB2bS5vd25lZEJ5ID0gJHJvb3RTY29wZS51c2VyLl9pZDtcclxuICAgICAgICB2bS5pbWdfc3JjID0gXCJzcmNcIjtcclxuICAgICAgICB2bS5zdW1tYXJ5O1xyXG4gICAgICAgIHZtLmFsdGl0dWRlO1xyXG4gICAgICAgIHZtLmRpc3RhbmNlO1xyXG4gICAgICAgIHZtLm5hbWUgPSAnJztcclxuICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtdO1xyXG4gICAgICAgIHZtLnVwbG9hZEdQWCA9IHVwbG9hZEdQWDtcclxuICAgICAgICB2bS51cGxvYWRQaWMgPSB1cGxvYWRQaWM7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUubG9naW5Mb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdm0uYWRkVHJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRyYWNrU2VydmljZS5hZGRUcmFjayh2bSkudGhlbihmdW5jdGlvbiAoYWRkVHJhY2tSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGFkZFRyYWNrRXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRQaWMoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9waG90b3MvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW1nX3NyYyA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkR1BYKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvZ3B4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3B4ID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZmluaXNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xyXG4gICAgICAgICAgICBtYXJrZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYWluTWFya2VyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2bS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZtLmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmHFn2thIGJpciBub2t0YXlhIHTEsWtsYXlhcmFrIGtheWTEsXIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbihcImxlYWZsZXREaXJlY3RpdmVNYXAuY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWFmRXZlbnQgPSBhcmdzLmxlYWZsZXRFdmVudDtcclxuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUuZ2VvY29kZUxhdGxuZyhsZWFmRXZlbnQubGF0bG5nLmxhdCwgbGVhZkV2ZW50LmxhdGxuZy5sbmcpLnRoZW4oZnVuY3Rpb24gKGdlb2NvZGVTdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9jYXRpb24gPSBnZW9jb2RlU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubGF0ID0gbGVhZkV2ZW50LmxhdGxuZy5sYXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubG5nID0gbGVhZkV2ZW50LmxhdGxuZy5sbmc7XHJcbiAgICAgICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW2xlYWZFdmVudC5sYXRsbmcubG5nLCBsZWFmRXZlbnQubGF0bG5nLmxhdF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIiIsIi8qKlxyXG4gKiBAZGVzYyBTZXJ2aWNlcyB0aGF0IGNvbnZlcnRzIGdlb2pzb24gZmVhdHVyZXMgdG8gbWFya2VycyBmb3IgaGFuZGxpbmcgbGF0ZXJcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXJrZXJQYXJzZXIoJHEpIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGpzb25Ub01hcmtlckFycmF5OiBqc29uVG9NYXJrZXJBcnJheSxcclxuICAgICAgICB0b09iamVjdDogdG9PYmplY3RcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuXHRmdW5jdGlvbiBqc29uVG9NYXJrZXJBcnJheSh2YWwpIHtcclxuICAgICAgICB2YXIgZGVmZXJlZCA9ICRxLmRlZmVyKCk7IC8vIGRlZmVyZWQgb2JqZWN0IHJlc3VsdCBvZiBhc3luYyBvcGVyYXRpb25cclxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICAgIHZhciBtYXJrID0ge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXI6IFwicm90YWxhclwiLFxyXG4gICAgICAgICAgICAgICAgbGF0OiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDRjMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuYWx0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXN0YW5jZVwiIDogdmFsW2ldLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW1tYXJ5XCIgOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjp2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG1hcmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvdXRwdXQpIHtcclxuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBkZWZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XHJcbiAgICAgICAgdmFyIHJ2ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgaWYgKGFycmF5W2ldICE9PSB1bmRlZmluZWQpIHJ2W2ldID0gYXJyYXlbaV07XHJcbiAgICAgICAgcmV0dXJuIHJ2OyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLm1hcmtlclBhcnNlcicsIFtdKVxyXG4uZmFjdG9yeSgnbWFya2VyUGFyc2VyJywgbWFya2VyUGFyc2VyKTsiLCJmdW5jdGlvbiB0cmFja1NlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgZW5kcG9pbnQgPSAnaHR0cDpsb2NhbGhvc3Q6ODA4MC8nXHJcblxyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VHJhY2s6IGdldFRyYWNrLFxyXG5cdFx0YWRkVHJhY2s6IGFkZFRyYWNrLFxyXG5cdFx0Z2V0VHJhY2tEZXRhaWw6Z2V0VHJhY2tEZXRhaWwsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2socGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzP2xhdE5FPScrIHBhcmFtcy5sYXRORSsnJmxuZ05FPScrcGFyYW1zLmxuZ05FICsnJmxhdFNXPScrcGFyYW1zLmxhdFNXICsnJmxuZ1NXPScrcGFyYW1zLmxuZ1NXLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFja0RldGFpbChpZCkge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nK2lkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRyYWNrKHRyYWNrKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcycsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF0YTogJC5wYXJhbSh7XHJcblx0XHRcdFx0XCJuYW1lXCI6IHRyYWNrLm5hbWUsXHJcblx0XHRcdFx0XCJkaXN0YW5jZVwiOiB0cmFjay5kaXN0YW5jZSxcclxuXHRcdFx0XHRcImFsdGl0dWRlXCI6IHRyYWNrLmFsdGl0dWRlLFxyXG5cdFx0XHRcdFwic3VtbWFyeVwiOiB0cmFjay5zdW1tYXJ5LFxyXG5cdFx0XHRcdFwiaW1nX3NyY1wiOiB0cmFjay5pbWdfc3JjLFxyXG5cdFx0XHRcdFwiY29vcmRpbmF0ZXNcIjogdHJhY2suY29vcmRpbmF0ZXMsXHJcblx0XHRcdFx0XCJvd25lZEJ5XCI6IHRyYWNrLm93bmVkQnksXHJcblx0XHRcdFx0XCJncHhcIjogdHJhY2suZ3B4LFxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLnRyYWNrU2VydmljZScsIFtdKVxyXG5cdC5mYWN0b3J5KCd0cmFja1NlcnZpY2UnLCB0cmFja1NlcnZpY2UpOyIsImZ1bmN0aW9uIHVzZXJTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRVc2VyOiBnZXRVc2VyLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgIFx0cmV0dXJuICRodHRwKHtcclxuICAgIFx0XHRtZXRob2Q6ICdHRVQnLFxyXG4gICAgXHRcdHVybDogJ2FwaS9wcm9maWxlJ1xyXG4gICAgXHR9KVxyXG4gICAgfTsgXHJcbn0gXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLnVzZXJTZXJ2aWNlJywgW10pXHJcbi5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQSBkaXJlY3RpdmUgZm9yIGFkZGluZyBnb29nbGUgcGxhY2VzIGF1dG9jb21wbGV0ZSB0byBhIHRleHQgYm94XHJcbiAqIGdvb2dsZSBwbGFjZXMgYXV0b2NvbXBsZXRlIGluZm86IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3BsYWNlc1xyXG4gKlxyXG4gKiBTaW1wbGUgVXNhZ2U6XHJcbiAqXHJcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiLz5cclxuICpcclxuICogY3JlYXRlcyB0aGUgYXV0b2NvbXBsZXRlIHRleHQgYm94IGFuZCBnaXZlcyB5b3UgYWNjZXNzIHRvIHRoZSByZXN1bHRcclxuICpcclxuICogICArIGBuZy1hdXRvY29tcGxldGU9XCJyZXN1bHRcImA6IHNwZWNpZmllcyB0aGUgZGlyZWN0aXZlLCAkc2NvcGUucmVzdWx0IHdpbGwgaG9sZCB0aGUgdGV4dGJveCByZXN1bHRcclxuICpcclxuICpcclxuICogQWR2YW5jZWQgVXNhZ2U6XHJcbiAqXHJcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiIGRldGFpbHM9XCJkZXRhaWxzXCIgb3B0aW9ucz1cIm9wdGlvbnNcIi8+XHJcbiAqXHJcbiAqICAgKyBgbmctYXV0b2NvbXBsZXRlPVwicmVzdWx0XCJgOiBzcGVjaWZpZXMgdGhlIGRpcmVjdGl2ZSwgJHNjb3BlLnJlc3VsdCB3aWxsIGhvbGQgdGhlIHRleHRib3ggYXV0b2NvbXBsZXRlIHJlc3VsdFxyXG4gKlxyXG4gKiAgICsgYGRldGFpbHM9XCJkZXRhaWxzXCJgOiAkc2NvcGUuZGV0YWlscyB3aWxsIGhvbGQgdGhlIGF1dG9jb21wbGV0ZSdzIG1vcmUgZGV0YWlsZWQgcmVzdWx0OyBsYXRsbmcuIGFkZHJlc3MgY29tcG9uZW50cywgZXRjLlxyXG4gKlxyXG4gKiAgICsgYG9wdGlvbnM9XCJvcHRpb25zXCJgOiBvcHRpb25zIHByb3ZpZGVkIGJ5IHRoZSB1c2VyIHRoYXQgZmlsdGVyIHRoZSBhdXRvY29tcGxldGUgcmVzdWx0c1xyXG4gKlxyXG4gKiAgICAgICsgb3B0aW9ucyA9IHtcclxuICogICAgICAgICAgIHR5cGVzOiB0eXBlLCAgICAgICAgc3RyaW5nLCB2YWx1ZXMgY2FuIGJlICdnZW9jb2RlJywgJ2VzdGFibGlzaG1lbnQnLCAnKHJlZ2lvbnMpJywgb3IgJyhjaXRpZXMpJ1xyXG4gKiAgICAgICAgICAgYm91bmRzOiBib3VuZHMsICAgICBnb29nbGUgbWFwcyBMYXRMbmdCb3VuZHMgT2JqZWN0XHJcbiAqICAgICAgICAgICBjb3VudHJ5OiBjb3VudHJ5ICAgIHN0cmluZywgSVNPIDMxNjYtMSBBbHBoYS0yIGNvbXBhdGlibGUgY291bnRyeSBjb2RlLiBleGFtcGxlczsgJ2NhJywgJ3VzJywgJ2diJ1xyXG4gKiAgICAgICAgIH1cclxuICpcclxuICpcclxuICovXHJcblxyXG5hbmd1bGFyLm1vZHVsZSggXCJuZ0F1dG9jb21wbGV0ZVwiLCBbXSlcclxuICAuZGlyZWN0aXZlKCduZ0F1dG9jb21wbGV0ZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgZGV0YWlsczogJz0nLFxyXG4gICAgICAgIG5nQXV0b2NvbXBsZXRlOiAnPScsXHJcbiAgICAgICAgb3B0aW9uczogJz0nXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG1vZGVsKSB7XHJcblxyXG4gICAgICAgIC8vb3B0aW9ucyBmb3IgYXV0b2NvbXBsZXRlXHJcbiAgICAgICAgdmFyIG9wdHNcclxuXHJcbiAgICAgICAgLy9jb252ZXJ0IG9wdGlvbnMgcHJvdmlkZWQgdG8gb3B0c1xyXG4gICAgICAgIHZhciBpbml0T3B0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgb3B0cyA9IHt9XHJcbiAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy50eXBlcykge1xyXG4gICAgICAgICAgICAgIG9wdHMudHlwZXMgPSBbXVxyXG4gICAgICAgICAgICAgIG9wdHMudHlwZXMucHVzaChzY29wZS5vcHRpb25zLnR5cGVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zLmJvdW5kcykge1xyXG4gICAgICAgICAgICAgIG9wdHMuYm91bmRzID0gc2NvcGUub3B0aW9ucy5ib3VuZHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy5jb3VudHJ5KSB7XHJcbiAgICAgICAgICAgICAgb3B0cy5jb21wb25lbnRSZXN0cmljdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudHJ5OiBzY29wZS5vcHRpb25zLmNvdW50cnlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaW5pdE9wdHMoKVxyXG5cclxuICAgICAgICAvL2NyZWF0ZSBuZXcgYXV0b2NvbXBsZXRlXHJcbiAgICAgICAgLy9yZWluaXRpYWxpemVzIG9uIGV2ZXJ5IGNoYW5nZSBvZiB0aGUgb3B0aW9ucyBwcm92aWRlZFxyXG4gICAgICAgIHZhciBuZXdBdXRvY29tcGxldGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNjb3BlLmdQbGFjZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGVsZW1lbnRbMF0sIG9wdHMpO1xyXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoc2NvcGUuZ1BsYWNlLCAncGxhY2VfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgICBpZiAoc2NvcGUuZGV0YWlscykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuZGV0YWlscyA9IHNjb3BlLmdQbGFjZS5nZXRQbGFjZSgpO1xyXG4vLyAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHNjb3BlLm5nQXV0b2NvbXBsZXRlID0gZWxlbWVudC52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdBdXRvY29tcGxldGUoKVxyXG5cclxuICAgICAgICAvL3dhdGNoIG9wdGlvbnMgcHJvdmlkZWQgdG8gZGlyZWN0aXZlXHJcbiAgICAgICAgc2NvcGUud2F0Y2hPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIHNjb3BlLm9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNjb3BlLiR3YXRjaChzY29wZS53YXRjaE9wdGlvbnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGluaXRPcHRzKClcclxuICAgICAgICAgIG5ld0F1dG9jb21wbGV0ZSgpXHJcbiAgICAgICAgICBlbGVtZW50WzBdLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICBzY29wZS5uZ0F1dG9jb21wbGV0ZSA9IGVsZW1lbnQudmFsKCk7XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSk7IiwiZnVuY3Rpb24gbWFwQ29uZmlnU2VydmljZSgpIHtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBnZXRMYXllcjogZ2V0TGF5ZXIsXHJcbiAgICAgICAgZ2V0Q2VudGVyOiBnZXRDZW50ZXIsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXIoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG92ZXJsYXlzOiB7XHJcbiAgICAgICAgICAgIHJvdGFsYXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnUm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgbGF0OiAzOS45MDMyOTE4LFxyXG4gICAgICAgICAgICBsbmc6IDMyLjYyMjMzOTYsXHJcbiAgICAgICAgICAgIHpvb206IDZcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbnRlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXAnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXBDb25maWdTZXJ2aWNlJywgbWFwQ29uZmlnU2VydmljZSk7IiwiZnVuY3Rpb24gZ2VvY29kZSgkcSkge1xyXG4gIHJldHVybiB7IFxyXG4gICAgZ2VvY29kZUFkZHJlc3M6IGZ1bmN0aW9uKGFkZHJlc3MpIHtcclxuICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IGFkZHJlc3MgfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcclxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgICAgLy8gd2luZG93LmZpbmRMb2NhdGlvbihyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgnZ2VvY29kZScsIGdlb2NvZGUpOyIsImZ1bmN0aW9uIHJldmVyc2VHZW9jb2RlKCRxLCAkaHR0cCkge1xyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgb2JqLmdlb2NvZGVMYXRsbmcgPSBmdW5jdGlvbiBnZW9jb2RlUG9zaXRpb24obGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHtcclxuICAgICAgICAgICAgbGF0TG5nOiBsYXRsbmdcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlcyAmJiByZXNwb25zZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2VzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ3JldmVyc2VHZW9jb2RlJywgcmV2ZXJzZUdlb2NvZGUpOyJdfQ==
