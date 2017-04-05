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
            $state.go('login');
            // break;            
        }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibmF2YmFyL25hdmJhci5qcyIsImxvZ2luL2xvZ2luLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIuanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJyb3RhZWtsZS9yb3RhZWtsZS5qcyIsInJvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmpzIiwicm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuanMiLCJyb3RhbGFyL3JvdGFsYXIuanMiLCJtYXJrZXJwYXJzZXIuanMiLCJ0cmFjay5qcyIsInVzZXIuanMiLCJ3ZWF0aGVyQVBJLmpzIiwibWFwL21hcC5jb25maWcuanMiLCJtYXAvbWFwLmdlb2NvZGUuanMiLCJtYXAvbWFwLnJldmVyc2VHZW9jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxhQUFhLFVBQVUsUUFBUSxhQUFhO0lBQ3pELElBQUksU0FBUzs7SUFFYixPQUFPLE9BQU8sTUFBTSxRQUFRLEtBQUs7Ozs7QUFJckMsT0FBTyxtQkFBbUIsWUFBWTtJQUNsQyxFQUFFLHlCQUF5QixLQUFLLFlBQVk7UUFDeEMsSUFBSSxPQUFPO1FBQ1gsRUFBRSxNQUFNLFVBQVU7WUFDZCxRQUFRLFVBQVUsT0FBTyxTQUFTO2dCQUM5QixJQUFJLGNBQWM7Z0JBQ2xCLEVBQUUsUUFBUSwrSEFBK0gsT0FBTyxVQUFVLE1BQU07b0JBQzVKLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsUUFBUSxLQUFLO3dCQUM3RSxJQUFJLE9BQU87NEJBQ1AsTUFBTSxLQUFLLFNBQVMsb0JBQW9CLGNBQWMsR0FBRyxVQUFVLE9BQU8sT0FBTyxL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O1FBRTVCLE9BQU8sU0FBUzs7SUFFcEIsT0FBTzs7O0FBR1g7RUFDRSxPQUFPO0VBQ1AsUUFBUSxrQkFBa0IsZ0JBQWdCIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldC5zcGxpdChzZWFyY2gpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdlb2NvZGUtYXV0b2NvbXBsZXRlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICQodGhhdCkudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmVkaWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwczovL2dlb2NvZGUtbWFwcy55YW5kZXgucnUvMS54Lz9yZXN1bHRzPTUmYmJveD0yNC4xMjU5NzcsMzQuNDUyMjE4fjQ1LjEwOTg2Myw0Mi42MDE2MjAmZm9ybWF0PWpzb24mbGFuZz10cl9UUiZnZW9jb2RlPScgKyBxdWVyeSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm5hbWUgKyAnLCAnICsgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2xhdDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LlBvaW50LnBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEua2luZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdF90eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmJveDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmJvdW5kZWRCeS5FbnZlbG9wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGVzY3JpcHRpb24uaW5kZXhPZignVMO8cmtpeWUnKSA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHByZWRpY3Rpb25zICYmIHByZWRpY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVzdWx0cyA9ICQubWFwKHByZWRpY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnVuY3Rpb24gKHByZWRpY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZGVzdCA9IHByZWRpY3Rpb24ubmFtZSArIFwiLCBcIiArIHByZWRpY3Rpb24uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdCA9IGRlc3QucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2VzcyhwcmVkaWN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWZ0ZXJTZWxlY3Q6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIHZhciBsYXRTVyA9IGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuZ1NXID0gaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0TkUgPSBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBsbmdORSA9IGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSAnL2EvJyArIGl0ZW0ubmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJz9sYXRTVz0nICsgbGF0U1cudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdTVz0nICsgbG5nU1cudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsYXRORT0nICsgbGF0TkUudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdORT0nICsgbG5nTkUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSAnPHNwYW4gY2xhc3M9XCJpdGVtLWFkZHJlc3NcIj4nICsgaXRlbSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICBmaXRUb0VsZW1lbnQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoYXQpLm9uKCd0eXBlYWhlYWQ6Y2hhbmdlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICQodGhhdCkudmFsKGl0ZW0uZmluZCgnYT5zcGFuLml0ZW0tYWRkcmVzcycpLnRleHQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxud2luZG93Lm1vYmlsZWNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoZWNrID0gZmFsc2U7XHJcbiAgICAoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLCA0KSkpIGNoZWNrID0gdHJ1ZTtcclxuICAgIH0pKG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmEpO1xyXG4gICAgcmV0dXJuIGNoZWNrO1xyXG59O1xyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXHJcbiAgICAnYXBwLm5hdmJhcicsXHJcbiAgICAnYXBwLmxvZ2luJyxcclxuICAgICdhcHAucmVnaXN0ZXInLFxyXG4gICAgJ2FwcC5jYXJkJywgXHJcbiAgICAnYXBwLnByb2ZpbGUnLFxyXG4gICAgJ2FwcC51c2VyU2VydmljZScsXHJcbiAgICAnYXBwLnRyYWNrU2VydmljZScsXHJcbiAgICAnYXBwLm1hcmtlclBhcnNlcicsXHJcbiAgICAnYXBwLm1hcCcsXHJcbiAgICAnYXBwLmNvbnRlbnQnLCAgICBcclxuICAgICdhcHAucm90YScsXHJcbiAgICAnb2MubGF6eUxvYWQnLFxyXG4gICAgJ3VpLnJvdXRlcicsXHJcbiAgICAnbGVhZmxldC1kaXJlY3RpdmUnLFxyXG4gICAgJ2FwcC53ZWF0aGVyJyxcclxuICBdKVxyXG4gIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJywnJGxvZ1Byb3ZpZGVyJywnJG9jTGF6eUxvYWRQcm92aWRlcicsJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsJGNvbXBpbGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH0pO1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxwcm9maWxlLWRpcmVjdGl2ZT48L3Byb2ZpbGUtZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwcm9maWxlU3RhdGUpO1xyXG4gIH1dKVxyXG4gIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlKSB7XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICByZXR1cm4gZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgICByZXR1cm4gdXNlclNlcnZpY2UuZ2V0VXNlcigpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgIGlmIChyZXNwb25kLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSBcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gcmVzcG9uZC5kYXRhLnVzZXI7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuZmxhZ0xvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIH0pKCk7IFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbnRlbnQnLCBbJ2FwcC5oZWFkZXInLCAnYXBwLmZvb3RlcicsJ3VpLnJvdXRlciddKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICAgICB2YXIgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnZGVmYXVsdFN0YXRlJywgXHJcbiAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9sYW5kaW5nL2xhbmRpbmcuaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGRlZmF1bHRTdGF0ZSk7XHJcbiAgICB9KVxyXG4gIFxyXG59KSgpOyIsIiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGEnLCBbJ2FwcC5yb3RhbGFyJywgJ2FwcC5yb3RhbGFyRGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9hL3t0ZXJtfT9sYXRTVyZsbmdTVyZsYXRORSZsbmdORScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhcj48L3JvdGFsYXI+JyxcclxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocm90YWxhclN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByb3RhbGFyRGV0YWlsU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncm90YWxhckRldGFpbCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YS86aWQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHJvdGFsYXItZGV0YWlsPjwvcm90YWxhci1kZXRhaWw+J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyRGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrSW1hZ2VTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5pbWFnZScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVzaW1sZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuaW1hZ2Uvcm90YWVrbGUuaW1hZ2UuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ltYWdlU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrR1BYU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZ3B4JyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9ncHgnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZ3B4L3JvdGFla2xlLmdweC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrR1BYU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrRmluaXNoU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZmluaXNoJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rYXlkZXQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZmluaXNoL3JvdGFla2xlLmZpbmlzaC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrRmluaXNoU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZvb3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnZm9vdGVyRGlyZWN0aXZlJywgZm9vdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGZvb3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcbn0pKCk7IFxyXG4gXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmhlYWRlcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2hlYWRsaW5lRGlyZWN0aXZlJywgaGVhZGxpbmVEaXJlY3RpdmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlYWRsaW5lRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9oZWFkbGluZS9oZWFkbGluZS5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBIZWFkbGluZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgSGVhZGxpbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGludGVydmFsJywgJyRxJywnJHdpbmRvdyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRsaW5lQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJGludGVydmFsLCAkcSwkd2luZG93KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHZtLnNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdyb3RhbGFyJywge1xyXG4gICAgICAgICAgICAgICAgdGVybTogdm0uZWxtYVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiNBdXRvY29tcGxldGVcIikuZm9jdXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjQXV0b2NvbXBsZXRlXCIpLm9mZnNldCgpLnRvcCAtIDgwXHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHdpbmRvdy5zY3JvbGxYID0gMDtcclxuICAgICAgICAkd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcblxyXG5cclxuICAgICAgICAkaW50ZXJ2YWwoY2hhbmdlQmcsIDY1MDApO1xyXG5cclxuICAgICAgICB2YXIgaSA9IDE7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZUJnKCkge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgLy9yZXN0YXJ0XHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIC8vIHZhciBpbWdVcmwgPSBcInVybCgnLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZycpXCI7XHJcbiAgICAgICAgICAgIHZhciBpbWdVcmwgPSBcIi4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGdcIjtcclxuXHJcbiAgICAgICAgICAgIHByZWxvYWQoaW1nVXJsKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIi5oZWFkbGluZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInVybChcIisgaW1nVXJsICtcIilcIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlbG9hZCh1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHVybDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWFnZS5jb21wbGV0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuKiBAZGVzYyBjYXJkIGNvbXBvbmVudCBcclxuKiBAZXhhbXBsZSA8Y2FyZD48L2NhcmQ+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jYXJkJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdjYXJkRGlyZWN0aXZlJywgY2FyZERpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBjYXJkRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29tbW9uL2NhcmQvY2FyZC5odG1sJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICB0aXRsZTogJzwnLFxyXG4gICAgICAgICAgICBzdW1tYXJ5OiAnPCcsXHJcbiAgICAgICAgICAgIG93bmVyOic8JyxcclxuICAgICAgICAgICAgaW1nU3JjOic8JyxcclxuICAgICAgICAgICAgaWQ6ICc8JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IENhcmRDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2FyZENvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzOyBcclxuICAgIC8vIHZtLmltZ1NyYyA9IHZtLmltZ1NyYy5zcGxpdCgnY2xpZW50JylbMV07XHJcbn0gXHJcbiIsIi8qKlxyXG4gKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiAqIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5uYXZiYXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ25hdmJhckRpcmVjdGl2ZScsIG5hdmJhckRpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL25hdmJhci9uYXZiYXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IG5hdmJhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmF2YmFyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTsgXHJcblxyXG4gICAgdm0ub3Blbk5hdiA9IG9wZW5OYXY7XHJcbiAgICB2bS5jbG9zZU5hdiA9IGNsb3NlTmF2O1xyXG5cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5OYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZU5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCAgPSBcIjAlXCI7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sb2dpbicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbG9naW5EaXJlY3RpdmUnLCBsb2dpbkRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBsb2dpbkRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbG9naW4vbG9naW4uaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IEZvb3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucmVnaXN0ZXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyZWN0aXZlJywgcmVnaXN0ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gcmVnaXN0ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiByZWdpc3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdwcm9maWxlRGlyZWN0aXZlJywgcHJvZmlsZURpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9wcm9maWxlL3Byb2ZpbGUuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogcHJvZmlsZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG5wcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3VzZXJTZXJ2aWNlJywgJ3RyYWNrU2VydmljZScsICdtYXJrZXJQYXJzZXInXTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVDb250cm9sbGVyKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlLHRyYWNrU2VydmljZSxtYXJrZXJQYXJzZXIpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgXHJcbiAgICB9XHJcbn0iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YWVrbGUnLCBbJ2FwcC5tYXAnLCdhcHAudHJhY2tTZXJ2aWNlJywgJ25nRmlsZVVwbG9hZCcsICdhbmd1bGFyLWxhZGRhJ10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3JvdGFFa2xlQ29udHJvbGxlcicsIHJvdGFFa2xlQ29udHJvbGxlcilcclxuXHJcblxyXG4gICAgcm90YUVrbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAncmV2ZXJzZUdlb2NvZGUnLCAndHJhY2tTZXJ2aWNlJywgJyRzdGF0ZScsICdVcGxvYWQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3RhRWtsZUNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCBtYXBDb25maWdTZXJ2aWNlLCByZXZlcnNlR2VvY29kZSwgdHJhY2tTZXJ2aWNlLCAkc3RhdGUsIFVwbG9hZCkge1xyXG4gICAgICAgIC8vICRvY0xhenlMb2FkLmxvYWQoJy4uLy4uL3NlcnZpY2VzL21hcC9tYXAuYXV0b2NvbXBsZXRlLmpzJyk7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICAgICAgdm0uY2VudGVyID0gbWFwQ29uZmlnU2VydmljZS5nZXRDZW50ZXIoKTtcclxuICAgICAgICB2bS5sb2NhdGlvbjtcclxuXHJcbiAgICAgICAgLy9UcmFjayBwYXJhbWV0ZXJzXHJcbiAgICAgICAgaWYoYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkcm9vdFNjb3BlLnVzZXIpIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHJvb3RTY29wZS51c2VyLl9pZCkpe1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgIC8vIGJyZWFrOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICB2bS5vd25lZEJ5ID0gJHJvb3RTY29wZS51c2VyLl9pZDtcclxuICAgICAgICB2bS5pbWdfc3JjID0gXCJzcmNcIjtcclxuICAgICAgICB2bS5zdW1tYXJ5O1xyXG4gICAgICAgIHZtLmFsdGl0dWRlO1xyXG4gICAgICAgIHZtLmRpc3RhbmNlO1xyXG4gICAgICAgIHZtLm5hbWUgPSAnJztcclxuICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtdO1xyXG4gICAgICAgIHZtLnVwbG9hZEdQWCA9IHVwbG9hZEdQWDtcclxuICAgICAgICB2bS51cGxvYWRQaWMgPSB1cGxvYWRQaWM7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUubG9naW5Mb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdm0uYWRkVHJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRyYWNrU2VydmljZS5hZGRUcmFjayh2bSkudGhlbihmdW5jdGlvbiAoYWRkVHJhY2tSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdyb3RhbGFyJyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChhZGRUcmFja0Vycm9yKSB7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkUGljKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvcGhvdG9zLycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmltZ19zcmMgPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5ncHgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEdQWChmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL2dweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdweCA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmZpbmlzaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHtcclxuICAgICAgICAgICAgbWFya2Vyczoge1xyXG4gICAgICAgICAgICAgICAgbWFpbk1hcmtlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdDogdm0uY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2bS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJhxZ9rYSBiaXIgbm9rdGF5YSB0xLFrbGF5YXJhayBrYXlkxLFyLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oXCJsZWFmbGV0RGlyZWN0aXZlTWFwLmNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgbGVhZkV2ZW50ID0gYXJncy5sZWFmbGV0RXZlbnQ7XHJcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlLmdlb2NvZGVMYXRsbmcobGVhZkV2ZW50LmxhdGxuZy5sYXQsIGxlYWZFdmVudC5sYXRsbmcubG5nKS50aGVuKGZ1bmN0aW9uIChnZW9jb2RlU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvY2F0aW9uID0gZ2VvY29kZVN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxhdCA9IGxlYWZFdmVudC5sYXRsbmcubGF0O1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxuZyA9IGxlYWZFdmVudC5sYXRsbmcubG5nO1xyXG4gICAgICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtsZWFmRXZlbnQubGF0bG5nLmxuZywgbGVhZkV2ZW50LmxhdGxuZy5sYXRdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIiLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhckRldGFpbCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhckRldGFpbCcsIHJvdGFsYXJEZXRhaWwpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyRGV0YWlsKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyLmRldGFpbC9yb3RhbGFyLmRldGFpbC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogUm90YWxhckRldGFpbENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuUm90YWxhckRldGFpbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0RGF0YScsICd3ZWF0aGVyQVBJJ107XHJcblxyXG5mdW5jdGlvbiBSb3RhbGFyRGV0YWlsQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgd2VhdGhlckFQSSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrRGV0YWlsID0ge307XHJcbiAgICB2bS5jZW50ZXIgPSB7fTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmM7XHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0uZ3B4RGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgd2VhdGhlckFQSS5kYXJrU2t5V2VhdGhlcih2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdm0ud2VhdGhlciA9IHJlcztcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjFcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjJcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseSA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29uc0RhaWx5V2hpdGUgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLndlYXRoZXIuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0ga2V5ICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrID0ga2V5ICsgMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcyA9IFwiaWNvblwiICsgcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtrID0gXCJpY29uXCIgKyBrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LmFkZChzcywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUuYWRkKGtrLCB2YWx1ZS5pY29uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHkucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHlXaGl0ZS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYod2luZG93Lm1vYmlsZWNoZWNrKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNjcm9sbFdoZWVsWm9vbS5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZHJhZ2dpbmcuZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1hcC5hZGRDb250cm9sKG5ldyBMLkNvbnRyb2wuRnVsbHNjcmVlbigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ3B4ID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5ncHg7IC8vIFVSTCB0byB5b3VyIEdQWCBmaWxlIG9yIHRoZSBHUFggaXRzZWxmXHJcbiAgICAgICAgICAgICAgICB2YXIgZyA9IG5ldyBMLkdQWChncHgsIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2x5bGluZV9vcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAneWVsbG93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGFzaEFycmF5OiAnMTAsMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6ICczJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogJzAuOSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcl9vcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdwdEljb25VcmxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJzogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnR2VvY2FjaGUgRm91bmQnOiAnaW1nL2dweC9nZW9jYWNoZS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BhcmsnOiAnaW1nL2dweC90cmVlLnBuZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJY29uVXJsOiAnaW1nL2ljb24tZ28uc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSWNvblVybDogJ2ltZy9pY29uLXN0b3Auc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93VXJsOiAnaW1nL3Bpbi1zaGFkb3cucG5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZGlzdGFuY2UgPSBlLnRhcmdldC5nZXRfZGlzdGFuY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmVsZU1pbiA9IGUudGFyZ2V0LmdldF9lbGV2YXRpb25fbWluKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNYXggPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21heCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzZXQwOiBlLnRhcmdldC5nZXRfZWxldmF0aW9uX2RhdGEoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhlLnRhcmdldC5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQuZ2V0Qm91bmRzKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0JvdW5kcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX25vcnRoRWFzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBlLnRhcmdldC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdCArIDAuMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmcgKyAwLjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3NvdXRoV2VzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBlLnRhcmdldC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCAtIDAuMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmcgLSAwLjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX25vcnRoRWFzdC5sYXQsIG5ld0JvdW5kcy5fbm9ydGhFYXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcnRoRWFzdCA9IEwubGF0TG5nKG5ld0JvdW5kcy5fc291dGhXZXN0LmxhdCwgbmV3Qm91bmRzLl9zb3V0aFdlc3QubG5nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXAuc2V0TWF4Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLl9sYXllcnNNaW5ab29tPTEwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGcuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyRm9yRGV0YWlsKCk7XHJcbiAgICB2YXIgY29udHJvbHMgPSB7XHJcbiAgICAgICAgZnVsbHNjcmVlbjoge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdm0uY29udHJvbHMgPSBjb250cm9scztcclxuXHJcbn0iLCJhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgcmV0dXJuIGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGxcclxufVxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhcicsIHJvdGFsYXIpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyL3JvdGFsYXIuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLFxyXG4gICAgbWFya2VyUGFyc2VyLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0TWFwRXZlbnRzLCBsZWFmbGV0RGF0YSwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICB2bS5nZXRUcmFjayA9IGdldFRyYWNrO1xyXG4gICAgdm0ubWFwQXV0b1JlZnJlc2ggPSB0cnVlO1xyXG4gICAgdm0ub3Blbk1hcCA9IG9wZW5NYXA7XHJcbiAgICB2bS5jaGFuZ2VJbWcgPSBjaGFuZ2VJbWc7XHJcbiAgICB2bS5wYXJhbXMgPSB7fTtcclxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRTVykgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdTVylcclxuICAgICkge1xyXG4gICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IDQ0LjI5MjtcclxuICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0MS4yNjQ7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gMzIuODA1O1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IDI3Ljc3MztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdm0ucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgICAgICBsYXRTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0U1cpLFxyXG4gICAgICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcbiAgICAkcm9vdFNjb3BlLnNlYXJjaExvY2F0aW9uID0gJHN0YXRlUGFyYW1zLnRlcm07XHJcblxyXG4gICAgLy8gaWYod2luZG93Lm1vYmlsZWNoZWNrICYmIHZtLm1hcEFjdGl2ZSl7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5zZXRab29tKG1hcC5nZXRab29tKCkgLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLmdldFRyYWNrKHZtLnBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgICB2bS50cmFja3MuZGF0YSA9IHJlc3BvbmQuZGF0YTtcclxuICAgICAgICAgICAgaWYgKHZtLnRyYWNrcy5kYXRhID09IFtdKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmtlclBhcnNlci5qc29uVG9NYXJrZXJBcnJheSh2bS50cmFja3MuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnMgPSBtYXJrZXJQYXJzZXIudG9PYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IEwuZ2VvSnNvbih2bS50cmFja3MuZGF0YSkuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnNFbXB0eSA9IGFuZ3VsYXIuZXF1YWxzKE9iamVjdC5rZXlzKHZtLm1hcmtlcnMpLmxlbmd0aCwgMCk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG5cclxuICAgIHZtLmNoYW5nZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgLy8gdmFyIHN3YXAgPSBtYXJrZXIuaWNvbjtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbiA9IG1hcmtlci5pY29uX3N3YXA7XHJcbiAgICAgICAgLy8gbWFya2VyLmljb25fc3dhcCA9IHN3YXA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRsb2NhdGlvbi5zZWFyY2goKS5sYXRORSA9IDIwKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKG1hcmtlci5mb2N1cylcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnI0I3QTRFMycsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcblxyXG4gICAgLy9sb2cgZXZlbnRzIGZvciBtYXJrZXIgb2JqZWN0c1xyXG4gICAgZm9yICh2YXIgayBpbiB2bS5tYXBFdmVudHMpIHtcclxuICAgICAgICAvLyAgY29uc29sZS5sb2codm0ubWFwRXZlbnRzKTtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuJyArIHZtLm1hcEV2ZW50c1trXTtcclxuICAgICAgICAkc2NvcGUuJG9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmNoYW5nZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdXQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuY2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0uZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbWFwRXZlbnQgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC5kcmFnZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50LCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICB1cGRhdGVNYXAoYXJncyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgbWFwRXZlbnQyID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuem9vbWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudDIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIHVwZGF0ZU1hcChhcmdzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU1hcChhcmdzKSB7XHJcbiAgICAgICAgaWYgKHZtLm1hcEF1dG9SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXJrZXJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcuZGF0YS12aXonKS53aWR0aCgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdE5FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ1NXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgdm0ubWFwQWN0aXZlID0gIXZtLm1hcEFjdGl2ZTtcclxuICAgICAgICAkKCcuZGF0YS12aXonKS50b2dnbGVDbGFzcygnbWFwLW9wZW4nKTtcclxuICAgICAgICAkKCcubWFwLWF1dG8tcmVmcmVzaCcpLnRvZ2dsZUNsYXNzKCdyZWZyZXNoLW9wZW4nKTtcclxuICAgICAgICAodm0udG9nZ2xlVGl0bGUgPT0gJyBIYXJpdGEnID8gdm0udG9nZ2xlVGl0bGUgPSAnIExpc3RlJyA6IHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnKVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkKCcuZGF0YS12aXonKS53aWR0aCgpKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZUltZygpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KCcubm90LWZvdW5kLWltZycpLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgdmFsLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59IiwiLyoqXHJcbiAqIEBkZXNjIFNlcnZpY2VzIHRoYXQgY29udmVydHMgZ2VvanNvbiBmZWF0dXJlcyB0byBtYXJrZXJzIGZvciBoYW5kbGluZyBsYXRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hcmtlclBhcnNlcigkcSkge1xyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAganNvblRvTWFya2VyQXJyYXk6IGpzb25Ub01hcmtlckFycmF5LFxyXG4gICAgICAgIHRvT2JqZWN0OiB0b09iamVjdCxcclxuICAgICAgICBtYXJrZXJDb250ZW50OiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuICAgIGZ1bmN0aW9uIGpzb25Ub01hcmtlckFycmF5KHZhbCkge1xyXG4gICAgICAgIHZhciBkZWZlcmVkID0gJHEuZGVmZXIoKTsgLy8gZGVmZXJlZCBvYmplY3QgcmVzdWx0IG9mIGFzeW5jIG9wZXJhdGlvblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgc2VydmljZS5tYXJrZXJDb250ZW50ID0gJ1x0PGRpdiBjbGFzcz1cImNhcmQgY2FyZC1vbi1tYXBcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb3ZlclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxpbWcgZGF0YS1uZy1zcmM9XCInICsgdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyArICdcIiBjbGFzcz1cImltZy1mbHVpZFwiIGFsdD1cIlwiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxhPjxkaXYgY2xhc3M9XCJtYXNrIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPjwvZGl2PjwvYT4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ibG9ja1wiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxoNCBjbGFzcz1cImNhcmQtdGl0bGUgZm9udC1zaXplLTE2XCI+PGEgaHJlZj1cInJvdGEvJysgdmFsW2ldLl9pZCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jyt2YWxbaV0ucHJvcGVydGllcy5uYW1lKyc8L2E+PC9oND4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICB2YXIgbWFyayA9IHtcclxuICAgICAgICAgICAgICAgIGxheWVyOiBcInJvdGFsYXJcIixcclxuICAgICAgICAgICAgICAgIGxhdDogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBtZXNzYWdlOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogc2VydmljZS5tYXJrZXJDb250ZW50LnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiOiB2YWxbaV0ucHJvcGVydGllcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmRpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VtbWFyeVwiOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjogdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChtYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dHB1dCkge1xyXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcclxuICAgICAgICB2YXIgcnYgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IHVuZGVmaW5lZCkgcnZbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXJrZXJQYXJzZXInLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXJrZXJQYXJzZXInLCBtYXJrZXJQYXJzZXIpOyIsImZ1bmN0aW9uIHRyYWNrU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBlbmRwb2ludCA9ICdodHRwOmxvY2FsaG9zdDo4MDgwLydcclxuXHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRUcmFjazogZ2V0VHJhY2ssXHJcblx0XHRhZGRUcmFjazogYWRkVHJhY2ssXHJcblx0XHRnZXRUcmFja0RldGFpbDpnZXRUcmFja0RldGFpbCxcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFjayhwYXJhbXMpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3M/bGF0TkU9JysgcGFyYW1zLmxhdE5FKycmbG5nTkU9JytwYXJhbXMubG5nTkUgKycmbGF0U1c9JytwYXJhbXMubGF0U1cgKycmbG5nU1c9JytwYXJhbXMubG5nU1csXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH0sXHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrRGV0YWlsKGlkKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycraWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gYWRkVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXRhOiAkLnBhcmFtKHtcclxuXHRcdFx0XHRcIm5hbWVcIjogdHJhY2submFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFwiYWx0aXR1ZGVcIjogdHJhY2suYWx0aXR1ZGUsXHJcblx0XHRcdFx0XCJzdW1tYXJ5XCI6IHRyYWNrLnN1bW1hcnksXHJcblx0XHRcdFx0XCJpbWdfc3JjXCI6IHRyYWNrLmltZ19zcmMsXHJcblx0XHRcdFx0XCJjb29yZGluYXRlc1wiOiB0cmFjay5jb29yZGluYXRlcyxcclxuXHRcdFx0XHRcIm93bmVkQnlcIjogdHJhY2sub3duZWRCeSxcclxuXHRcdFx0XHRcImdweFwiOiB0cmFjay5ncHgsXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAudHJhY2tTZXJ2aWNlJywgW10pXHJcblx0LmZhY3RvcnkoJ3RyYWNrU2VydmljZScsIHRyYWNrU2VydmljZSk7IiwiZnVuY3Rpb24gdXNlclNlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFVzZXI6IGdldFVzZXIsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgXHRyZXR1cm4gJGh0dHAoe1xyXG4gICAgXHRcdG1ldGhvZDogJ0dFVCcsXHJcbiAgICBcdFx0dXJsOiAnYXBpL3Byb2ZpbGUnXHJcbiAgICBcdH0pXHJcbiAgICB9OyBcclxufSBcclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAudXNlclNlcnZpY2UnLCBbXSlcclxuLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgdXNlclNlcnZpY2UpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHNlcnZpY2VJZCA9ICd3ZWF0aGVyQVBJJztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLndlYXRoZXInLCBbXSlcclxuICAgICAgICAuZmFjdG9yeShzZXJ2aWNlSWQsIFsnJHEnLCAnJGh0dHAnLCB3ZWF0aGVyQVBJXSk7XHJcblxyXG4gICAgZnVuY3Rpb24gd2VhdGhlckFQSSgkcSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgd2VhdGhlcjogd2VhdGhlcixcclxuICAgICAgICAgICAgZm9yZWNhc3Q6IGZvcmVjYXN0LFxyXG4gICAgICAgICAgICBkYXJrU2t5V2VhdGhlcjogZGFya1NreVdlYXRoZXIsXHJcbiAgICAgICAgICAgIGFwcGlkOiAnZmEyZDU5M2FhNThlOTBmZGUzMjg0MjZlNjRhNjRlMzgnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gd2VhdGhlcihsYXQsIGxuZykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogJycsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JyArIGxhdCArICcmbG9uPScgKyBsbmcgKyAnJmFwcGlkPScgKyBzZXJ2aWNlLmFwcGlkICsgJyZ1bml0cz1tZXRyaWMmbGFuZz10cidcclxuICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuY29kID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldEhvdXJzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldE1pbnV0ZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgY3VycmVudCBob3VyIHVzaW5nIG9mZnNldCBmcm9tIFVUQy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGV0aW1lID0gbmV3IERhdGUoKHJlcy5kYXRhLmR0ICogMTAwMCkgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bnJpc2UgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3VucmlzZSAqIDEwMDAgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bnNldCA9IG5ldyBEYXRlKHJlcy5kYXRhLnN5cy5zdW5zZXQgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhQ3VycmVudCA9IHt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LmRhdGV0aW1lID0gZGF0ZXRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyID0gZGF0YUN1cnJlbnQuZGF0ZXRpbWUuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuc3VucmlzZUhvdXIgPSBzdW5yaXNlLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnNldEhvdXIgPSBzdW5zZXQuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIb3VyIGJldHdlZW4gc3Vuc2V0IGFuZCBzdW5yaXNlIGJlaW5nIG5pZ2h0IHRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5pZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ3VycmVudC5jdXJyZW50SG91ciA+PSBkYXRhQ3VycmVudC5zdW5zZXRIb3VyIHx8IGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyIDw9IGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHdlYXRoZXIgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckRlc2NyaXB0aW9uID0gcmVzLmRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYW5nZSB3ZWF0aGVyIGljb24gY2xhc3MgYWNjb3JkaW5nIHRvIHdlYXRoZXIgY29kZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5pZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtdGh1bmRlcnN0b3JtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zdG9ybS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1yYWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zbm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1yYWluLW1peFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc0MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtY2xlYXJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtaGFpbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtY2xvdWR5LXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWZvZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc3VubnlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktaGFpbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktY2xvdWR5LXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzYyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZHVzdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbW9rZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXN0cm9uZy13aW5kXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc4MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktdG9ybmFkb1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktaHVycmljYW5lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXNub3dmbGFrZS1jb2xkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWhvdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQ6IGRhdGFDdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzLmRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWplY3QuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JlY2FzdChsYXQsIGxuZykge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRhcmtTa3lXZWF0aGVyKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvd2VhdGhlci8nICsgbGF0ICsgJy8nICsgbG5nLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jdXJyZW50bHkudGltZSA9IG5ldyBEYXRlKChkYXRhLmN1cnJlbnRseS50aW1lICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YS5kYWlseS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kYWlseS5kYXRhW2tleV0udGltZSA9ICBuZXcgRGF0ZSgodmFsdWUudGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWplY3QuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsImZ1bmN0aW9uIG1hcENvbmZpZ1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgZ2V0TGF5ZXI6IGdldExheWVyLFxyXG4gICAgICAgIGdldENlbnRlcjogZ2V0Q2VudGVyLFxyXG4gICAgICAgIGdldExheWVyRm9yRGV0YWlsOiBnZXRMYXllckZvckRldGFpbCxcclxuICAgIH07XHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllcigpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBcmF6aScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfU2F0ZWxsaXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1V5ZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zYXRlbGxpdGUtc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfT3V0ZG9vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvb3V0ZG9vcnMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X0xhbnNjYXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ8Swem9oaXBzJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vbGFuZHNjYXBlL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFlhbmRleDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdZYW5kZXggWW9sJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneWFuZGV4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyVHlwZTogJ21hcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG92ZXJsYXlzOiB7XHJcbiAgICAgICAgICAgICAgICByb3RhbGFyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dyb3VwJyxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENlbnRlcigpIHtcclxuICAgICAgICB2YXIgY2VudGVyID0ge1xyXG4gICAgICAgICAgICBsYXQ6IDM5LjkwMzI5MTgsXHJcbiAgICAgICAgICAgIGxuZzogMzIuNjIyMzM5NixcclxuICAgICAgICAgICAgem9vbTogNlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyRm9yRGV0YWlsKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VsYXllcnM6IHtcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfU2F0ZWxsaXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1V5ZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zYXRlbGxpdGUtc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfT3V0ZG9vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvb3V0ZG9vcnMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBZYW5kZXg6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWWFuZGV4IFlvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3lhbmRleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllclR5cGU6ICdtYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxheWVycztcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubWFwJywgW10pXHJcbiAgICAuZmFjdG9yeSgnbWFwQ29uZmlnU2VydmljZScsIG1hcENvbmZpZ1NlcnZpY2UpOyIsImZ1bmN0aW9uIGdlb2NvZGUoJHEpIHtcclxuICByZXR1cm4geyBcclxuICAgIGdlb2NvZGVBZGRyZXNzOiBmdW5jdGlvbihhZGRyZXNzKSB7XHJcbiAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiBhZGRyZXNzIH0sIGZ1bmN0aW9uIChyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICAgIC8vIHdpbmRvdy5maW5kTG9jYXRpb24ocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ2dlb2NvZGUnLCBnZW9jb2RlKTsiLCJmdW5jdGlvbiByZXZlcnNlR2VvY29kZSgkcSwgJGh0dHApIHtcclxuICAgIHZhciBvYmogPSB7fTtcclxuICAgIG9iai5nZW9jb2RlTGF0bG5nID0gZnVuY3Rpb24gZ2VvY29kZVBvc2l0aW9uKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICB2YXIgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGxhdExuZzogbGF0bG5nXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZXMgJiYgcmVzcG9uc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlc1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdyZXZlcnNlR2VvY29kZScsIHJldmVyc2VHZW9jb2RlKTsiXX0=
