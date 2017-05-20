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
    'passwordVerify',
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
(function () {
    'use strict';
    angular.module('passwordVerify', []);
    angular.module('passwordVerify').directive('equals', function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('equals', function (val) {
                    validate();
                }); 

                var validate = function () {
                    // values 
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.equals;

                    // set validity
                    ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
                };
            }
        }
    });

})();
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
    .module('app.register', ['passwordVerify'])
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
        .module('app.rotaekle', ['app.map', 'app.trackService', 'ngFileUpload', 'angular-ladda'])
        .controller('rotaEkleController', rotaEkleController)


    rotaEkleController.$inject = ['$scope', '$rootScope', 'mapConfigService', 'reverseGeocode', 'trackService', '$state', 'Upload'];

    function rotaEkleController($scope, $rootScope, mapConfigService, reverseGeocode, trackService, $state, Upload) {
        // $ocLazyLoad.load('../../services/map/map.autocomplete.js');
        var vm = this;
        console.log($state);
        // vm.state = $state;
        vm.layers = mapConfigService.getLayer();
        vm.center = mapConfigService.getCenter();
        vm.location;

        //Track parameters
        if (angular.isUndefinedOrNull($rootScope.user) || angular.isUndefinedOrNull($rootScope.user._id)) {
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
        vm.campSelected = campSelected;


        $scope.loginLoading = true;
        vm.toggleState = true;
        vm.togglePanel = function () {
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

        function campSelected(camp) {
            $state.go("addtrack.season");
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

        $scope.$on('currentStep', function(event, data) { 
            vm.currentStep = data; 
        })

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

        $scope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                var state = toState.name.split(".")[1];
                var step;
                switch (state) {
                    case "location":
                        step = 1;
                        break;
                    case "camp":
                        step = 2;
                        break;
                    case "season":
                        step = 3;
                        break;
                    case "meta":
                        step = 4;
                        break;
                    case "image":
                        step = 5;
                        break;
                    case "gpx":
                        step = 6;
                        break;
                    case "finish":
                        step = 7;
                }
                $scope.$emit('currentStep', step);
                console.log(step);
            })


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiY29udGVudC9hcHAuY29udGVudC5qcyIsInVzZXIvYXBwLnVzZXIuanMiLCJyb3RhL2FwcC5yb3RhLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiY2FyZC9jYXJkLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicGFzc3dvcmQtdmVyaWZ5L3Bhc3N3b3JkLXZlcmlmeS5kaXJlY3RpdmUuanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJyZWdpc3Rlci9yZWdpc3Rlci5qcyIsInJvdGFla2xlL3JvdGFla2xlLmpzIiwicm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uanMiLCJyb3RhbGFyL3JvdGFsYXIuanMiLCJyb3RhbGFyLmRldGFpbC9yb3RhbGFyLmRldGFpbC5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIndlYXRoZXJBUEkuanMiLCJtYXAvbWFwLmNvbmZpZy5qcyIsIm1hcC9tYXAuZ2VvY29kZS5qcyIsIm1hcC9tYXAucmV2ZXJzZUdlb2NvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxVQUFVLGFBQWEsVUFBVSxRQUFRLGFBQWE7SUFDekQsSUFBSSxTQUFTOztJQUViLE9BQU8sT0FBTyxNQUFNLFFBQVEsS0FBSzs7OztBQUlyQyxPQUFPLG1CQUFtQixZQUFZO0lBQ2xDLEVBQUUseUJBQXlCLEtBQUssWUFBWTtRQUN4QyxJQUFJLE9BQU87UUFDWCxFQUFFLE1BQU0sVUFBVTtZQUNkLFFBQVEsVUFBVSxPQUFPLFNBQVM7Z0JBQzlCLElBQUksY0FBYztnQkFDbEIsRUFBRSxRQUFRLCtIQUErSCxPQUFPLFVBQVUsTUFBTTtvQkFDNUosS0FBSyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssU0FBUyxvQkFBb0IsY0FBYyxRQUFRLEtBQUs7d0JBQzdFLElBQUksT0FBTzs0QkFDUCxN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O1FBQ3pDLFNBQVMsUUFBUTtZQUNiLFFBQVE7V0FDVCxTQUFTLFdBQVc7WUFDbkIsSUFBSSxhQUFhLFVBQVUsU0FBUyxHQUFHO2dCQUNuQyxPQUFPLFNBQVMsUUFBUSxVQUFVLEdBQUc7bUJBQ2xDO2dCQUNILE9BQU8sU0FBUyxRQUFROztXQUU3QixVQUFVLEtBQUs7WUFDZCxPQUFPLFNBQVMsUUFBUTs7UUFFNUIsT0FBTyxTQUFTOztJQUVwQixPQUFPOzs7QUFHWDtFQUNFLE9BQU87RUFDUCxRQUFRLGtCQUFrQixnQkFBZ0IiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uIChzZWFyY2gsIHJlcGxhY2VtZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlbWVudCk7XHJcbn07XHJcblxyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcuZ2VvY29kZS1hdXRvY29tcGxldGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGF0KS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChxdWVyeSwgcHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZWRpY3Rpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICAkLmdldEpTT04oJ2h0dHBzOi8vZ2VvY29kZS1tYXBzLnlhbmRleC5ydS8xLngvP3Jlc3VsdHM9NSZiYm94PTI0LjEyNTk3NywzNC40NTIyMTh+NDUuMTA5ODYzLDQyLjYwMTYyMCZmb3JtYXQ9anNvbiZsYW5nPXRyX1RSJmdlb2NvZGU9JyArIHF1ZXJ5LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubmFtZSArICcsICcgKyBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24ucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb25nbGF0OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuUG9pbnQucG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YS5raW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0X3R5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYm94OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuYm91bmRlZEJ5LkVudmVsb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kZXNjcmlwdGlvbi5pbmRleE9mKCdUw7xya2l5ZScpID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9ucy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAocHJlZGljdGlvbnMgJiYgcHJlZGljdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXN1bHRzID0gJC5tYXAocHJlZGljdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jdGlvbiAocHJlZGljdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHZhciBkZXN0ID0gcHJlZGljdGlvbi5uYW1lICsgXCIsIFwiICsgcHJlZGljdGlvbi5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0ID0gZGVzdC5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzKHByZWRpY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlclNlbGVjdDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhdFNXID0gaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbG5nU1cgPSBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBsYXRORSA9IGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuZ05FID0gaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9ICcvYS8nICsgaXRlbS5uYW1lICtcclxuICAgICAgICAgICAgICAgICAgICAnP2xhdFNXPScgKyBsYXRTVy50b1N0cmluZygpICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ1NXPScgKyBsbmdTVy50b1N0cmluZygpICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxhdE5FPScgKyBsYXRORS50b1N0cmluZygpICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ05FPScgKyBsbmdORS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9ICc8c3BhbiBjbGFzcz1cIml0ZW0tYWRkcmVzc1wiPicgKyBpdGVtICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgIGZpdFRvRWxlbWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhhdCkub24oJ3R5cGVhaGVhZDpjaGFuZ2UnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGF0KS52YWwoaXRlbS5maW5kKCdhPnNwYW4uaXRlbS1hZGRyZXNzJykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG53aW5kb3cubW9iaWxlY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY2hlY2sgPSBmYWxzZTtcclxuICAgIChmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsIDQpKSkgY2hlY2sgPSB0cnVlO1xyXG4gICAgfSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XHJcbiAgICByZXR1cm4gY2hlY2s7XHJcbn07XHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICdhcHAubmF2YmFyJyxcclxuICAgICdhcHAubG9naW4nLFxyXG4gICAgJ2FwcC5yZWdpc3RlcicsXHJcbiAgICAnYXBwLmNhcmQnLCBcclxuICAgICdhcHAucHJvZmlsZScsXHJcbiAgICAnYXBwLnVzZXJTZXJ2aWNlJyxcclxuICAgICdhcHAudHJhY2tTZXJ2aWNlJyxcclxuICAgICdhcHAubWFya2VyUGFyc2VyJyxcclxuICAgICdhcHAubWFwJyxcclxuICAgICdhcHAuY29udGVudCcsICAgIFxyXG4gICAgJ2FwcC5yb3RhJyxcclxuICAgICdvYy5sYXp5TG9hZCcsXHJcbiAgICAndWkucm91dGVyJyxcclxuICAgICdsZWFmbGV0LWRpcmVjdGl2ZScsXHJcbiAgICAnYXBwLndlYXRoZXInLFxyXG4gICAgJ3Bhc3N3b3JkVmVyaWZ5JyxcclxuICBdKVxyXG4gIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJywnJGxvZ1Byb3ZpZGVyJywnJG9jTGF6eUxvYWRQcm92aWRlcicsJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsJGNvbXBpbGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH0pO1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxwcm9maWxlLWRpcmVjdGl2ZT48L3Byb2ZpbGUtZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwcm9maWxlU3RhdGUpO1xyXG4gIH1dKVxyXG4gIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlKSB7XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICByZXR1cm4gZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgICByZXR1cm4gdXNlclNlcnZpY2UuZ2V0VXNlcigpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgIGlmIChyZXNwb25kLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSBcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gcmVzcG9uZC5kYXRhLnVzZXI7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuZmxhZ0xvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIH0pKCk7IFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbnRlbnQnLCBbJ2FwcC5oZWFkZXInLCAnYXBwLmZvb3RlcicsJ3VpLnJvdXRlciddKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICAgICB2YXIgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnZGVmYXVsdFN0YXRlJywgXHJcbiAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9sYW5kaW5nL2xhbmRpbmcuaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGRlZmF1bHRTdGF0ZSk7XHJcbiAgICB9KVxyXG4gIFxyXG59KSgpOyIsIiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGEnLCBbJ2FwcC5yb3RhbGFyJywgJ2FwcC5yb3RhbGFyRGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9hL3t0ZXJtfT9sYXRTVyZsbmdTVyZsYXRORSZsbmdORScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhcj48L3JvdGFsYXI+JyxcclxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocm90YWxhclN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByb3RhbGFyRGV0YWlsU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncm90YWxhckRldGFpbCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YS86aWQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHJvdGFsYXItZGV0YWlsPjwvcm90YWxhci1kZXRhaWw+J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyRGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrQ2FtcFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmNhbXAnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2thbXAnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUua2FtcC9yb3RhZWtsZS5rYW1wLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tDYW1wU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU2Vhc29uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suc2Vhc29uJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9zZXpvbicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5zZWFzb24vcm90YWVrbGUuc2Vhc29uLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tTZWFzb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tJbWFnZVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmltYWdlJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXNpbWxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5pbWFnZS9yb3RhZWtsZS5pbWFnZS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrSW1hZ2VTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tHUFhTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5ncHgnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2dweCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5ncHgvcm90YWVrbGUuZ3B4Lmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tHUFhTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tGaW5pc2hTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5maW5pc2gnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2theWRldCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5maW5pc2gvcm90YWVrbGUuZmluaXNoLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tGaW5pc2hTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZm9vdGVyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdmb290ZXJEaXJlY3RpdmUnLCBmb290ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gZm9vdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgfTtcclxuICBcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxufSkoKTsgXHJcbiBcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuaGVhZGVyJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnaGVhZGxpbmVEaXJlY3RpdmUnLCBoZWFkbGluZURpcmVjdGl2ZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaGVhZGxpbmVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2hlYWRsaW5lL2hlYWRsaW5lLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEhlYWRsaW5lQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuICAgIH1cclxuXHJcbiAgICBIZWFkbGluZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICckaW50ZXJ2YWwnLCAnJHEnLCckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGxpbmVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkaW50ZXJ2YWwsICRxLCR3aW5kb3cpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiAgICAgICAgdm0uc2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3JvdGFsYXInLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtOiB2bS5lbG1hXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiI0F1dG9jb21wbGV0ZVwiKS5mb2N1cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChcIiNBdXRvY29tcGxldGVcIikub2Zmc2V0KCkudG9wIC0gODBcclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gd2luZG93LnNjcm9sbFggPSAwO1xyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuXHJcblxyXG4gICAgICAgICRpbnRlcnZhbChjaGFuZ2VCZywgNjUwMCk7XHJcblxyXG4gICAgICAgIHZhciBpID0gMTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlQmcoKSB7XHJcbiAgICAgICAgICAgIGlmIChpID09PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAvL3Jlc3RhcnRcclxuICAgICAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgLy8gdmFyIGltZ1VybCA9IFwidXJsKCcuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnJylcIjtcclxuICAgICAgICAgICAgdmFyIGltZ1VybCA9IFwiLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZ1wiO1xyXG5cclxuICAgICAgICAgICAgcHJlbG9hZChpbWdVcmwpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KFwiLmhlYWRsaW5lXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidXJsKFwiKyBpbWdVcmwgK1wiKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmVsb2FkKHVybCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltYWdlLmNvbXBsZXRlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4qIEBkZXNjIGNhcmQgY29tcG9uZW50IFxyXG4qIEBleGFtcGxlIDxjYXJkPjwvY2FyZD5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNhcmQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2NhcmREaXJlY3RpdmUnLCBjYXJkRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vY2FyZC9jYXJkLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnPCcsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6ICc8JyxcclxuICAgICAgICAgICAgb3duZXI6JzwnLFxyXG4gICAgICAgICAgICBpbWdTcmM6JzwnLFxyXG4gICAgICAgICAgICBpZDogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQ2FyZENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7IFxyXG4gICAgLy8gdm0uaW1nU3JjID0gdm0uaW1nU3JjLnNwbGl0KCdjbGllbnQnKVsxXTtcclxufSBcclxuIiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsb2dpbkRpcmVjdGl2ZScsIGxvZ2luRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGxvZ2luRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogRm9vdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4gKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiAqIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5uYXZiYXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ25hdmJhckRpcmVjdGl2ZScsIG5hdmJhckRpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL25hdmJhci9uYXZiYXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IG5hdmJhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmF2YmFyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTsgXHJcblxyXG4gICAgdm0ub3Blbk5hdiA9IG9wZW5OYXY7XHJcbiAgICB2bS5jbG9zZU5hdiA9IGNsb3NlTmF2O1xyXG5cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5OYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZU5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCAgPSBcIjAlXCI7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGFzc3dvcmRWZXJpZnknLCBbXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGFzc3dvcmRWZXJpZnknKS5kaXJlY3RpdmUoJ2VxdWFscycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLCAvLyBvbmx5IGFjdGl2YXRlIG9uIGVsZW1lbnQgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsIC8vIGdldCBhIGhvbGQgb2YgTmdNb2RlbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZ01vZGVsKSByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB3YXRjaCBvd24gdmFsdWUgYW5kIHJlLXZhbGlkYXRlIG9uIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gb2JzZXJ2ZSB0aGUgb3RoZXIgdmFsdWUgYW5kIHJlLXZhbGlkYXRlIG9uIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUoJ2VxdWFscycsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2YWx1ZXMgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDEgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDIgPSBhdHRycy5lcXVhbHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCB2YWxpZGl0eVxyXG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdlcXVhbHMnLCAhdmFsMSB8fCAhdmFsMiB8fCB2YWwxID09PSB2YWwyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3Byb2ZpbGVEaXJlY3RpdmUnLCBwcm9maWxlRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBwcm9maWxlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5cclxuXHJcbnByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAndXNlclNlcnZpY2UnLCAndHJhY2tTZXJ2aWNlJywgJ21hcmtlclBhcnNlciddO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UsdHJhY2tTZXJ2aWNlLG1hcmtlclBhcnNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yZWdpc3RlcicsIFsncGFzc3dvcmRWZXJpZnknXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyZWN0aXZlJywgcmVnaXN0ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gcmVnaXN0ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiByZWdpc3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhZWtsZScsIFsnYXBwLm1hcCcsICdhcHAudHJhY2tTZXJ2aWNlJywgJ25nRmlsZVVwbG9hZCcsICdhbmd1bGFyLWxhZGRhJ10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3JvdGFFa2xlQ29udHJvbGxlcicsIHJvdGFFa2xlQ29udHJvbGxlcilcclxuXHJcblxyXG4gICAgcm90YUVrbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAncmV2ZXJzZUdlb2NvZGUnLCAndHJhY2tTZXJ2aWNlJywgJyRzdGF0ZScsICdVcGxvYWQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3RhRWtsZUNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCBtYXBDb25maWdTZXJ2aWNlLCByZXZlcnNlR2VvY29kZSwgdHJhY2tTZXJ2aWNlLCAkc3RhdGUsIFVwbG9hZCkge1xyXG4gICAgICAgIC8vICRvY0xhenlMb2FkLmxvYWQoJy4uLy4uL3NlcnZpY2VzL21hcC9tYXAuYXV0b2NvbXBsZXRlLmpzJyk7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUpO1xyXG4gICAgICAgIC8vIHZtLnN0YXRlID0gJHN0YXRlO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkcm9vdFNjb3BlLnVzZXIpIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHJvb3RTY29wZS51c2VyLl9pZCkpIHtcclxuICAgICAgICAgICAgLy8gJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgICAgICAvLyBicmVhazsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdm0ub3duZWRCeSA9ICRyb290U2NvcGUudXNlci5faWQ7XHJcbiAgICAgICAgdm0uaW1nX3NyYyA9IFwic3JjXCI7XHJcbiAgICAgICAgdm0uc3VtbWFyeTtcclxuICAgICAgICB2bS5hbHRpdHVkZTtcclxuICAgICAgICB2bS5kaXN0YW5jZTtcclxuICAgICAgICB2bS5uYW1lID0gJyc7XHJcbiAgICAgICAgdm0uY29vcmRpbmF0ZXMgPSBbXTtcclxuICAgICAgICB2bS51cGxvYWRHUFggPSB1cGxvYWRHUFg7XHJcbiAgICAgICAgdm0udXBsb2FkUGljID0gdXBsb2FkUGljO1xyXG4gICAgICAgIHZtLmNhbXBTZWxlY3RlZCA9IGNhbXBTZWxlY3RlZDtcclxuXHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZtLnRvZ2dsZVN0YXRlID0gdHJ1ZTtcclxuICAgICAgICB2bS50b2dnbGVQYW5lbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLm5leHQtc3RlcC1wYW5lbCAucGFuZWwtYm9keScpLnRvZ2dsZSgnaGlkZScpO1xyXG4gICAgICAgICAgICAvLyBhbGVydCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLmFkZFRyYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0cmFja1NlcnZpY2UuYWRkVHJhY2sodm0pLnRoZW4oZnVuY3Rpb24gKGFkZFRyYWNrUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncm90YWxhcicpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoYWRkVHJhY2tFcnJvcikge1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZFBpYyhmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3Bob3Rvcy8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWdfc3JjID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRHUFgoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9ncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncHggPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5maW5pc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbXBTZWxlY3RlZChjYW1wKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImFkZHRyYWNrLnNlYXNvblwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHtcclxuICAgICAgICAgICAgbWFya2Vyczoge1xyXG4gICAgICAgICAgICAgICAgbWFpbk1hcmtlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdDogdm0uY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2bS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJhxZ9rYSBiaXIgbm9rdGF5YSB0xLFrbGF5YXJhayBrYXlkxLFyLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oJ2N1cnJlbnRTdGVwJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHsgXHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnRTdGVwID0gZGF0YTsgXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbihcImxlYWZsZXREaXJlY3RpdmVNYXAuY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWFmRXZlbnQgPSBhcmdzLmxlYWZsZXRFdmVudDtcclxuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUuZ2VvY29kZUxhdGxuZyhsZWFmRXZlbnQubGF0bG5nLmxhdCwgbGVhZkV2ZW50LmxhdGxuZy5sbmcpLnRoZW4oZnVuY3Rpb24gKGdlb2NvZGVTdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9jYXRpb24gPSBnZW9jb2RlU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubGF0ID0gbGVhZkV2ZW50LmxhdGxuZy5sYXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubG5nID0gbGVhZkV2ZW50LmxhdGxuZy5sbmc7XHJcbiAgICAgICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW2xlYWZFdmVudC5sYXRsbmcubG5nLCBsZWFmRXZlbnQubGF0bG5nLmxhdF07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRvU3RhdGUubmFtZS5zcGxpdChcIi5cIilbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RlcDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibG9jYXRpb25cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjYW1wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2Vhc29uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibWV0YVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZ3B4XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA3O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdjdXJyZW50U3RlcCcsIHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RlcCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiICIsImFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICByZXR1cm4gYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpIHx8IHZhbCA9PT0gbnVsbFxyXG59XHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yb3RhbGFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyb3RhbGFyJywgcm90YWxhcilcclxuXHJcbmZ1bmN0aW9uIHJvdGFsYXIoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFsYXIvcm90YWxhci5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogUm90YWxhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuUm90YWxhckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLFxyXG4gICAgJ21hcmtlclBhcnNlcicsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXRNYXBFdmVudHMnLCAnbGVhZmxldERhdGEnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnXHJcbl07XHJcblxyXG5mdW5jdGlvbiBSb3RhbGFyQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsXHJcbiAgICBtYXJrZXJQYXJzZXIsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXRNYXBFdmVudHMsIGxlYWZsZXREYXRhLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIHZtLmdldFRyYWNrID0gZ2V0VHJhY2s7XHJcbiAgICB2bS5tYXBBdXRvUmVmcmVzaCA9IHRydWU7XHJcbiAgICB2bS5vcGVuTWFwID0gb3Blbk1hcDtcclxuICAgIHZtLmNoYW5nZUltZyA9IGNoYW5nZUltZztcclxuICAgIHZtLnBhcmFtcyA9IHt9O1xyXG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxhdE5FKSB8fFxyXG4gICAgICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxuZ05FKSB8fFxyXG4gICAgICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxhdFNXKSB8fFxyXG4gICAgICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxuZ1NXKVxyXG4gICAgKSB7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gNDQuMjkyO1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdORSA9IDQxLjI2NDtcclxuICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSAzMi44MDU7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gMjcuNzczO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2bS5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGxhdE5FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRORSksXHJcbiAgICAgICAgICAgIGxuZ05FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdORSksXHJcbiAgICAgICAgICAgIGxhdFNXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRTVyksXHJcbiAgICAgICAgICAgIGxuZ1NXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdTVyksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuICAgICRyb290U2NvcGUuc2VhcmNoTG9jYXRpb24gPSAkc3RhdGVQYXJhbXMudGVybTtcclxuXHJcbiAgICAvLyBpZih3aW5kb3cubW9iaWxlY2hlY2sgJiYgdm0ubWFwQWN0aXZlKXtcclxuXHJcbiAgICAvLyB9XHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICBpZiAodm0ucGFyYW1zLmxhdE5FICYmIHZtLnBhcmFtcy5sbmdORSAmJiB2bS5wYXJhbXMubGF0U1cgJiYgdm0ucGFyYW1zLmxuZ1NXKSB7XHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdE5FLCB2bS5wYXJhbXMubG5nTkVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0U1csIHZtLnBhcmFtcy5sbmdTV10sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLnNldFpvb20obWFwLmdldFpvb20oKSAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRyYWNrKCkge1xyXG4gICAgICAgIHJldHVybiB0cmFja1NlcnZpY2UuZ2V0VHJhY2sodm0ucGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrcy5kYXRhID0gcmVzcG9uZC5kYXRhO1xyXG4gICAgICAgICAgICBpZiAodm0udHJhY2tzLmRhdGEgPT0gW10pIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFya2VyUGFyc2VyLmpzb25Ub01hcmtlckFycmF5KHZtLnRyYWNrcy5kYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2VycyA9IG1hcmtlclBhcnNlci50b09iamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gTC5nZW9Kc29uKHZtLnRyYWNrcy5kYXRhKS5nZXRCb3VuZHMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2Vyc0VtcHR5ID0gYW5ndWxhci5lcXVhbHMoT2JqZWN0LmtleXModm0ubWFya2VycykubGVuZ3RoLCAwKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgdm0uY2hhbmdlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICAvLyB2YXIgc3dhcCA9IG1hcmtlci5pY29uO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uID0gbWFya2VyLmljb25fc3dhcDtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbl9zd2FwID0gc3dhcDtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpLmxhdE5FID0gMjApO1xyXG5cclxuICAgICAgICAvLyBpZiAobWFya2VyLmZvY3VzKVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgbWFya2VyLmljb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS5yZW1vdmVJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjQjdBNEUzJyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0uem9vbU1hcmtlciA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICB2YXIgbGF0TG5ncyA9IFtcclxuICAgICAgICAgICAgW21hcmtlci5sYXQsIG1hcmtlci5sbmddXHJcbiAgICAgICAgXTtcclxuICAgICAgICB2YXIgbWFya2VyQm91bmRzID0gTC5sYXRMbmdCb3VuZHMobGF0TG5ncyk7XHJcbiAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcC5maXRCb3VuZHMobWFya2VyQm91bmRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5tYXBFdmVudHMgPSBsZWFmbGV0TWFwRXZlbnRzLmdldEF2YWlsYWJsZU1hcEV2ZW50cygpO1xyXG5cclxuXHJcbiAgICAvL2xvZyBldmVudHMgZm9yIG1hcmtlciBvYmplY3RzXHJcbiAgICBmb3IgKHZhciBrIGluIHZtLm1hcEV2ZW50cykge1xyXG4gICAgICAgIC8vICBjb25zb2xlLmxvZyh2bS5tYXBFdmVudHMpO1xyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci4nICsgdm0ubWFwRXZlbnRzW2tdO1xyXG4gICAgICAgICRzY29wZS4kb24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdmVyJykge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2hhbmdlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW91dCcpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZtLnJlbW92ZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0uZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5jbGljaycpIHtcclxuICAgICAgICAgICAgICAgIC8vICB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIC8vICB2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXS5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHZhciBtYXBFdmVudCA9ICdsZWFmbGV0RGlyZWN0aXZlTWFwLmRyYWdlbmQnO1xyXG5cclxuICAgICRzY29wZS4kb24obWFwRXZlbnQsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIHVwZGF0ZU1hcChhcmdzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBtYXBFdmVudDIgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC56b29tZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50MiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgdXBkYXRlTWFwKGFyZ3MpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTWFwKGFyZ3MpIHtcclxuICAgICAgICBpZiAodm0ubWFwQXV0b1JlZnJlc2gpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm1hcmtlcnMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0TkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nU1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJy5kYXRhLXZpeicpLndpZHRoKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgICAgICAnbGF0TkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ05FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICdsYXRTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG5nU1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YSc7XHJcblxyXG4gICAgZnVuY3Rpb24gb3Blbk1hcCgpIHtcclxuICAgICAgICB2bS5tYXBBY3RpdmUgPSAhdm0ubWFwQWN0aXZlO1xyXG4gICAgICAgICQoJy5kYXRhLXZpeicpLnRvZ2dsZUNsYXNzKCdtYXAtb3BlbicpO1xyXG4gICAgICAgICQoJy5tYXAtYXV0by1yZWZyZXNoJykudG9nZ2xlQ2xhc3MoJ3JlZnJlc2gtb3BlbicpO1xyXG4gICAgICAgICh2bS50b2dnbGVUaXRsZSA9PSAnIEhhcml0YScgPyB2bS50b2dnbGVUaXRsZSA9ICcgTGlzdGUnIDogdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YScpXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCQoJy5kYXRhLXZpeicpLndpZHRoKCkpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY2hhbmdlSW1nKCkge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyLmVsZW1lbnQoJy5ub3QtZm91bmQtaW1nJyksIGZ1bmN0aW9uICh2YWwsIGtleSkge1xyXG4gICAgICAgICAgICB2YWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZScpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0iLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhckRldGFpbCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhckRldGFpbCcsIHJvdGFsYXJEZXRhaWwpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyRGV0YWlsKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyLmRldGFpbC9yb3RhbGFyLmRldGFpbC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogUm90YWxhckRldGFpbENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuUm90YWxhckRldGFpbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0RGF0YScsICd3ZWF0aGVyQVBJJ107XHJcblxyXG5mdW5jdGlvbiBSb3RhbGFyRGV0YWlsQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgd2VhdGhlckFQSSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrRGV0YWlsID0ge307XHJcbiAgICB2bS5jZW50ZXIgPSB7fTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmM7XHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0uZ3B4RGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgd2VhdGhlckFQSS5kYXJrU2t5V2VhdGhlcih2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdm0ud2VhdGhlciA9IHJlcztcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjFcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjJcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseSA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29uc0RhaWx5V2hpdGUgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLndlYXRoZXIuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0ga2V5ICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrID0ga2V5ICsgMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcyA9IFwiaWNvblwiICsgcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtrID0gXCJpY29uXCIgKyBrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LmFkZChzcywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUuYWRkKGtrLCB2YWx1ZS5pY29uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHkucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHlXaGl0ZS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYod2luZG93Lm1vYmlsZWNoZWNrKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNjcm9sbFdoZWVsWm9vbS5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZHJhZ2dpbmcuZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1hcC5hZGRDb250cm9sKG5ldyBMLkNvbnRyb2wuRnVsbHNjcmVlbigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ3B4ID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5ncHg7IC8vIFVSTCB0byB5b3VyIEdQWCBmaWxlIG9yIHRoZSBHUFggaXRzZWxmXHJcbiAgICAgICAgICAgICAgICB2YXIgZyA9IG5ldyBMLkdQWChncHgsIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2x5bGluZV9vcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAneWVsbG93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGFzaEFycmF5OiAnMTAsMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6ICczJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogJzAuOSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcl9vcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdwdEljb25VcmxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJzogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnR2VvY2FjaGUgRm91bmQnOiAnaW1nL2dweC9nZW9jYWNoZS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BhcmsnOiAnaW1nL2dweC90cmVlLnBuZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJY29uVXJsOiAnaW1nL2ljb24tZ28uc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSWNvblVybDogJ2ltZy9pY29uLXN0b3Auc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93VXJsOiAnaW1nL3Bpbi1zaGFkb3cucG5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZGlzdGFuY2UgPSBlLnRhcmdldC5nZXRfZGlzdGFuY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmVsZU1pbiA9IGUudGFyZ2V0LmdldF9lbGV2YXRpb25fbWluKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNYXggPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21heCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzZXQwOiBlLnRhcmdldC5nZXRfZWxldmF0aW9uX2RhdGEoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhlLnRhcmdldC5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQuZ2V0Qm91bmRzKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0JvdW5kcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX25vcnRoRWFzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBlLnRhcmdldC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdCArIDAuMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmcgKyAwLjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3NvdXRoV2VzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBlLnRhcmdldC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCAtIDAuMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmcgLSAwLjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX25vcnRoRWFzdC5sYXQsIG5ld0JvdW5kcy5fbm9ydGhFYXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcnRoRWFzdCA9IEwubGF0TG5nKG5ld0JvdW5kcy5fc291dGhXZXN0LmxhdCwgbmV3Qm91bmRzLl9zb3V0aFdlc3QubG5nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXAuc2V0TWF4Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLl9sYXllcnNNaW5ab29tPTEwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGcuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyRm9yRGV0YWlsKCk7XHJcbiAgICB2YXIgY29udHJvbHMgPSB7XHJcbiAgICAgICAgZnVsbHNjcmVlbjoge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdm0uY29udHJvbHMgPSBjb250cm9scztcclxuXHJcbn0iLCIvKipcclxuICogQGRlc2MgU2VydmljZXMgdGhhdCBjb252ZXJ0cyBnZW9qc29uIGZlYXR1cmVzIHRvIG1hcmtlcnMgZm9yIGhhbmRsaW5nIGxhdGVyXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFya2VyUGFyc2VyKCRxKSB7XHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBqc29uVG9NYXJrZXJBcnJheToganNvblRvTWFya2VyQXJyYXksXHJcbiAgICAgICAgdG9PYmplY3Q6IHRvT2JqZWN0LFxyXG4gICAgICAgIG1hcmtlckNvbnRlbnQ6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG4gICAgLy8gY29udmVydCBmZWF0dXJlIGdlb2pzb24gdG8gYXJyYXkgb2YgbWFya2Vyc1xyXG4gICAgZnVuY3Rpb24ganNvblRvTWFya2VyQXJyYXkodmFsKSB7XHJcbiAgICAgICAgdmFyIGRlZmVyZWQgPSAkcS5kZWZlcigpOyAvLyBkZWZlcmVkIG9iamVjdCByZXN1bHQgb2YgYXN5bmMgb3BlcmF0aW9uXHJcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBzZXJ2aWNlLm1hcmtlckNvbnRlbnQgPSAnXHQ8ZGl2IGNsYXNzPVwiY2FyZCBjYXJkLW9uLW1hcFwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWltYWdlLWNvbnRhaW5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWltYWdlLWNvdmVyXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGltZyBkYXRhLW5nLXNyYz1cIicgKyB2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjICsgJ1wiIGNsYXNzPVwiaW1nLWZsdWlkXCIgYWx0PVwiXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAnPGE+PGRpdiBjbGFzcz1cIm1hc2sgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0XCI+PC9kaXY+PC9hPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWJsb2NrXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGg0IGNsYXNzPVwiY2FyZC10aXRsZSBmb250LXNpemUtMTZcIj48YSBocmVmPVwicm90YS8nKyB2YWxbaV0uX2lkKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nK3ZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUrJzwvYT48L2g0PicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgIHZhciBtYXJrID0ge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXI6IFwicm90YWxhclwiLFxyXG4gICAgICAgICAgICAgICAgbGF0OiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2U6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBzZXJ2aWNlLm1hcmtlckNvbnRlbnQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIGljb246IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUxMkRBOCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBpY29uX3N3YXAgOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdmFsW2ldLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFsdGl0dWRlXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmFsdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzdGFuY2VcIjogdmFsW2ldLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW1tYXJ5XCI6IHZhbFtpXS5wcm9wZXJ0aWVzLnN1bW1hcnksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvd25lclwiOiB2YWxbaV0ucHJvcGVydGllcy5vd25lZEJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1nX3NyY1wiOiB2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG1hcmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3V0cHV0KSB7XHJcbiAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAvLyAgICAgZGVmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xyXG4gICAgICAgIHZhciBydiA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSAhPT0gdW5kZWZpbmVkKSBydltpXSA9IGFycmF5W2ldO1xyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm1hcmtlclBhcnNlcicsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ21hcmtlclBhcnNlcicsIG1hcmtlclBhcnNlcik7IiwiZnVuY3Rpb24gdHJhY2tTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIGVuZHBvaW50ID0gJ2h0dHA6bG9jYWxob3N0OjgwODAvJ1xyXG5cclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFRyYWNrOiBnZXRUcmFjayxcclxuXHRcdGFkZFRyYWNrOiBhZGRUcmFjayxcclxuXHRcdGdldFRyYWNrRGV0YWlsOmdldFRyYWNrRGV0YWlsLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrKHBhcmFtcykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcz9sYXRORT0nKyBwYXJhbXMubGF0TkUrJyZsbmdORT0nK3BhcmFtcy5sbmdORSArJyZsYXRTVz0nK3BhcmFtcy5sYXRTVyArJyZsbmdTVz0nK3BhcmFtcy5sbmdTVyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuXHRcdFx0fSxcclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2tEZXRhaWwoaWQpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MvJytpZCxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBhZGRUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MnLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGRhdGE6ICQucGFyYW0oe1xyXG5cdFx0XHRcdFwibmFtZVwiOiB0cmFjay5uYW1lLFxyXG5cdFx0XHRcdFwiZGlzdGFuY2VcIjogdHJhY2suZGlzdGFuY2UsXHJcblx0XHRcdFx0XCJhbHRpdHVkZVwiOiB0cmFjay5hbHRpdHVkZSxcclxuXHRcdFx0XHRcInN1bW1hcnlcIjogdHJhY2suc3VtbWFyeSxcclxuXHRcdFx0XHRcImltZ19zcmNcIjogdHJhY2suaW1nX3NyYyxcclxuXHRcdFx0XHRcImNvb3JkaW5hdGVzXCI6IHRyYWNrLmNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdFwib3duZWRCeVwiOiB0cmFjay5vd25lZEJ5LFxyXG5cdFx0XHRcdFwiZ3B4XCI6IHRyYWNrLmdweCxcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcbn1cclxuYW5ndWxhclxyXG5cdC5tb2R1bGUoJ2FwcC50cmFja1NlcnZpY2UnLCBbXSlcclxuXHQuZmFjdG9yeSgndHJhY2tTZXJ2aWNlJywgdHJhY2tTZXJ2aWNlKTsiLCJmdW5jdGlvbiB1c2VyU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VXNlcjogZ2V0VXNlcixcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICBcdHJldHVybiAkaHR0cCh7XHJcbiAgICBcdFx0bWV0aG9kOiAnR0VUJyxcclxuICAgIFx0XHR1cmw6ICdhcGkvcHJvZmlsZSdcclxuICAgIFx0fSlcclxuICAgIH07IFxyXG59IFxyXG5hbmd1bGFyXHJcbi5tb2R1bGUoJ2FwcC51c2VyU2VydmljZScsIFtdKVxyXG4uZmFjdG9yeSgndXNlclNlcnZpY2UnLCB1c2VyU2VydmljZSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgc2VydmljZUlkID0gJ3dlYXRoZXJBUEknO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAud2VhdGhlcicsIFtdKVxyXG4gICAgICAgIC5mYWN0b3J5KHNlcnZpY2VJZCwgWyckcScsICckaHR0cCcsIHdlYXRoZXJBUEldKTtcclxuXHJcbiAgICBmdW5jdGlvbiB3ZWF0aGVyQVBJKCRxLCAkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICB3ZWF0aGVyOiB3ZWF0aGVyLFxyXG4gICAgICAgICAgICBmb3JlY2FzdDogZm9yZWNhc3QsXHJcbiAgICAgICAgICAgIGRhcmtTa3lXZWF0aGVyOiBkYXJrU2t5V2VhdGhlcixcclxuICAgICAgICAgICAgYXBwaWQ6ICdmYTJkNTkzYWE1OGU5MGZkZTMyODQyNmU2NGE2NGUzOCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB3ZWF0aGVyKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwKHtcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiAnJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0nICsgbGF0ICsgJyZsb249JyArIGxuZyArICcmYXBwaWQ9JyArIHNlcnZpY2UuYXBwaWQgKyAnJnVuaXRzPW1ldHJpYyZsYW5nPXRyJ1xyXG4gICAgICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5jb2QgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0SG91cnMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0TWludXRlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBjdXJyZW50IGhvdXIgdXNpbmcgb2Zmc2V0IGZyb20gVVRDLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZXRpbWUgPSBuZXcgRGF0ZSgocmVzLmRhdGEuZHQgKiAxMDAwKSArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3VucmlzZSA9IG5ldyBEYXRlKHJlcy5kYXRhLnN5cy5zdW5yaXNlICogMTAwMCArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3Vuc2V0ID0gbmV3IERhdGUocmVzLmRhdGEuc3lzLnN1bnNldCAqIDEwMDAgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFDdXJyZW50ID0ge31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuZGF0ZXRpbWUgPSBkYXRldGltZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPSBkYXRhQ3VycmVudC5kYXRldGltZS5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5zdW5yaXNlSG91ciA9IHN1bnJpc2UuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuc3Vuc2V0SG91ciA9IHN1bnNldC5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhvdXIgYmV0d2VlbiBzdW5zZXQgYW5kIHN1bnJpc2UgYmVpbmcgbmlnaHQgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyID49IGRhdGFDdXJyZW50LnN1bnNldEhvdXIgfHwgZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPD0gZGF0YUN1cnJlbnQuc3VucmlzZUhvdXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgd2VhdGhlciBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyRGVzY3JpcHRpb24gPSByZXMuZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmVzLmRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbi5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhbmdlIHdlYXRoZXIgaWNvbiBjbGFzcyBhY2NvcmRpbmcgdG8gd2VhdGhlciBjb2RlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC10aHVuZGVyc3Rvcm1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXN0b3JtLXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXJhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXNub3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXJhaW4tbWl4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzQxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWZvZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1jbGVhclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtY2xvdWR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1oYWlsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1jbG91ZHktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktdGh1bmRlcnN0b3JtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zdG9ybS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1yYWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zbm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1yYWluLW1peFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc0MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktZm9nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zdW5ueVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktY2xvdWR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1oYWlsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1jbG91ZHktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzYxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kdXN0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXNtb2tlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc3MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU3OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1OTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc3Ryb25nLXdpbmRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzgxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS10b3JuYWRvXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1odXJyaWNhbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc25vd2ZsYWtlLWNvbGRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktaG90XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudDogZGF0YUN1cnJlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXMuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlamVjdC5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IDJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcmVjYXN0KGxhdCwgbG5nKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGFya1NreVdlYXRoZXIobGF0LCBsbmcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS93ZWF0aGVyLycgKyBsYXQgKyAnLycgKyBsbmcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5PcGVyYXRpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmN1cnJlbnRseS50aW1lID0gbmV3IERhdGUoKGRhdGEuY3VycmVudGx5LnRpbWUgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhaWx5LmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhaWx5LmRhdGFba2V5XS50aW1lID0gIG5ldyBEYXRlKCh2YWx1ZS50aW1lICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlamVjdC5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IDJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiZnVuY3Rpb24gbWFwQ29uZmlnU2VydmljZSgpIHtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBnZXRMYXllcjogZ2V0TGF5ZXIsXHJcbiAgICAgICAgZ2V0Q2VudGVyOiBnZXRDZW50ZXIsXHJcbiAgICAgICAgZ2V0TGF5ZXJGb3JEZXRhaWw6IGdldExheWVyRm9yRGV0YWlsLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VsYXllcnM6IHtcclxuICAgICAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIE1hcGJveF9TYXRlbGxpdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVXlkdScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L3NhdGVsbGl0ZS1zdHJlZXRzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIE1hcGJveF9PdXRkb29yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9vdXRkb29ycy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfTGFuc2NhcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnxLB6b2hpcHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9sYW5kc2NhcGUve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgWWFuZGV4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1lhbmRleCBZb2wnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd5YW5kZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICBsYXllck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJUeXBlOiAnbWFwJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb3ZlcmxheXM6IHtcclxuICAgICAgICAgICAgICAgIHJvdGFsYXI6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ3JvdXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdSb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxheWVycztcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q2VudGVyKCkge1xyXG4gICAgICAgIHZhciBjZW50ZXIgPSB7XHJcbiAgICAgICAgICAgIGxhdDogMzkuOTAzMjkxOCxcclxuICAgICAgICAgICAgbG5nOiAzMi42MjIzMzk2LFxyXG4gICAgICAgICAgICB6b29tOiA2XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXJGb3JEZXRhaWwoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBcmF6aScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIE1hcGJveF9TYXRlbGxpdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVXlkdScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L3NhdGVsbGl0ZS1zdHJlZXRzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIE1hcGJveF9PdXRkb29yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9vdXRkb29ycy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFlhbmRleDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdZYW5kZXggWW9sJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneWFuZGV4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyVHlwZTogJ21hcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXAnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXBDb25maWdTZXJ2aWNlJywgbWFwQ29uZmlnU2VydmljZSk7IiwiZnVuY3Rpb24gZ2VvY29kZSgkcSkge1xyXG4gIHJldHVybiB7IFxyXG4gICAgZ2VvY29kZUFkZHJlc3M6IGZ1bmN0aW9uKGFkZHJlc3MpIHtcclxuICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IGFkZHJlc3MgfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcclxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgICAgLy8gd2luZG93LmZpbmRMb2NhdGlvbihyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgnZ2VvY29kZScsIGdlb2NvZGUpOyIsImZ1bmN0aW9uIHJldmVyc2VHZW9jb2RlKCRxLCAkaHR0cCkge1xyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgb2JqLmdlb2NvZGVMYXRsbmcgPSBmdW5jdGlvbiBnZW9jb2RlUG9zaXRpb24obGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHtcclxuICAgICAgICAgICAgbGF0TG5nOiBsYXRsbmdcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlcyAmJiByZXNwb25zZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2VzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ3JldmVyc2VHZW9jb2RlJywgcmV2ZXJzZUdlb2NvZGUpOyJdfQ==
