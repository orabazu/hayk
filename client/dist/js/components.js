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
                var latSW = item.bbox.lowerCorner.split(' ')[1];
                var lngSW = item.bbox.lowerCorner.split(' ')[0];
                var latNE = item.bbox.upperCorner.split(' ')[1];
                var lngNE = item.bbox.upperCorner.split(' ')[0];
                
                a.href = '/a/' + item.name +
                    '?latSW=' + latSW.toString() +
                    '&lngSW=' + lngSW.toString() +
                    '&latNE=' + latNE.toString() +
                    '&lngNE=' + lngNE.toString();
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

            var addTrackCampState = {
                name: 'addtrack.camp',
                url: '/kamp',
                templateUrl: '../../components/rota/rotaekle.kamp/rotaekle.kamp.html'
            }
            $stateProvider.state(addTrackCampState);

            var addTrackSeasonState = {
                name: 'addtrack.season',
                url: '/sezon',
                templateUrl: '../../components/rota/rotaekle.season/rotaekle.season.html'
            }
            $stateProvider.state(addTrackSeasonState);

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
        if(angular.isUndefinedOrNull($rootScope.user) || angular.isUndefinedOrNull($rootScope.user._id)){
            // $state.go('login');
            // break;            
        }
        // vm.ownedBy = $rootScope.user._id;
        vm.img_src = "src";
        vm.summary;
        vm.altitude;
        vm.distance;
        vm.name = '';
        vm.coordinates = [];
        vm.uploadGPX = uploadGPX;
        vm.uploadPic = uploadPic;


        $scope.loginLoading = true;
        vm.toggleState = true;
        vm.togglePanel = function(){
            $('.next-step-panel .panel-body').toggle('hide');
            // alert(1);
        }

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
    vm.changeImg = changeImg;
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
                // map.setZoom(map.getZoom() - 1);

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

        // console.log($location.search().latNE = 20);

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
            color: '#B7A4E3',
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


    //log events for marker objects
    for (var k in vm.mapEvents) {
        //  console.log(vm.mapEvents);
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function (event, args) {
             console.log(event);
            if (event.name == 'leafletDirectiveMarker.mouseover') {
                // vm.changeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMarker.mouseout') {
                // vm.removeIcon(vm.markers[args.modelName]);
                // vm.markers[args.modelName].focus = true;
            }else if (event.name == 'leafletDirectiveMarker.click') {
                //  vm.removeIcon(vm.markers[args.modelName]);
                //  vm.markers[args.modelName].focus = true;
            }
        });
    }
    var mapEvent = 'leafletDirectiveMap.dragend';

    $scope.$on(mapEvent, function (event, args) {
        updateMap(args);
    });

    var mapEvent2 = 'leafletDirectiveMap.zoomend';

    $scope.$on(mapEvent2, function (event, args) {
        updateMap(args);
    });

    function updateMap(args) {
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
    }

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


    function changeImg() {
        angular.forEach(angular.element('.not-found-img'), function (val, key) {
            val.classList.toggle('hide');
        })
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
                if(window.mobilecheck())
                    map.scrollWheelZoom.disable();
                // map.dragging.disable();

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
                    console.log(e.target.getBounds())
                    var newBounds = {
                        _northEast: {
                            lat: e.target.getBounds()._northEast.lat + 0.2,
                            lng: e.target.getBounds()._northEast.lng + 0.2
                        },
                        _southWest: {
                            lat: e.target.getBounds()._southWest.lat - 0.2,
                            lng: e.target.getBounds()._southWest.lng - 0.2
                        }
                    };

                    var southWest = L.latLng(newBounds._northEast.lat, newBounds._northEast.lng),
                        northEast = L.latLng(newBounds._southWest.lat, newBounds._southWest.lng),
                        bounds = L.latLngBounds(southWest, northEast);

                    map.setMaxBounds(bounds);
                    map._layersMinZoom=10
                });
                g.addTo(map);
            });

        })

    }


    vm.layers = mapConfigService.getLayerForDetail();
    var controls = {
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
        toObject: toObject,
        markerContent: null,
    };

    return service;
    // convert feature geojson to array of markers
    function jsonToMarkerArray(val) {
        var defered = $q.defer(); // defered object result of async operation
        var output = [];
        for (var i = 0; i < val.length; i++) {

            service.markerContent = '	<div class="card card-on-map">' +
                '<div class="card-image-container">' +
                '<div class="card-image-cover">' +
                '<img data-ng-src="' + val[i].properties.img_src + '" class="img-fluid" alt=""></div>' +
                '<a><div class="mask waves-effect waves-light"></div></a>' +
                '</div>' +
                '<div class="card-block">' +
                '<h4 class="card-title font-size-16"><a href="rota/'+ val[i]._id+'" target="_blank">'+val[i].properties.name+'</a></h4>' +
                '</div>' +
                '</div>';
            var mark = {
                layer: "rotalar",
                lat: val[i].geometry.coordinates[1],
                lng: val[i].geometry.coordinates[0],
                focus: false,
                // message: val[i].properties.name,
                message: service.markerContent.toString(),
                icon: {
                    type: 'makiMarker',
                    icon: 'park',
                    color: '#512DA8',
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
                    "altitude": val[i].properties.altitude,
                    "distance": val[i].properties.distance,
                    "summary": val[i].properties.summary,
                    "owner": val[i].properties.ownedBy,
                    "img_src": val[i].properties.img_src,
                }
            }
            output.push(mark);
        }
        if (output) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJyb3RhZWtsZS9yb3RhZWtsZS5qcyIsInJvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmpzIiwicm90YWxhci9yb3RhbGFyLmpzIiwicm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuanMiLCJtYXJrZXJwYXJzZXIuanMiLCJ0cmFjay5qcyIsInVzZXIuanMiLCJ3ZWF0aGVyQVBJLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8sT0FBTyxL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QUN6QyxTQUFTLFFBQVE7WUFDYixRQUFRO1dBQ1QsU0FBUyxXQUFXO1lBQ25CLElBQUksYUFBYSxVQUFVLFNBQVMsR0FBRztnQkFDbkMsT0FBTyxTQUFTLFFBQVEsVUFBVSxHQUFHO21CQUNsQztnQkFDSCxPQUFPLFNBQVMsUUFBUTs7V0FFN0IsVUFBVSxLQUFLO1lBQ2QsT0FBTyxTQUFTLFFBQVE7O1FBRTVCLE9BQU8sU0FBUzs7SUFFcEIsT0FBTzs7O0FBR1g7RUFDRSxPQUFPO0VBQ1AsUUFBUSxrQkFBa0IsZ0JBQWdCIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldC5zcGxpdChzZWFyY2gpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdlb2NvZGUtYXV0b2NvbXBsZXRlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICQodGhhdCkudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmVkaWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwczovL2dlb2NvZGUtbWFwcy55YW5kZXgucnUvMS54Lz9yZXN1bHRzPTUmYmJveD0yNC4xMjU5NzcsMzQuNDUyMjE4fjQ1LjEwOTg2Myw0Mi42MDE2MjAmZm9ybWF0PWpzb24mbGFuZz10cl9UUiZnZW9jb2RlPScgKyBxdWVyeSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm5hbWUgKyAnLCAnICsgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2xhdDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LlBvaW50LnBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEua2luZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdF90eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmJveDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmJvdW5kZWRCeS5FbnZlbG9wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGVzY3JpcHRpb24uaW5kZXhPZignVMO8cmtpeWUnKSA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHByZWRpY3Rpb25zICYmIHByZWRpY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVzdWx0cyA9ICQubWFwKHByZWRpY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnVuY3Rpb24gKHByZWRpY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZGVzdCA9IHByZWRpY3Rpb24ubmFtZSArIFwiLCBcIiArIHByZWRpY3Rpb24uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdCA9IGRlc3QucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2VzcyhwcmVkaWN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWZ0ZXJTZWxlY3Q6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIHZhciBsYXRTVyA9IGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuZ1NXID0gaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0TkUgPSBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBsbmdORSA9IGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSAnL2EvJyArIGl0ZW0ubmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJz9sYXRTVz0nICsgbGF0U1cudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdTVz0nICsgbG5nU1cudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsYXRORT0nICsgbGF0TkUudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdORT0nICsgbG5nTkUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSAnPHNwYW4gY2xhc3M9XCJpdGVtLWFkZHJlc3NcIj4nICsgaXRlbSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICBmaXRUb0VsZW1lbnQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoYXQpLm9uKCd0eXBlYWhlYWQ6Y2hhbmdlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICQodGhhdCkudmFsKGl0ZW0uZmluZCgnYT5zcGFuLml0ZW0tYWRkcmVzcycpLnRleHQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxud2luZG93Lm1vYmlsZWNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoZWNrID0gZmFsc2U7XHJcbiAgICAoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLCA0KSkpIGNoZWNrID0gdHJ1ZTtcclxuICAgIH0pKG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmEpO1xyXG4gICAgcmV0dXJuIGNoZWNrO1xyXG59O1xyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXHJcbiAgICAnYXBwLm5hdmJhcicsXHJcbiAgICAnYXBwLmxvZ2luJyxcclxuICAgICdhcHAucmVnaXN0ZXInLFxyXG4gICAgJ2FwcC5jYXJkJywgXHJcbiAgICAnYXBwLnByb2ZpbGUnLFxyXG4gICAgJ2FwcC51c2VyU2VydmljZScsXHJcbiAgICAnYXBwLnRyYWNrU2VydmljZScsXHJcbiAgICAnYXBwLm1hcmtlclBhcnNlcicsXHJcbiAgICAnYXBwLm1hcCcsXHJcbiAgICAnYXBwLmNvbnRlbnQnLCAgICBcclxuICAgICdhcHAucm90YScsXHJcbiAgICAnb2MubGF6eUxvYWQnLFxyXG4gICAgJ3VpLnJvdXRlcicsXHJcbiAgICAnbGVhZmxldC1kaXJlY3RpdmUnLFxyXG4gICAgJ2FwcC53ZWF0aGVyJyxcclxuICBdKVxyXG4gIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJywnJGxvZ1Byb3ZpZGVyJywnJG9jTGF6eUxvYWRQcm92aWRlcicsJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsJGNvbXBpbGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH0pO1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxwcm9maWxlLWRpcmVjdGl2ZT48L3Byb2ZpbGUtZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwcm9maWxlU3RhdGUpO1xyXG4gIH1dKVxyXG4gIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlKSB7XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICByZXR1cm4gZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgICByZXR1cm4gdXNlclNlcnZpY2UuZ2V0VXNlcigpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgIGlmIChyZXNwb25kLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSBcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gcmVzcG9uZC5kYXRhLnVzZXI7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuZmxhZ0xvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIH0pKCk7IFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbnRlbnQnLCBbJ2FwcC5oZWFkZXInLCAnYXBwLmZvb3RlcicsJ3VpLnJvdXRlciddKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICAgICB2YXIgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnZGVmYXVsdFN0YXRlJywgXHJcbiAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9sYW5kaW5nL2xhbmRpbmcuaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGRlZmF1bHRTdGF0ZSk7XHJcbiAgICB9KVxyXG4gIFxyXG59KSgpOyIsIiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGEnLCBbJ2FwcC5yb3RhbGFyJywgJ2FwcC5yb3RhbGFyRGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9hL3t0ZXJtfT9sYXRTVyZsbmdTVyZsYXRORSZsbmdORScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhcj48L3JvdGFsYXI+JyxcclxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocm90YWxhclN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByb3RhbGFyRGV0YWlsU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncm90YWxhckRldGFpbCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YS86aWQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHJvdGFsYXItZGV0YWlsPjwvcm90YWxhci1kZXRhaWw+J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyRGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrQ2FtcFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmNhbXAnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2thbXAnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUua2FtcC9yb3RhZWtsZS5rYW1wLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tDYW1wU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU2Vhc29uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suc2Vhc29uJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9zZXpvbicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5zZWFzb24vcm90YWVrbGUuc2Vhc29uLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tTZWFzb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tJbWFnZVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmltYWdlJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXNpbWxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5pbWFnZS9yb3RhZWtsZS5pbWFnZS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrSW1hZ2VTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tHUFhTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5ncHgnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2dweCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5ncHgvcm90YWVrbGUuZ3B4Lmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tHUFhTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tGaW5pc2hTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5maW5pc2gnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2theWRldCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5maW5pc2gvcm90YWVrbGUuZmluaXNoLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tGaW5pc2hTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZm9vdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdmb290ZXJEaXJlY3RpdmUnLCBmb290ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gZm9vdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgfTtcclxuICBcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxufSkoKTsgXHJcbiBcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuaGVhZGVyJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnaGVhZGxpbmVEaXJlY3RpdmUnLCBoZWFkbGluZURpcmVjdGl2ZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaGVhZGxpbmVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2hlYWRsaW5lL2hlYWRsaW5lLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEhlYWRsaW5lQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuICAgIH1cclxuXHJcbiAgICBIZWFkbGluZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICckaW50ZXJ2YWwnLCAnJHEnLCckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGxpbmVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkaW50ZXJ2YWwsICRxLCR3aW5kb3cpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiAgICAgICAgdm0uc2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3JvdGFsYXInLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtOiB2bS5lbG1hXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiI0F1dG9jb21wbGV0ZVwiKS5mb2N1cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNBdXRvY29tcGxldGVcIikub2Zmc2V0KCkudG9wIC0gODBcclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gd2luZG93LnNjcm9sbFggPSAwO1xyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuXHJcblxyXG4gICAgICAgICRpbnRlcnZhbChjaGFuZ2VCZywgNjUwMCk7XHJcblxyXG4gICAgICAgIHZhciBpID0gMTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlQmcoKSB7XHJcbiAgICAgICAgICAgIGlmIChpID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAvL3Jlc3RhcnRcclxuICAgICAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgLy8gdmFyIGltZ1VybCA9IFwidXJsKCcuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnJylcIjtcclxuICAgICAgICAgICAgdmFyIGltZ1VybCA9IFwiLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZ1wiO1xyXG5cclxuICAgICAgICAgICAgcHJlbG9hZChpbWdVcmwpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KFwiLmhlYWRsaW5lXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidXJsKFwiKyBpbWdVcmwgK1wiKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmVsb2FkKHVybCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltYWdlLmNvbXBsZXRlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4qIEBkZXNjIGNhcmQgY29tcG9uZW50IFxyXG4qIEBleGFtcGxlIDxjYXJkPjwvY2FyZD5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNhcmQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2NhcmREaXJlY3RpdmUnLCBjYXJkRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vY2FyZC9jYXJkLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnPCcsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6ICc8JyxcclxuICAgICAgICAgICAgb3duZXI6JzwnLFxyXG4gICAgICAgICAgICBpbWdTcmM6JzwnLFxyXG4gICAgICAgICAgICBpZDogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQ2FyZENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7IFxyXG4gICAgLy8gdm0uaW1nU3JjID0gdm0uaW1nU3JjLnNwbGl0KCdjbGllbnQnKVsxXTtcclxufSBcclxuIiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsb2dpbkRpcmVjdGl2ZScsIGxvZ2luRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGxvZ2luRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogRm9vdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdwcm9maWxlRGlyZWN0aXZlJywgcHJvZmlsZURpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9wcm9maWxlL3Byb2ZpbGUuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogcHJvZmlsZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG5wcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3VzZXJTZXJ2aWNlJywgJ3RyYWNrU2VydmljZScsICdtYXJrZXJQYXJzZXInXTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVDb250cm9sbGVyKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlLHRyYWNrU2VydmljZSxtYXJrZXJQYXJzZXIpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgXHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4gKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiAqL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubmF2YmFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCduYXZiYXJEaXJlY3RpdmUnLCBuYXZiYXJEaXJlY3RpdmUpO1xyXG5cclxuZnVuY3Rpb24gbmF2YmFyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9uYXZiYXIvbmF2YmFyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBuYXZiYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7IFxyXG5cclxuICAgIHZtLm9wZW5OYXYgPSBvcGVuTmF2O1xyXG4gICAgdm0uY2xvc2VOYXYgPSBjbG9zZU5hdjtcclxuXHJcblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VOYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgID0gXCIwJVwiO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucmVnaXN0ZXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyZWN0aXZlJywgcmVnaXN0ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gcmVnaXN0ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiByZWdpc3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhZWtsZScsIFsnYXBwLm1hcCcsJ2FwcC50cmFja1NlcnZpY2UnLCAnbmdGaWxlVXBsb2FkJywgJ2FuZ3VsYXItbGFkZGEnXSlcclxuICAgICAgICAuY29udHJvbGxlcigncm90YUVrbGVDb250cm9sbGVyJywgcm90YUVrbGVDb250cm9sbGVyKVxyXG5cclxuXHJcbiAgICByb3RhRWtsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnbWFwQ29uZmlnU2VydmljZScsICdyZXZlcnNlR2VvY29kZScsICd0cmFja1NlcnZpY2UnLCAnJHN0YXRlJywgJ1VwbG9hZCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGFFa2xlQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIG1hcENvbmZpZ1NlcnZpY2UsIHJldmVyc2VHZW9jb2RlLCB0cmFja1NlcnZpY2UsICRzdGF0ZSwgVXBsb2FkKSB7XHJcbiAgICAgICAgLy8gJG9jTGF6eUxvYWQubG9hZCgnLi4vLi4vc2VydmljZXMvbWFwL21hcC5hdXRvY29tcGxldGUuanMnKTtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICBpZihhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRyb290U2NvcGUudXNlcikgfHwgYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkcm9vdFNjb3BlLnVzZXIuX2lkKSl7XHJcbiAgICAgICAgICAgIC8vICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgICAgICAgICAgLy8gYnJlYWs7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHZtLm93bmVkQnkgPSAkcm9vdFNjb3BlLnVzZXIuX2lkO1xyXG4gICAgICAgIHZtLmltZ19zcmMgPSBcInNyY1wiO1xyXG4gICAgICAgIHZtLnN1bW1hcnk7XHJcbiAgICAgICAgdm0uYWx0aXR1ZGU7XHJcbiAgICAgICAgdm0uZGlzdGFuY2U7XHJcbiAgICAgICAgdm0ubmFtZSA9ICcnO1xyXG4gICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW107XHJcbiAgICAgICAgdm0udXBsb2FkR1BYID0gdXBsb2FkR1BYO1xyXG4gICAgICAgIHZtLnVwbG9hZFBpYyA9IHVwbG9hZFBpYztcclxuXHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZtLnRvZ2dsZVN0YXRlID0gdHJ1ZTtcclxuICAgICAgICB2bS50b2dnbGVQYW5lbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy5uZXh0LXN0ZXAtcGFuZWwgLnBhbmVsLWJvZHknKS50b2dnbGUoJ2hpZGUnKTtcclxuICAgICAgICAgICAgLy8gYWxlcnQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5hZGRUcmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdHJhY2tTZXJ2aWNlLmFkZFRyYWNrKHZtKS50aGVuKGZ1bmN0aW9uIChhZGRUcmFja1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3JvdGFsYXInKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGFkZFRyYWNrRXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRQaWMoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9waG90b3MvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW1nX3NyYyA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkR1BYKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvZ3B4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3B4ID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZmluaXNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xyXG4gICAgICAgICAgICBtYXJrZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYWluTWFya2VyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2bS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZtLmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmHFn2thIGJpciBub2t0YXlhIHTEsWtsYXlhcmFrIGtheWTEsXIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbihcImxlYWZsZXREaXJlY3RpdmVNYXAuY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWFmRXZlbnQgPSBhcmdzLmxlYWZsZXRFdmVudDtcclxuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUuZ2VvY29kZUxhdGxuZyhsZWFmRXZlbnQubGF0bG5nLmxhdCwgbGVhZkV2ZW50LmxhdGxuZy5sbmcpLnRoZW4oZnVuY3Rpb24gKGdlb2NvZGVTdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9jYXRpb24gPSBnZW9jb2RlU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubGF0ID0gbGVhZkV2ZW50LmxhdGxuZy5sYXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubG5nID0gbGVhZkV2ZW50LmxhdGxuZy5sbmc7XHJcbiAgICAgICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW2xlYWZFdmVudC5sYXRsbmcubG5nLCBsZWFmRXZlbnQubGF0bG5nLmxhdF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIiAiLCJhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgcmV0dXJuIGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGxcclxufVxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhcicsIHJvdGFsYXIpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyL3JvdGFsYXIuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLFxyXG4gICAgbWFya2VyUGFyc2VyLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0TWFwRXZlbnRzLCBsZWFmbGV0RGF0YSwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICB2bS5nZXRUcmFjayA9IGdldFRyYWNrO1xyXG4gICAgdm0ubWFwQXV0b1JlZnJlc2ggPSB0cnVlO1xyXG4gICAgdm0ub3Blbk1hcCA9IG9wZW5NYXA7XHJcbiAgICB2bS5jaGFuZ2VJbWcgPSBjaGFuZ2VJbWc7XHJcbiAgICB2bS5wYXJhbXMgPSB7fTtcclxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRTVykgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdTVylcclxuICAgICkge1xyXG4gICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IDQ0LjI5MjtcclxuICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0MS4yNjQ7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gMzIuODA1O1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IDI3Ljc3MztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdm0ucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgICAgICBsYXRTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0U1cpLFxyXG4gICAgICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcbiAgICAkcm9vdFNjb3BlLnNlYXJjaExvY2F0aW9uID0gJHN0YXRlUGFyYW1zLnRlcm07XHJcblxyXG4gICAgLy8gaWYod2luZG93Lm1vYmlsZWNoZWNrICYmIHZtLm1hcEFjdGl2ZSl7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5zZXRab29tKG1hcC5nZXRab29tKCkgLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLmdldFRyYWNrKHZtLnBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgICB2bS50cmFja3MuZGF0YSA9IHJlc3BvbmQuZGF0YTtcclxuICAgICAgICAgICAgaWYgKHZtLnRyYWNrcy5kYXRhID09IFtdKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmtlclBhcnNlci5qc29uVG9NYXJrZXJBcnJheSh2bS50cmFja3MuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnMgPSBtYXJrZXJQYXJzZXIudG9PYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IEwuZ2VvSnNvbih2bS50cmFja3MuZGF0YSkuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnNFbXB0eSA9IGFuZ3VsYXIuZXF1YWxzKE9iamVjdC5rZXlzKHZtLm1hcmtlcnMpLmxlbmd0aCwgMCk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG5cclxuICAgIHZtLmNoYW5nZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgLy8gdmFyIHN3YXAgPSBtYXJrZXIuaWNvbjtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbiA9IG1hcmtlci5pY29uX3N3YXA7XHJcbiAgICAgICAgLy8gbWFya2VyLmljb25fc3dhcCA9IHN3YXA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRsb2NhdGlvbi5zZWFyY2goKS5sYXRORSA9IDIwKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKG1hcmtlci5mb2N1cylcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnI0I3QTRFMycsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcblxyXG4gICAgLy9sb2cgZXZlbnRzIGZvciBtYXJrZXIgb2JqZWN0c1xyXG4gICAgZm9yICh2YXIgayBpbiB2bS5tYXBFdmVudHMpIHtcclxuICAgICAgICAvLyAgY29uc29sZS5sb2codm0ubWFwRXZlbnRzKTtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuJyArIHZtLm1hcEV2ZW50c1trXTtcclxuICAgICAgICAkc2NvcGUuJG9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmNoYW5nZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdXQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuY2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0uZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbWFwRXZlbnQgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC5kcmFnZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50LCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICB1cGRhdGVNYXAoYXJncyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgbWFwRXZlbnQyID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuem9vbWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudDIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIHVwZGF0ZU1hcChhcmdzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU1hcChhcmdzKSB7XHJcbiAgICAgICAgaWYgKHZtLm1hcEF1dG9SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXJrZXJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcuZGF0YS12aXonKS53aWR0aCgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdE5FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ1NXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgdm0ubWFwQWN0aXZlID0gIXZtLm1hcEFjdGl2ZTtcclxuICAgICAgICAkKCcuZGF0YS12aXonKS50b2dnbGVDbGFzcygnbWFwLW9wZW4nKTtcclxuICAgICAgICAkKCcubWFwLWF1dG8tcmVmcmVzaCcpLnRvZ2dsZUNsYXNzKCdyZWZyZXNoLW9wZW4nKTtcclxuICAgICAgICAodm0udG9nZ2xlVGl0bGUgPT0gJyBIYXJpdGEnID8gdm0udG9nZ2xlVGl0bGUgPSAnIExpc3RlJyA6IHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnKVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkKCcuZGF0YS12aXonKS53aWR0aCgpKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZUltZygpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KCcubm90LWZvdW5kLWltZycpLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgdmFsLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59IiwiYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJvdGFsYXJEZXRhaWwnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JvdGFsYXJEZXRhaWwnLCByb3RhbGFyRGV0YWlsKVxyXG5cclxuZnVuY3Rpb24gcm90YWxhckRldGFpbCgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJEZXRhaWxDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJEZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnLCAnd2VhdGhlckFQSSddO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckRldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEsIHdlYXRoZXJBUEkpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja0RldGFpbCA9IHt9O1xyXG4gICAgdm0uY2VudGVyID0ge307XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0cmFja1NlcnZpY2UuZ2V0VHJhY2tEZXRhaWwoJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjO1xyXG4gICAgICAgICAgICB2bS5jZW50ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIHpvb206IDEyXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLmdweERhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHdlYXRoZXJBUEkuZGFya1NreVdlYXRoZXIodm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sIHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHZtLndlYXRoZXIgPSByZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29ucyA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLmFkZChcImljb24xXCIsIHJlcy5jdXJyZW50bHkuaWNvbik7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLnBsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29ucyA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLmFkZChcImljb24yXCIsIHJlcy5jdXJyZW50bHkuaWNvbik7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zRGFpbHkgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdibGFjaydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseVdoaXRlID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS53ZWF0aGVyLmRhaWx5LmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGtleSArIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgayA9IGtleSArIDIwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3MgPSBcImljb25cIiArIHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrayA9IFwiaWNvblwiICsgaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseS5hZGQoc3MsIHZhbHVlLmljb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseVdoaXRlLmFkZChraywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5tb2JpbGVjaGVjaygpKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmRyYWdnaW5nLmRpc2FibGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuYWRkQ29udHJvbChuZXcgTC5Db250cm9sLkZ1bGxzY3JlZW4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiAnMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjknXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cHRJY29uVXJsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyc6ICdpbWcvaWNvbi1nby5zdmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0dlb2NhY2hlIEZvdW5kJzogJ2ltZy9ncHgvZ2VvY2FjaGUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQYXJrJzogJ2ltZy9ncHgvdHJlZS5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SWNvblVybDogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEljb25Vcmw6ICdpbWcvaWNvbi1zdG9wLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1VybDogJ2ltZy9waW4tc2hhZG93LnBuZydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmRpc3RhbmNlID0gZS50YXJnZXQuZ2V0X2Rpc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNaW4gPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21pbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZWxlTWF4ID0gZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9tYXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc2V0MDogZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9kYXRhKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmdldEJvdW5kcygpKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdCb3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9ub3J0aEVhc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQgKyAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nICsgMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zb3V0aFdlc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQgLSAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nIC0gMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobmV3Qm91bmRzLl9ub3J0aEVhc3QubGF0LCBuZXdCb3VuZHMuX25vcnRoRWFzdC5sbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX3NvdXRoV2VzdC5sYXQsIG5ld0JvdW5kcy5fc291dGhXZXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldE1heEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5fbGF5ZXJzTWluWm9vbT0xMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllckZvckRldGFpbCgpO1xyXG4gICAgdmFyIGNvbnRyb2xzID0ge1xyXG4gICAgICAgIGZ1bGxzY3JlZW46IHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZtLmNvbnRyb2xzID0gY29udHJvbHM7XHJcblxyXG59IiwiLyoqXHJcbiAqIEBkZXNjIFNlcnZpY2VzIHRoYXQgY29udmVydHMgZ2VvanNvbiBmZWF0dXJlcyB0byBtYXJrZXJzIGZvciBoYW5kbGluZyBsYXRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hcmtlclBhcnNlcigkcSkge1xyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAganNvblRvTWFya2VyQXJyYXk6IGpzb25Ub01hcmtlckFycmF5LFxyXG4gICAgICAgIHRvT2JqZWN0OiB0b09iamVjdCxcclxuICAgICAgICBtYXJrZXJDb250ZW50OiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuICAgIGZ1bmN0aW9uIGpzb25Ub01hcmtlckFycmF5KHZhbCkge1xyXG4gICAgICAgIHZhciBkZWZlcmVkID0gJHEuZGVmZXIoKTsgLy8gZGVmZXJlZCBvYmplY3QgcmVzdWx0IG9mIGFzeW5jIG9wZXJhdGlvblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgc2VydmljZS5tYXJrZXJDb250ZW50ID0gJ1x0PGRpdiBjbGFzcz1cImNhcmQgY2FyZC1vbi1tYXBcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb3ZlclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxpbWcgZGF0YS1uZy1zcmM9XCInICsgdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyArICdcIiBjbGFzcz1cImltZy1mbHVpZFwiIGFsdD1cIlwiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxhPjxkaXYgY2xhc3M9XCJtYXNrIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPjwvZGl2PjwvYT4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ibG9ja1wiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxoNCBjbGFzcz1cImNhcmQtdGl0bGUgZm9udC1zaXplLTE2XCI+PGEgaHJlZj1cInJvdGEvJysgdmFsW2ldLl9pZCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jyt2YWxbaV0ucHJvcGVydGllcy5uYW1lKyc8L2E+PC9oND4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICB2YXIgbWFyayA9IHtcclxuICAgICAgICAgICAgICAgIGxheWVyOiBcInJvdGFsYXJcIixcclxuICAgICAgICAgICAgICAgIGxhdDogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBtZXNzYWdlOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogc2VydmljZS5tYXJrZXJDb250ZW50LnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiOiB2YWxbaV0ucHJvcGVydGllcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmRpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VtbWFyeVwiOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjogdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChtYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dHB1dCkge1xyXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcclxuICAgICAgICB2YXIgcnYgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IHVuZGVmaW5lZCkgcnZbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXJrZXJQYXJzZXInLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXJrZXJQYXJzZXInLCBtYXJrZXJQYXJzZXIpOyIsImZ1bmN0aW9uIHRyYWNrU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBlbmRwb2ludCA9ICdodHRwOmxvY2FsaG9zdDo4MDgwLydcclxuXHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRUcmFjazogZ2V0VHJhY2ssXHJcblx0XHRhZGRUcmFjazogYWRkVHJhY2ssXHJcblx0XHRnZXRUcmFja0RldGFpbDpnZXRUcmFja0RldGFpbCxcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFjayhwYXJhbXMpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3M/bGF0TkU9JysgcGFyYW1zLmxhdE5FKycmbG5nTkU9JytwYXJhbXMubG5nTkUgKycmbGF0U1c9JytwYXJhbXMubGF0U1cgKycmbG5nU1c9JytwYXJhbXMubG5nU1csXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH0sXHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrRGV0YWlsKGlkKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycraWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gYWRkVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXRhOiAkLnBhcmFtKHtcclxuXHRcdFx0XHRcIm5hbWVcIjogdHJhY2submFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFwiYWx0aXR1ZGVcIjogdHJhY2suYWx0aXR1ZGUsXHJcblx0XHRcdFx0XCJzdW1tYXJ5XCI6IHRyYWNrLnN1bW1hcnksXHJcblx0XHRcdFx0XCJpbWdfc3JjXCI6IHRyYWNrLmltZ19zcmMsXHJcblx0XHRcdFx0XCJjb29yZGluYXRlc1wiOiB0cmFjay5jb29yZGluYXRlcyxcclxuXHRcdFx0XHRcIm93bmVkQnlcIjogdHJhY2sub3duZWRCeSxcclxuXHRcdFx0XHRcImdweFwiOiB0cmFjay5ncHgsXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAudHJhY2tTZXJ2aWNlJywgW10pXHJcblx0LmZhY3RvcnkoJ3RyYWNrU2VydmljZScsIHRyYWNrU2VydmljZSk7IiwiZnVuY3Rpb24gdXNlclNlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFVzZXI6IGdldFVzZXIsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgXHRyZXR1cm4gJGh0dHAoe1xyXG4gICAgXHRcdG1ldGhvZDogJ0dFVCcsXHJcbiAgICBcdFx0dXJsOiAnYXBpL3Byb2ZpbGUnXHJcbiAgICBcdH0pXHJcbiAgICB9OyBcclxufSBcclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAudXNlclNlcnZpY2UnLCBbXSlcclxuLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgdXNlclNlcnZpY2UpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHNlcnZpY2VJZCA9ICd3ZWF0aGVyQVBJJztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLndlYXRoZXInLCBbXSlcclxuICAgICAgICAuZmFjdG9yeShzZXJ2aWNlSWQsIFsnJHEnLCAnJGh0dHAnLCB3ZWF0aGVyQVBJXSk7XHJcblxyXG4gICAgZnVuY3Rpb24gd2VhdGhlckFQSSgkcSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgd2VhdGhlcjogd2VhdGhlcixcclxuICAgICAgICAgICAgZm9yZWNhc3Q6IGZvcmVjYXN0LFxyXG4gICAgICAgICAgICBkYXJrU2t5V2VhdGhlcjogZGFya1NreVdlYXRoZXIsXHJcbiAgICAgICAgICAgIGFwcGlkOiAnZmEyZDU5M2FhNThlOTBmZGUzMjg0MjZlNjRhNjRlMzgnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gd2VhdGhlcihsYXQsIGxuZykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogJycsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JyArIGxhdCArICcmbG9uPScgKyBsbmcgKyAnJmFwcGlkPScgKyBzZXJ2aWNlLmFwcGlkICsgJyZ1bml0cz1tZXRyaWMmbGFuZz10cidcclxuICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuY29kID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldEhvdXJzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldE1pbnV0ZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgY3VycmVudCBob3VyIHVzaW5nIG9mZnNldCBmcm9tIFVUQy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGV0aW1lID0gbmV3IERhdGUoKHJlcy5kYXRhLmR0ICogMTAwMCkgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bnJpc2UgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3VucmlzZSAqIDEwMDAgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bnNldCA9IG5ldyBEYXRlKHJlcy5kYXRhLnN5cy5zdW5zZXQgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhQ3VycmVudCA9IHt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LmRhdGV0aW1lID0gZGF0ZXRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyID0gZGF0YUN1cnJlbnQuZGF0ZXRpbWUuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuc3VucmlzZUhvdXIgPSBzdW5yaXNlLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnNldEhvdXIgPSBzdW5zZXQuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIb3VyIGJldHdlZW4gc3Vuc2V0IGFuZCBzdW5yaXNlIGJlaW5nIG5pZ2h0IHRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5pZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ3VycmVudC5jdXJyZW50SG91ciA+PSBkYXRhQ3VycmVudC5zdW5zZXRIb3VyIHx8IGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyIDw9IGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHdlYXRoZXIgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckRlc2NyaXB0aW9uID0gcmVzLmRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYW5nZSB3ZWF0aGVyIGljb24gY2xhc3MgYWNjb3JkaW5nIHRvIHdlYXRoZXIgY29kZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5pZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtdGh1bmRlcnN0b3JtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zdG9ybS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1yYWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zbm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1yYWluLW1peFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc0MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtY2xlYXJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtaGFpbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtY2xvdWR5LXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWZvZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc3VubnlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktaGFpbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktY2xvdWR5LXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzYyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZHVzdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbW9rZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXN0cm9uZy13aW5kXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc4MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktdG9ybmFkb1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktaHVycmljYW5lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXNub3dmbGFrZS1jb2xkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWhvdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQ6IGRhdGFDdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzLmRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWplY3QuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JlY2FzdChsYXQsIGxuZykge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRhcmtTa3lXZWF0aGVyKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvd2VhdGhlci8nICsgbGF0ICsgJy8nICsgbG5nLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jdXJyZW50bHkudGltZSA9IG5ldyBEYXRlKChkYXRhLmN1cnJlbnRseS50aW1lICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YS5kYWlseS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kYWlseS5kYXRhW2tleV0udGltZSA9ICBuZXcgRGF0ZSgodmFsdWUudGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWplY3QuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsImZ1bmN0aW9uIG1hcENvbmZpZ1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgZ2V0TGF5ZXI6IGdldExheWVyLFxyXG4gICAgICAgIGdldENlbnRlcjogZ2V0Q2VudGVyLFxyXG4gICAgICAgIGdldExheWVyRm9yRGV0YWlsOiBnZXRMYXllckZvckRldGFpbCxcclxuICAgIH07XHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllcigpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBcmF6aScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfU2F0ZWxsaXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1V5ZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zYXRlbGxpdGUtc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfT3V0ZG9vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvb3V0ZG9vcnMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X0xhbnNjYXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ8Swem9oaXBzJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vbGFuZHNjYXBlL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFlhbmRleDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdZYW5kZXggWW9sJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneWFuZGV4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyVHlwZTogJ21hcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG92ZXJsYXlzOiB7XHJcbiAgICAgICAgICAgICAgICByb3RhbGFyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dyb3VwJyxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENlbnRlcigpIHtcclxuICAgICAgICB2YXIgY2VudGVyID0ge1xyXG4gICAgICAgICAgICBsYXQ6IDM5LjkwMzI5MTgsXHJcbiAgICAgICAgICAgIGxuZzogMzIuNjIyMzM5NixcclxuICAgICAgICAgICAgem9vbTogNlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyRm9yRGV0YWlsKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VsYXllcnM6IHtcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfU2F0ZWxsaXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1V5ZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zYXRlbGxpdGUtc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfT3V0ZG9vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvb3V0ZG9vcnMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBZYW5kZXg6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWWFuZGV4IFlvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3lhbmRleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllclR5cGU6ICdtYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxheWVycztcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubWFwJywgW10pXHJcbiAgICAuZmFjdG9yeSgnbWFwQ29uZmlnU2VydmljZScsIG1hcENvbmZpZ1NlcnZpY2UpOyIsImZ1bmN0aW9uIGdlb2NvZGUoJHEpIHtcclxuICByZXR1cm4geyBcclxuICAgIGdlb2NvZGVBZGRyZXNzOiBmdW5jdGlvbihhZGRyZXNzKSB7XHJcbiAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiBhZGRyZXNzIH0sIGZ1bmN0aW9uIChyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICAgIC8vIHdpbmRvdy5maW5kTG9jYXRpb24ocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ2dlb2NvZGUnLCBnZW9jb2RlKTsiLCJmdW5jdGlvbiByZXZlcnNlR2VvY29kZSgkcSwgJGh0dHApIHtcclxuICAgIHZhciBvYmogPSB7fTtcclxuICAgIG9iai5nZW9jb2RlTGF0bG5nID0gZnVuY3Rpb24gZ2VvY29kZVBvc2l0aW9uKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICB2YXIgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGxhdExuZzogbGF0bG5nXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZXMgJiYgcmVzcG9uc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlc1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdyZXZlcnNlR2VvY29kZScsIHJldmVyc2VHZW9jb2RlKTsiXX0=
