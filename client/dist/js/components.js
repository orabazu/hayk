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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicHJvZmlsZS9wcm9maWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJsYXlvdXQvbGF5b3V0LmpzIiwibGF5b3V0LmRldGFpbC9sYXlvdXQuZGV0YWlsLmpzIiwicm90YWVrbGUvcm90YWVrbGUuanMiLCJyb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIm1hcC9tYXAuYXV0b2NvbXBsZXRlLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8s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LE9BQU8sU0FBUyxRQUFRLFFBQVEsR0FBRyxTQUFTOzs7UUFHOUMsT0FBTyxTQUFTOztNQUVsQixPQUFPLFNBQVM7Ozs7O0FBS3RCO0VBQ0UsT0FBTztFQUNQLFFBQVEsV0FBVyxTQUFTOzt5Q0NuQjlCLFNBQVMsZUFBZSxJQUFJLE9BQU87SUFDL0IsSUFBSSxNQUFNO0lBQ1YsSUFBSSxnQkFBZ0IsU0FBUyxnQkFBZ0IsS0FBSyxLQUFLO1FBQ25ELElBQUksV0FBVyxJQUFJLE9BQU8sS0FBSztRQUMvQixJQUFJLFdBQVcsR0FBRztRQUNsQixJQUFJLFNBQVMsSUFBSSxPQUFPLEtBQUssT0FBTyxLQUFLO1FBQ3pDLFNBQVMsUUFBUTtZQUNiLFFBQVE7V0FDVCxTQUFTLFdBQVc7WUFDbkIsSUFBSSxhQUFhLFVBQVUsU0FBUyxHQUFHO2dCQUNuQyxPQUFPLFNBQVMsUUFBUSxVQUFVLEdBQUc7bUJBQ2xDO2dCQUNILE9BQU8sU0FBUyxRQUFROztXQUU3QixVQUFVLEtBQUs7WUFDZCxPQUFPLFNBQVMsUUFBUTs7UUFFNUIsT0FBTyxTQUFTOztJQUVwQixPQUFPOzs7QUFHWDtFQUNFLE9BQU87RUFDUCxRQUFRLGtCQUFrQixnQkFBZ0IiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uIChzZWFyY2gsIHJlcGxhY2VtZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlbWVudCk7XHJcbn07XHJcblxyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcuZ2VvY29kZS1hdXRvY29tcGxldGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGF0KS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChxdWVyeSwgcHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZWRpY3Rpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICAkLmdldEpTT04oJ2h0dHBzOi8vZ2VvY29kZS1tYXBzLnlhbmRleC5ydS8xLngvP3Jlc3VsdHM9NSZiYm94PTI0LjEyNTk3NywzNC40NTIyMTh+NDUuMTA5ODYzLDQyLjYwMTYyMCZmb3JtYXQ9anNvbiZsYW5nPXRyX1RSJmdlb2NvZGU9JyArIHF1ZXJ5LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubmFtZSArICcsICcgKyBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24ucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb25nbGF0OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuUG9pbnQucG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YS5raW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0X3R5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYm94OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuYm91bmRlZEJ5LkVudmVsb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kZXNjcmlwdGlvbi5pbmRleE9mKCdUw7xya2l5ZScpID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9ucy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAocHJlZGljdGlvbnMgJiYgcHJlZGljdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXN1bHRzID0gJC5tYXAocHJlZGljdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jdGlvbiAocHJlZGljdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHZhciBkZXN0ID0gcHJlZGljdGlvbi5uYW1lICsgXCIsIFwiICsgcHJlZGljdGlvbi5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0ID0gZGVzdC5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzKHByZWRpY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlclNlbGVjdDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gJy9hLycgKyBpdGVtLm5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICAgICc/bGF0U1c9JyArIGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzFdICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ1NXPScgKyBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVswXSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsYXRORT0nICsgaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nTkU9JyArIGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9ICc8c3BhbiBjbGFzcz1cIml0ZW0tYWRkcmVzc1wiPicgKyBpdGVtICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgZml0VG9FbGVtZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGF0KS5vbigndHlwZWFoZWFkOmNoYW5nZScsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQpLnZhbChpdGVtLmZpbmQoJ2E+c3Bhbi5pdGVtLWFkZHJlc3MnKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbndpbmRvdy5tb2JpbGVjaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGVjayA9IGZhbHNlO1xyXG4gICAgKGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgaWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCwgNCkpKSBjaGVjayA9IHRydWU7XHJcbiAgICB9KShuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgd2luZG93Lm9wZXJhKTtcclxuICAgIHJldHVybiBjaGVjaztcclxufTtcclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgJ2FwcC5uYXZiYXInLFxyXG4gICAgJ2FwcC5sb2dpbicsXHJcbiAgICAnYXBwLnJlZ2lzdGVyJyxcclxuICAgICdhcHAuY2FyZCcsIFxyXG4gICAgJ2FwcC5wcm9maWxlJyxcclxuICAgICdhcHAudXNlclNlcnZpY2UnLFxyXG4gICAgJ2FwcC50cmFja1NlcnZpY2UnLFxyXG4gICAgJ2FwcC5tYXJrZXJQYXJzZXInLFxyXG4gICAgJ2FwcC5tYXAnLFxyXG4gICAgJ2FwcC5jb250ZW50JywgICAgXHJcbiAgICAnYXBwLnJvdGEnLFxyXG4gICAgJ29jLmxhenlMb2FkJyxcclxuICAgICd1aS5yb3V0ZXInLFxyXG4gICAgJ2xlYWZsZXQtZGlyZWN0aXZlJyxcclxuICAgICduZ0F1dG9jb21wbGV0ZSdcclxuICBdKVxyXG4gIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJywnJGxvZ1Byb3ZpZGVyJywnJG9jTGF6eUxvYWRQcm92aWRlcicsJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsJGNvbXBpbGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH0pO1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxwcm9maWxlLWRpcmVjdGl2ZT48L3Byb2ZpbGUtZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwcm9maWxlU3RhdGUpO1xyXG4gIH1dKVxyXG4gIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlKSB7XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICByZXR1cm4gZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgICByZXR1cm4gdXNlclNlcnZpY2UuZ2V0VXNlcigpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgIGlmIChyZXNwb25kLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSBcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gcmVzcG9uZC5kYXRhLnVzZXI7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuZmxhZ0xvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIH0pKCk7IFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbnRlbnQnLCBbJ2FwcC5oZWFkZXInLCAnYXBwLmZvb3RlcicsJ3VpLnJvdXRlciddKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICAgICB2YXIgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnZGVmYXVsdFN0YXRlJywgXHJcbiAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9sYW5kaW5nL2xhbmRpbmcuaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGRlZmF1bHRTdGF0ZSk7XHJcbiAgICB9KVxyXG4gIFxyXG59KSgpOyIsIiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGEnLCBbJ2FwcC5sYXlvdXQnLCAnYXBwLmxheW91dERldGFpbCcsICdhcHAucm90YWVrbGUnLCAndWkucm91dGVyJ10pXHJcbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXlvdXRTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdsYXlvdXQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2Eve3Rlcm19P2xhdFNXJmxuZ1NXJmxhdE5FJmxuZ05FJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxsYXlvdXQtZGlyZWN0aXZlPjwvbGF5b3V0LWRpcmVjdGl2ZT4nLFxyXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsYXlvdXRTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGF5b3V0RGV0YWlsU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGF5b3V0RGV0YWlsJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhLzppZCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48bGF5b3V0LWRldGFpbC1kaXJlY3RpdmU+PC9sYXlvdXQtZGV0YWlsLWRpcmVjdGl2ZT4nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxheW91dERldGFpbFN0YXRlKTtcclxuIFxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjaycsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YWVrbGUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUvcm90YWVrbGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncm90YUVrbGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3JvdGFFa2xlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tMb2NhdGlvblN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmxvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rb251bScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5odG1sJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0xvY2F0aW9uU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTWV0YVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLm1ldGEnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2JpbGdpJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLm1ldGEvcm90YWVrbGUubWV0YS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTWV0YVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ltYWdlU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Jlc2ltbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmltYWdlL3JvdGFla2xlLmltYWdlLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tJbWFnZVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0dQWFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmdweCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZ3B4JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmdweC9yb3RhZWtsZS5ncHguaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0dQWFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ZpbmlzaFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmZpbmlzaCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva2F5ZGV0JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmZpbmlzaC9yb3RhZWtsZS5maW5pc2guaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ZpbmlzaFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mb290ZXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2Zvb3RlckRpcmVjdGl2ZScsIGZvb3RlckRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBmb290ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2Zvb3Rlci9mb290ZXIuaHRtbCcsXHJcbiAgICB9O1xyXG4gIFxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG59KSgpOyBcclxuIFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5oZWFkZXInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdoZWFkbGluZURpcmVjdGl2ZScsIGhlYWRsaW5lRGlyZWN0aXZlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoZWFkbGluZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvaGVhZGxpbmUvaGVhZGxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogSGVhZGxpbmVDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIEhlYWRsaW5lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJyRpbnRlcnZhbCcsICckcSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRsaW5lQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJGludGVydmFsLCAkcSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuICAgICAgICB2bS5zZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdGVybTogdm0uZWxtYVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiNBdXRvY29tcGxldGVcIikuZm9jdXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjQXV0b2NvbXBsZXRlXCIpLm9mZnNldCgpLnRvcCAtIDgwXHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgJGludGVydmFsKGNoYW5nZUJnLCA2NTAwKTtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAxO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VCZygpIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgIC8vcmVzdGFydFxyXG4gICAgICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAvLyB2YXIgaW1nVXJsID0gXCJ1cmwoJy4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGcnKVwiO1xyXG4gICAgICAgICAgICB2YXIgaW1nVXJsID0gXCIuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnXCI7XHJcblxyXG4gICAgICAgICAgICBwcmVsb2FkKGltZ1VybCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCIuaGVhZGxpbmVcIilcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ1cmwoXCIrIGltZ1VybCArXCIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZWxvYWQodXJsKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgIGltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1hZ2UuY29tcGxldGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2MgY2FyZCBjb21wb25lbnQgXHJcbiogQGV4YW1wbGUgPGNhcmQ+PC9jYXJkPlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY2FyZCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnY2FyZERpcmVjdGl2ZScsIGNhcmREaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gY2FyZERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9jYXJkL2NhcmQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICc8JyxcclxuICAgICAgICAgICAgc3VtbWFyeTogJzwnLFxyXG4gICAgICAgICAgICBvd25lcjonPCcsXHJcbiAgICAgICAgICAgIGltZ1NyYzonPCcsXHJcbiAgICAgICAgICAgIGlkOiAnPCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiBDYXJkQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENhcmRDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpczsgXHJcbiAgICAvLyB2bS5pbWdTcmMgPSB2bS5pbWdTcmMuc3BsaXQoJ2NsaWVudCcpWzFdO1xyXG59IFxyXG4iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubG9naW4nLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xvZ2luRGlyZWN0aXZlJywgbG9naW5EaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gbG9naW5EaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL2xvZ2luL2xvZ2luLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBGb290ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiAqIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuICogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4gKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm5hdmJhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbmF2YmFyRGlyZWN0aXZlJywgbmF2YmFyRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIG5hdmJhckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbmF2YmFyL25hdmJhci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogbmF2YmFyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpOyBcclxuXHJcbiAgICB2bS5vcGVuTmF2ID0gb3Blbk5hdjtcclxuICAgIHZtLmNsb3NlTmF2ID0gY2xvc2VOYXY7XHJcblxyXG5cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gb3Blbk5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ICA9IFwiMCVcIjtcclxuICAgIH1cclxuXHJcblxyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3Byb2ZpbGVEaXJlY3RpdmUnLCBwcm9maWxlRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBwcm9maWxlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5cclxuXHJcbnByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAndXNlclNlcnZpY2UnLCAndHJhY2tTZXJ2aWNlJywgJ21hcmtlclBhcnNlciddO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UsdHJhY2tTZXJ2aWNlLG1hcmtlclBhcnNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yZWdpc3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncmVnaXN0ZXJEaXJlY3RpdmUnLCByZWdpc3RlckRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiByZWdpc3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvcmVnaXN0ZXIvcmVnaXN0ZXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IHJlZ2lzdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiAqIEBkZXNjIE1haW4gbGF5b3V0IGZvciBhcHBsaWNhdGlvblxyXG4gKiBAZXhhbXBsZSA8bGF5b3V0LWRpcmVjdGl2ZT48L2xheW91dC1kaXJlY3RpdmU+XHJcbiAqL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubGF5b3V0JywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsYXlvdXREaXJlY3RpdmUnLCBsYXlvdXREaXJlY3RpdmUpXHJcblxyXG5mdW5jdGlvbiBsYXlvdXREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL2xheW91dC9sYXlvdXQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IExheW91dENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuTGF5b3V0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsXHJcbiAgICAnbWFya2VyUGFyc2VyJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldE1hcEV2ZW50cycsICdsZWFmbGV0RGF0YScsICckbG9jYXRpb24nLCAnJHdpbmRvdydcclxuXTtcclxuXHJcbmZ1bmN0aW9uIExheW91dENvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLFxyXG4gICAgbWFya2VyUGFyc2VyLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0TWFwRXZlbnRzLCBsZWFmbGV0RGF0YSwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICB2bS5nZXRUcmFjayA9IGdldFRyYWNrO1xyXG4gICAgdm0ubWFwQXV0b1JlZnJlc2ggPSB0cnVlO1xyXG4gICAgdm0ub3Blbk1hcCA9IG9wZW5NYXA7XHJcbiAgICB2bS5wYXJhbXMgPSB7XHJcbiAgICAgICAgbGF0TkU6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxhdE5FKSxcclxuICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgIGxhdFNXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRTVyksXHJcbiAgICAgICAgbG5nU1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxuZ1NXKSxcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIGlmICh2bS5wYXJhbXMubGF0TkUgJiYgdm0ucGFyYW1zLmxuZ05FICYmIHZtLnBhcmFtcy5sYXRTVyAmJiB2bS5wYXJhbXMubG5nU1cpIHtcclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0TkUsIHZtLnBhcmFtcy5sbmdORV0sXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRTVywgdm0ucGFyYW1zLmxuZ1NXXSxcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLmdldFRyYWNrKHZtLnBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgICB2bS50cmFja3MuZGF0YSA9IHJlc3BvbmQuZGF0YTtcclxuICAgICAgICAgICAgaWYgKHZtLnRyYWNrcy5kYXRhID09IFtdKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmtlclBhcnNlci5qc29uVG9NYXJrZXJBcnJheSh2bS50cmFja3MuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnMgPSBtYXJrZXJQYXJzZXIudG9PYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IEwuZ2VvSnNvbih2bS50cmFja3MuZGF0YSkuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG5cclxuICAgIHZtLmNoYW5nZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgLy8gdmFyIHN3YXAgPSBtYXJrZXIuaWNvbjtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbiA9IG1hcmtlci5pY29uX3N3YXA7XHJcbiAgICAgICAgLy8gbWFya2VyLmljb25fc3dhcCA9IHN3YXA7XHJcbiAgICAgICAgLy8gaWYgKG1hcmtlci5mb2N1cylcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRsb2NhdGlvbi5zZWFyY2goKS5sYXRORSA9IDIwKTtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzUxMkRBOCcsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnJlbW92ZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgbWFya2VyLmljb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyMwMDRjMDAnLFxyXG4gICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS56b29tTWFya2VyID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIHZhciBsYXRMbmdzID0gW1xyXG4gICAgICAgICAgICBbbWFya2VyLmxhdCwgbWFya2VyLmxuZ11cclxuICAgICAgICBdO1xyXG4gICAgICAgIHZhciBtYXJrZXJCb3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhsYXRMbmdzKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhtYXJrZXJCb3VuZHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLm1hcEV2ZW50cyA9IGxlYWZsZXRNYXBFdmVudHMuZ2V0QXZhaWxhYmxlTWFwRXZlbnRzKCk7XHJcblxyXG4gICAgZm9yICh2YXIgayBpbiB2bS5tYXBFdmVudHMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh2bS5tYXBFdmVudHMpO1xyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci4nICsgdm0ubWFwRXZlbnRzW2tdO1xyXG4gICAgICAgICRzY29wZS4kb24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdmVyJykge1xyXG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW91dCcpIHtcclxuICAgICAgICAgICAgICAgIHZtLnJlbW92ZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXAubW92ZWVuZCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFzZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHZhciBtYXBFdmVudCA9ICdsZWFmbGV0RGlyZWN0aXZlTWFwLm1vdmVlbmQnO1xyXG5cclxuICAgICRzY29wZS4kb24obWFwRXZlbnQsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3MubGVhZmxldE9iamVjdCk7XHJcbiAgICAgICAgaWYgKHZtLm1hcEF1dG9SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXJrZXJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ucGFyYW1zLmxhdE5FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ucGFyYW1zLmxuZ05FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ucGFyYW1zLmxhdFNXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ucGFyYW1zLmxuZ1NXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gNTAuNDI5NTE3OTQ3O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gNDkuNzkwMDM5MDYyO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gMjQuMTI2NzAxOTU4O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gMTkuNzc1MzkwNjI1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcuZGF0YS12aXonKS53aWR0aCgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdE5FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ1NXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9KVxyXG4gICAgJHNjb3BlLiRvbignJHJvdXRlVXBkYXRlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFsZXJ0KDEpXHJcbiAgICB9KTtcclxuXHJcbiAgICB2bS50b2dnbGVUaXRsZSA9ICcgSGFyaXRhJztcclxuICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgdm0ubWFwQWN0aXZlID0gIXZtLm1hcEFjdGl2ZTtcclxuICAgICAgICAkKCcuZGF0YS12aXonKS50b2dnbGVDbGFzcygnbWFwLW9wZW4nKTtcclxuICAgICAgICAkKCcubWFwLWF1dG8tcmVmcmVzaCcpLnRvZ2dsZUNsYXNzKCdyZWZyZXNoLW9wZW4nKTtcclxuICAgICAgICAodm0udG9nZ2xlVGl0bGUgPT0gJyBIYXJpdGEnID8gdm0udG9nZ2xlVGl0bGUgPSAnIExpc3RlJyA6IHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnIClcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcuZGF0YS12aXonKS53aWR0aCgpKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0iLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubGF5b3V0RGV0YWlsJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsYXlvdXREZXRhaWxEaXJlY3RpdmUnLCBsYXlvdXREZXRhaWxEaXJlY3RpdmUpXHJcblxyXG5mdW5jdGlvbiBsYXlvdXREZXRhaWxEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL2xheW91dC5kZXRhaWwvbGF5b3V0LmRldGFpbC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogTGF5b3V0RGV0YWlsQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5MYXlvdXREZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnXTtcclxuXHJcbmZ1bmN0aW9uIExheW91dERldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja0RldGFpbCA9IHt9O1xyXG4gICAgdm0uY2VudGVyID0ge307XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0cmFja1NlcnZpY2UuZ2V0VHJhY2tEZXRhaWwoJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjLnNwbGl0KCdjbGllbnQnKVsxXS5yZXBsYWNlQWxsKCdcXFxcJywgJy8nKVxyXG4gICAgICAgICAgICB2bS5jZW50ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIHpvb206IDEyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codm0uY2VudGVyKTtcclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3B4ID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5ncHg7IC8vIFVSTCB0byB5b3VyIEdQWCBmaWxlIG9yIHRoZSBHUFggaXRzZWxmXHJcbiAgICAgICAgICAgICAgICBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgfSkuYWRkVG8obWFwKTsgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcblxyXG5cclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhZWtsZScsIFsnYXBwLm1hcCcsICduZ0F1dG9jb21wbGV0ZScsICdhcHAudHJhY2tTZXJ2aWNlJywgJ25nRmlsZVVwbG9hZCcsICdhbmd1bGFyLWxhZGRhJ10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3JvdGFFa2xlQ29udHJvbGxlcicsIHJvdGFFa2xlQ29udHJvbGxlcilcclxuXHJcblxyXG4gICAgcm90YUVrbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAncmV2ZXJzZUdlb2NvZGUnLCAndHJhY2tTZXJ2aWNlJywgJyRzdGF0ZScsICdVcGxvYWQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3RhRWtsZUNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCBtYXBDb25maWdTZXJ2aWNlLCByZXZlcnNlR2VvY29kZSwgdHJhY2tTZXJ2aWNlLCAkc3RhdGUsIFVwbG9hZCkge1xyXG4gICAgICAgIC8vICRvY0xhenlMb2FkLmxvYWQoJy4uLy4uL3NlcnZpY2VzL21hcC9tYXAuYXV0b2NvbXBsZXRlLmpzJyk7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICAgICAgdm0uY2VudGVyID0gbWFwQ29uZmlnU2VydmljZS5nZXRDZW50ZXIoKTtcclxuICAgICAgICB2bS5sb2NhdGlvbjtcclxuXHJcbiAgICAgICAgLy9UcmFjayBwYXJhbWV0ZXJzXHJcbiAgICAgICAgdm0ub3duZWRCeSA9ICRyb290U2NvcGUudXNlci5faWQ7XHJcbiAgICAgICAgdm0uaW1nX3NyYyA9IFwic3JjXCI7XHJcbiAgICAgICAgdm0uc3VtbWFyeTtcclxuICAgICAgICB2bS5hbHRpdHVkZTtcclxuICAgICAgICB2bS5kaXN0YW5jZTtcclxuICAgICAgICB2bS5uYW1lID0gJyc7XHJcbiAgICAgICAgdm0uY29vcmRpbmF0ZXMgPSBbXTtcclxuICAgICAgICB2bS51cGxvYWRHUFggPSB1cGxvYWRHUFg7XHJcbiAgICAgICAgdm0udXBsb2FkUGljID0gdXBsb2FkUGljO1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ2luTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHZtLmFkZFRyYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0cmFja1NlcnZpY2UuYWRkVHJhY2sodm0pLnRoZW4oZnVuY3Rpb24gKGFkZFRyYWNrUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0Jyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChhZGRUcmFja0Vycm9yKSB7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkUGljKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvcGhvdG9zLycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmltZ19zcmMgPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5ncHgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEdQWChmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL2dweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdweCA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmZpbmlzaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHtcclxuICAgICAgICAgICAgbWFya2Vyczoge1xyXG4gICAgICAgICAgICAgICAgbWFpbk1hcmtlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdDogdm0uY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2bS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJhxZ9rYSBiaXIgbm9rdGF5YSB0xLFrbGF5YXJhayBrYXlkxLFyLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oXCJsZWFmbGV0RGlyZWN0aXZlTWFwLmNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgbGVhZkV2ZW50ID0gYXJncy5sZWFmbGV0RXZlbnQ7XHJcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlLmdlb2NvZGVMYXRsbmcobGVhZkV2ZW50LmxhdGxuZy5sYXQsIGxlYWZFdmVudC5sYXRsbmcubG5nKS50aGVuKGZ1bmN0aW9uIChnZW9jb2RlU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvY2F0aW9uID0gZ2VvY29kZVN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxhdCA9IGxlYWZFdmVudC5sYXRsbmcubGF0O1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxuZyA9IGxlYWZFdmVudC5sYXRsbmcubG5nO1xyXG4gICAgICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtsZWFmRXZlbnQubGF0bG5nLmxuZywgbGVhZkV2ZW50LmxhdGxuZy5sYXRdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIiLCIvKipcclxuICogQGRlc2MgU2VydmljZXMgdGhhdCBjb252ZXJ0cyBnZW9qc29uIGZlYXR1cmVzIHRvIG1hcmtlcnMgZm9yIGhhbmRsaW5nIGxhdGVyXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFya2VyUGFyc2VyKCRxKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRqc29uVG9NYXJrZXJBcnJheToganNvblRvTWFya2VyQXJyYXksXHJcbiAgICAgICAgdG9PYmplY3Q6IHRvT2JqZWN0XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHQvLyBjb252ZXJ0IGZlYXR1cmUgZ2VvanNvbiB0byBhcnJheSBvZiBtYXJrZXJzXHJcblx0ZnVuY3Rpb24ganNvblRvTWFya2VyQXJyYXkodmFsKSB7XHJcbiAgICAgICAgdmFyIGRlZmVyZWQgPSAkcS5kZWZlcigpOyAvLyBkZWZlcmVkIG9iamVjdCByZXN1bHQgb2YgYXN5bmMgb3BlcmF0aW9uXHJcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7IFxyXG4gICAgICAgICAgICB2YXIgbWFyayA9IHtcclxuICAgICAgICAgICAgICAgIGxheWVyOiBcInJvdGFsYXJcIixcclxuICAgICAgICAgICAgICAgIGxhdDogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgaWNvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDA0YzAwJyxcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIGljb25fc3dhcCA6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbG9yOiAnIzUxMkRBOCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB2YWxbaV0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYWx0aXR1ZGVcIiA6IHZhbFtpXS5wcm9wZXJ0aWVzLmFsdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzdGFuY2VcIiA6IHZhbFtpXS5wcm9wZXJ0aWVzLmRpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VtbWFyeVwiIDogdmFsW2ldLnByb3BlcnRpZXMuc3VtbWFyeSxcclxuICAgICAgICAgICAgICAgICAgICBcIm93bmVyXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm93bmVkQnksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWdfc3JjXCI6dmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChtYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob3V0cHV0KSB7XHJcbiAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAvLyAgICAgZGVmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xyXG4gICAgICAgIHZhciBydiA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSAhPT0gdW5kZWZpbmVkKSBydltpXSA9IGFycmF5W2ldO1xyXG4gICAgICAgIHJldHVybiBydjsgICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyXHJcbi5tb2R1bGUoJ2FwcC5tYXJrZXJQYXJzZXInLCBbXSlcclxuLmZhY3RvcnkoJ21hcmtlclBhcnNlcicsIG1hcmtlclBhcnNlcik7IiwiZnVuY3Rpb24gdHJhY2tTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIGVuZHBvaW50ID0gJ2h0dHA6bG9jYWxob3N0OjgwODAvJ1xyXG5cclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFRyYWNrOiBnZXRUcmFjayxcclxuXHRcdGFkZFRyYWNrOiBhZGRUcmFjayxcclxuXHRcdGdldFRyYWNrRGV0YWlsOmdldFRyYWNrRGV0YWlsLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrKHBhcmFtcykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcz9sYXRORT0nKyBwYXJhbXMubGF0TkUrJyZsbmdORT0nK3BhcmFtcy5sbmdORSArJyZsYXRTVz0nK3BhcmFtcy5sYXRTVyArJyZsbmdTVz0nK3BhcmFtcy5sbmdTVyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuXHRcdFx0fSxcclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2tEZXRhaWwoaWQpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MvJytpZCxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBhZGRUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MnLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGRhdGE6ICQucGFyYW0oe1xyXG5cdFx0XHRcdFwibmFtZVwiOiB0cmFjay5uYW1lLFxyXG5cdFx0XHRcdFwiZGlzdGFuY2VcIjogdHJhY2suZGlzdGFuY2UsXHJcblx0XHRcdFx0XCJhbHRpdHVkZVwiOiB0cmFjay5hbHRpdHVkZSxcclxuXHRcdFx0XHRcInN1bW1hcnlcIjogdHJhY2suc3VtbWFyeSxcclxuXHRcdFx0XHRcImltZ19zcmNcIjogdHJhY2suaW1nX3NyYyxcclxuXHRcdFx0XHRcImNvb3JkaW5hdGVzXCI6IHRyYWNrLmNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdFwib3duZWRCeVwiOiB0cmFjay5vd25lZEJ5LFxyXG5cdFx0XHRcdFwiZ3B4XCI6IHRyYWNrLmdweCxcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcbn1cclxuYW5ndWxhclxyXG5cdC5tb2R1bGUoJ2FwcC50cmFja1NlcnZpY2UnLCBbXSlcclxuXHQuZmFjdG9yeSgndHJhY2tTZXJ2aWNlJywgdHJhY2tTZXJ2aWNlKTsiLCJmdW5jdGlvbiB1c2VyU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VXNlcjogZ2V0VXNlcixcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICBcdHJldHVybiAkaHR0cCh7XHJcbiAgICBcdFx0bWV0aG9kOiAnR0VUJyxcclxuICAgIFx0XHR1cmw6ICdhcGkvcHJvZmlsZSdcclxuICAgIFx0fSlcclxuICAgIH07IFxyXG59IFxyXG5hbmd1bGFyXHJcbi5tb2R1bGUoJ2FwcC51c2VyU2VydmljZScsIFtdKVxyXG4uZmFjdG9yeSgndXNlclNlcnZpY2UnLCB1c2VyU2VydmljZSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEEgZGlyZWN0aXZlIGZvciBhZGRpbmcgZ29vZ2xlIHBsYWNlcyBhdXRvY29tcGxldGUgdG8gYSB0ZXh0IGJveFxyXG4gKiBnb29nbGUgcGxhY2VzIGF1dG9jb21wbGV0ZSBpbmZvOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9wbGFjZXNcclxuICpcclxuICogU2ltcGxlIFVzYWdlOlxyXG4gKlxyXG4gKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuZy1hdXRvY29tcGxldGU9XCJyZXN1bHRcIi8+XHJcbiAqXHJcbiAqIGNyZWF0ZXMgdGhlIGF1dG9jb21wbGV0ZSB0ZXh0IGJveCBhbmQgZ2l2ZXMgeW91IGFjY2VzcyB0byB0aGUgcmVzdWx0XHJcbiAqXHJcbiAqICAgKyBgbmctYXV0b2NvbXBsZXRlPVwicmVzdWx0XCJgOiBzcGVjaWZpZXMgdGhlIGRpcmVjdGl2ZSwgJHNjb3BlLnJlc3VsdCB3aWxsIGhvbGQgdGhlIHRleHRib3ggcmVzdWx0XHJcbiAqXHJcbiAqXHJcbiAqIEFkdmFuY2VkIFVzYWdlOlxyXG4gKlxyXG4gKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuZy1hdXRvY29tcGxldGU9XCJyZXN1bHRcIiBkZXRhaWxzPVwiZGV0YWlsc1wiIG9wdGlvbnM9XCJvcHRpb25zXCIvPlxyXG4gKlxyXG4gKiAgICsgYG5nLWF1dG9jb21wbGV0ZT1cInJlc3VsdFwiYDogc3BlY2lmaWVzIHRoZSBkaXJlY3RpdmUsICRzY29wZS5yZXN1bHQgd2lsbCBob2xkIHRoZSB0ZXh0Ym94IGF1dG9jb21wbGV0ZSByZXN1bHRcclxuICpcclxuICogICArIGBkZXRhaWxzPVwiZGV0YWlsc1wiYDogJHNjb3BlLmRldGFpbHMgd2lsbCBob2xkIHRoZSBhdXRvY29tcGxldGUncyBtb3JlIGRldGFpbGVkIHJlc3VsdDsgbGF0bG5nLiBhZGRyZXNzIGNvbXBvbmVudHMsIGV0Yy5cclxuICpcclxuICogICArIGBvcHRpb25zPVwib3B0aW9uc1wiYDogb3B0aW9ucyBwcm92aWRlZCBieSB0aGUgdXNlciB0aGF0IGZpbHRlciB0aGUgYXV0b2NvbXBsZXRlIHJlc3VsdHNcclxuICpcclxuICogICAgICArIG9wdGlvbnMgPSB7XHJcbiAqICAgICAgICAgICB0eXBlczogdHlwZSwgICAgICAgIHN0cmluZywgdmFsdWVzIGNhbiBiZSAnZ2VvY29kZScsICdlc3RhYmxpc2htZW50JywgJyhyZWdpb25zKScsIG9yICcoY2l0aWVzKSdcclxuICogICAgICAgICAgIGJvdW5kczogYm91bmRzLCAgICAgZ29vZ2xlIG1hcHMgTGF0TG5nQm91bmRzIE9iamVjdFxyXG4gKiAgICAgICAgICAgY291bnRyeTogY291bnRyeSAgICBzdHJpbmcsIElTTyAzMTY2LTEgQWxwaGEtMiBjb21wYXRpYmxlIGNvdW50cnkgY29kZS4gZXhhbXBsZXM7ICdjYScsICd1cycsICdnYidcclxuICogICAgICAgICB9XHJcbiAqXHJcbiAqXHJcbiAqL1xyXG5cclxuYW5ndWxhci5tb2R1bGUoIFwibmdBdXRvY29tcGxldGVcIiwgW10pXHJcbiAgLmRpcmVjdGl2ZSgnbmdBdXRvY29tcGxldGUnLCBmdW5jdGlvbigkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIGRldGFpbHM6ICc9JyxcclxuICAgICAgICBuZ0F1dG9jb21wbGV0ZTogJz0nLFxyXG4gICAgICAgIG9wdGlvbnM6ICc9J1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBtb2RlbCkge1xyXG5cclxuICAgICAgICAvL29wdGlvbnMgZm9yIGF1dG9jb21wbGV0ZVxyXG4gICAgICAgIHZhciBvcHRzXHJcblxyXG4gICAgICAgIC8vY29udmVydCBvcHRpb25zIHByb3ZpZGVkIHRvIG9wdHNcclxuICAgICAgICB2YXIgaW5pdE9wdHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIG9wdHMgPSB7fVxyXG4gICAgICAgICAgaWYgKHNjb3BlLm9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLm9wdGlvbnMudHlwZXMpIHtcclxuICAgICAgICAgICAgICBvcHRzLnR5cGVzID0gW11cclxuICAgICAgICAgICAgICBvcHRzLnR5cGVzLnB1c2goc2NvcGUub3B0aW9ucy50eXBlcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucy5ib3VuZHMpIHtcclxuICAgICAgICAgICAgICBvcHRzLmJvdW5kcyA9IHNjb3BlLm9wdGlvbnMuYm91bmRzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNjb3BlLm9wdGlvbnMuY291bnRyeSkge1xyXG4gICAgICAgICAgICAgIG9wdHMuY29tcG9uZW50UmVzdHJpY3Rpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY291bnRyeTogc2NvcGUub3B0aW9ucy5jb3VudHJ5XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluaXRPcHRzKClcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgbmV3IGF1dG9jb21wbGV0ZVxyXG4gICAgICAgIC8vcmVpbml0aWFsaXplcyBvbiBldmVyeSBjaGFuZ2Ugb2YgdGhlIG9wdGlvbnMgcHJvdmlkZWRcclxuICAgICAgICB2YXIgbmV3QXV0b2NvbXBsZXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzY29wZS5nUGxhY2UgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLkF1dG9jb21wbGV0ZShlbGVtZW50WzBdLCBvcHRzKTtcclxuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKHNjb3BlLmdQbGFjZSwgJ3BsYWNlX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgICAgICAgaWYgKHNjb3BlLmRldGFpbHMpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmRldGFpbHMgPSBzY29wZS5nUGxhY2UuZ2V0UGxhY2UoKTtcclxuLy8gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBzY29wZS5uZ0F1dG9jb21wbGV0ZSA9IGVsZW1lbnQudmFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3QXV0b2NvbXBsZXRlKClcclxuXHJcbiAgICAgICAgLy93YXRjaCBvcHRpb25zIHByb3ZpZGVkIHRvIGRpcmVjdGl2ZVxyXG4gICAgICAgIHNjb3BlLndhdGNoT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHJldHVybiBzY29wZS5vcHRpb25zXHJcbiAgICAgICAgfTtcclxuICAgICAgICBzY29wZS4kd2F0Y2goc2NvcGUud2F0Y2hPcHRpb25zLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpbml0T3B0cygpXHJcbiAgICAgICAgICBuZXdBdXRvY29tcGxldGUoKVxyXG4gICAgICAgICAgZWxlbWVudFswXS52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgc2NvcGUubmdBdXRvY29tcGxldGUgPSBlbGVtZW50LnZhbCgpO1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pOyIsImZ1bmN0aW9uIG1hcENvbmZpZ1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgZ2V0TGF5ZXI6IGdldExheWVyLFxyXG4gICAgICAgIGdldENlbnRlcjogZ2V0Q2VudGVyLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvdmVybGF5czoge1xyXG4gICAgICAgICAgICByb3RhbGFyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ3JvdXAnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ1JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxheWVycztcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q2VudGVyKCkge1xyXG4gICAgICAgIHZhciBjZW50ZXIgPSB7XHJcbiAgICAgICAgICAgIGxhdDogMzkuOTAzMjkxOCxcclxuICAgICAgICAgICAgbG5nOiAzMi42MjIzMzk2LFxyXG4gICAgICAgICAgICB6b29tOiA2XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubWFwJywgW10pXHJcbiAgICAuZmFjdG9yeSgnbWFwQ29uZmlnU2VydmljZScsIG1hcENvbmZpZ1NlcnZpY2UpOyIsImZ1bmN0aW9uIGdlb2NvZGUoJHEpIHtcclxuICByZXR1cm4geyBcclxuICAgIGdlb2NvZGVBZGRyZXNzOiBmdW5jdGlvbihhZGRyZXNzKSB7XHJcbiAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiBhZGRyZXNzIH0sIGZ1bmN0aW9uIChyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICAgIC8vIHdpbmRvdy5maW5kTG9jYXRpb24ocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ2dlb2NvZGUnLCBnZW9jb2RlKTsiLCJmdW5jdGlvbiByZXZlcnNlR2VvY29kZSgkcSwgJGh0dHApIHtcclxuICAgIHZhciBvYmogPSB7fTtcclxuICAgIG9iai5nZW9jb2RlTGF0bG5nID0gZnVuY3Rpb24gZ2VvY29kZVBvc2l0aW9uKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICB2YXIgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGxhdExuZzogbGF0bG5nXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZXMgJiYgcmVzcG9uc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlc1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdyZXZlcnNlR2VvY29kZScsIHJldmVyc2VHZW9jb2RlKTsiXX0=
