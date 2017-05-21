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
                
                a.href = '/rotalar/' + item.name +
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
    'app.connect',
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

     var connectState = {
      name: 'connect',
      url: '/eposta-bagla',
      template: '<connect-component></connect-component>'
    };
    $stateProvider.state(connectState);
  }])



  })(); 

  (function () {
    'use strict';
  
  angular.module('app').run(["$rootScope", "userService", function ($rootScope, userService) {
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
                url: '/rotalar/{term}?latSW&lngSW&latNE&lngNE',
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
    .module('app.connect', [])
    .directive('connectComponent', connectComponent);
   
function connectComponent() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/user/connect/connect.html',
        // scope: {
        //     max: '='
        // },
        controller: connectController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function connectController() {
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
        vm.isCamp = null;
        vm.seasons = [];

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
            vm.isCamp = camp;
        }

        vm.seasons = [{
                name: 'ilkbahar',
                img: '../../img/season/forest.svg',
                id: 10
            },
            {
                name: 'Yaz',
                img: '../../img/season/beach.svg',
                id: 20,
            },
            {
                name: 'Sonbahar',
                img: '../../img/season/fields.svg',
                id: 30,
            },
            {
                name: 'Kış',
                img: '../../img/season/mountains.svg',
                id: 40,
            }
        ];

        vm.selectedSeasons = [];
        vm.addSeason = addSeason;

        function addSeason(index) {
            var i = vm.selectedSeasons.indexOf(vm.seasons[index].id);
            if (i > -1)
                vm.selectedSeasons.splice(i, 1);
            else
                vm.selectedSeasons.push(vm.seasons[index].id);
            console.log(vm.selectedSeasons);
        };

        vm.checkAvailability = checkAvailability;
        function checkAvailability(arr, val) {
            return arr.some(function (arrVal) {
                return val === arrVal;
            });
        };

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

        $scope.$on('currentStep', function (event, data) {
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
        // türkiyeye sabitlemek için
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
				"isCamp": track.isCamp,
				"seasons": track.selectedSeasons,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiYXBwLnJ1bi5qcyIsImNvbnRlbnQvYXBwLmNvbnRlbnQuanMiLCJ1c2VyL2FwcC51c2VyLmpzIiwicm90YS9hcHAucm90YS5qcyIsImZvb3Rlci9mb290ZXIuanMiLCJoZWFkbGluZS9oZWFkbGluZS5qcyIsImNhcmQvY2FyZC5kaXJlY3RpdmUuanMiLCJsb2dpbi9sb2dpbi5qcyIsImNvbm5lY3QvY29ubmVjdC5kaXJlY3RpdmUuanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicGFzc3dvcmQtdmVyaWZ5L3Bhc3N3b3JkLXZlcmlmeS5kaXJlY3RpdmUuanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJyZWdpc3Rlci9yZWdpc3Rlci5qcyIsInJvdGFla2xlL3JvdGFla2xlLmpzIiwicm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uanMiLCJyb3RhbGFyL3JvdGFsYXIuanMiLCJyb3RhbGFyLmRldGFpbC9yb3RhbGFyLmRldGFpbC5qcyIsIm1hcmtlcnBhcnNlci5qcyIsInRyYWNrLmpzIiwidXNlci5qcyIsIndlYXRoZXJBUEkuanMiLCJtYXAvbWFwLmNvbmZpZy5qcyIsIm1hcC9tYXAuZ2VvY29kZS5qcyIsIm1hcC9tYXAucmV2ZXJzZUdlb2NvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxVQUFVLGFBQWEsVUFBVSxRQUFRLGFBQWE7SUFDekQsSUFBSSxTQUFTOztJQUViLE9BQU8sT0FBTyxNQUFNLFFBQVEsS0FBSzs7OztBQUlyQyxPQUFPLG1CQUFtQixZQUFZO0lBQ2xDLEVBQUUseUJBQXlCLEtBQUssWUFBWTtRQUN4QyxJQUFJLE9BQU87UUFDWCxFQUFFLE1BQU0sVUFBVTtZQUNkLFFBQVEsVUFBVSxPQUFPLFNBQVM7Z0JBQzlCLElBQUksY0FBYztnQkFDbEIsRUFBRSxRQUFRLCtIQUErSCxPQUFPLFVBQVUsTUFBTTtvQkFDNUosS0FBSyxJQUFJLElBQUksR0FBRyxJQUFJLEtB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LE9BQU8sS0FBSyxPQUFPLEtBQUs7UUFDekMsU0FBUyxRQUFRO1lBQ2IsUUFBUTtXQUNULFNBQVMsV0FBVztZQUNuQixJQUFJLGFBQWEsVUFBVSxTQUFTLEdBQUc7Z0JBQ25DLE9BQU8sU0FBUyxRQUFRLFVBQVUsR0FBRzttQkFDbEM7Z0JBQ0gsT0FBTyxTQUFTLFFBQVE7O1dBRTdCLFVBQVUsS0FBSztZQUNkLE9BQU8sU0FBUyxRQUFROztRQUU1QixPQUFPLFNBQVM7O0lBRXBCLE9BQU87OztBQUdYO0VBQ0UsT0FBTztFQUNQLFFBQVEsa0JBQWtCLGdCQUFnQiIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24gKHNlYXJjaCwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiB0YXJnZXQuc3BsaXQoc2VhcmNoKS5qb2luKHJlcGxhY2VtZW50KTtcclxufTtcclxuXHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5nZW9jb2RlLWF1dG9jb21wbGV0ZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAkKHRoYXQpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24gKHF1ZXJ5LCBwcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJlZGljdGlvbnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICQuZ2V0SlNPTignaHR0cHM6Ly9nZW9jb2RlLW1hcHMueWFuZGV4LnJ1LzEueC8/cmVzdWx0cz01JmJib3g9MjQuMTI1OTc3LDM0LjQ1MjIxOH40NS4xMDk4NjMsNDIuNjAxNjIwJmZvcm1hdD1qc29uJmxhbmc9dHJfVFImZ2VvY29kZT0nICsgcXVlcnksIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5uYW1lICsgJywgJyArIGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbi5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdsYXQ6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5Qb2ludC5wb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLmtpbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRfdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJib3g6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5ib3VuZGVkQnkuRW52ZWxvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRlc2NyaXB0aW9uLmluZGV4T2YoJ1TDvHJraXllJykgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChwcmVkaWN0aW9ucyAmJiBwcmVkaWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHJlc3VsdHMgPSAkLm1hcChwcmVkaWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZ1bmN0aW9uIChwcmVkaWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGRlc3QgPSBwcmVkaWN0aW9uLm5hbWUgKyBcIiwgXCIgKyBwcmVkaWN0aW9uLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRlc3QgPSBkZXN0LnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MocHJlZGljdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFmdGVyU2VsZWN0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0U1cgPSBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBsbmdTVyA9IGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhdE5FID0gaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbG5nTkUgPSBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gJy9yb3RhbGFyLycgKyBpdGVtLm5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICAgICc/bGF0U1c9JyArIGxhdFNXLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nU1c9JyArIGxuZ1NXLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbGF0TkU9JyArIGxhdE5FLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nTkU9JyArIGxuZ05FLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpdGVtID0gJzxzcGFuIGNsYXNzPVwiaXRlbS1hZGRyZXNzXCI+JyArIGl0ZW0gKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgZml0VG9FbGVtZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGF0KS5vbigndHlwZWFoZWFkOmNoYW5nZScsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQpLnZhbChpdGVtLmZpbmQoJ2E+c3Bhbi5pdGVtLWFkZHJlc3MnKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbndpbmRvdy5tb2JpbGVjaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGVjayA9IGZhbHNlO1xyXG4gICAgKGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgaWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCwgNCkpKSBjaGVjayA9IHRydWU7XHJcbiAgICB9KShuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgd2luZG93Lm9wZXJhKTtcclxuICAgIHJldHVybiBjaGVjaztcclxufTtcclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgJ2FwcC5uYXZiYXInLFxyXG4gICAgJ2FwcC5sb2dpbicsXHJcbiAgICAnYXBwLnJlZ2lzdGVyJyxcclxuICAgICdhcHAuY29ubmVjdCcsXHJcbiAgICAnYXBwLmNhcmQnLCBcclxuICAgICdhcHAucHJvZmlsZScsXHJcbiAgICAnYXBwLnVzZXJTZXJ2aWNlJyxcclxuICAgICdhcHAudHJhY2tTZXJ2aWNlJyxcclxuICAgICdhcHAubWFya2VyUGFyc2VyJyxcclxuICAgICdhcHAubWFwJyxcclxuICAgICdhcHAuY29udGVudCcsICAgIFxyXG4gICAgJ2FwcC5yb3RhJyxcclxuICAgICdvYy5sYXp5TG9hZCcsXHJcbiAgICAndWkucm91dGVyJyxcclxuICAgICdsZWFmbGV0LWRpcmVjdGl2ZScsXHJcbiAgICAnYXBwLndlYXRoZXInLFxyXG4gICAgJ3Bhc3N3b3JkVmVyaWZ5JyxcclxuICBdKVxyXG4gIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJywnJGxvZ1Byb3ZpZGVyJywnJG9jTGF6eUxvYWRQcm92aWRlcicsJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsJGNvbXBpbGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH0pO1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxwcm9maWxlLWRpcmVjdGl2ZT48L3Byb2ZpbGUtZGlyZWN0aXZlPidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwcm9maWxlU3RhdGUpO1xyXG5cclxuICAgICB2YXIgY29ubmVjdFN0YXRlID0ge1xyXG4gICAgICBuYW1lOiAnY29ubmVjdCcsXHJcbiAgICAgIHVybDogJy9lcG9zdGEtYmFnbGEnLFxyXG4gICAgICB0ZW1wbGF0ZTogJzxjb25uZWN0LWNvbXBvbmVudD48L2Nvbm5lY3QtY29tcG9uZW50PidcclxuICAgIH07XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShjb25uZWN0U3RhdGUpO1xyXG4gIH1dKVxyXG5cclxuXHJcblxyXG4gIH0pKCk7IFxyXG4iLCIgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgXHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIHJldHVybiBnZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbmQuZGF0YS5PcGVyYXRpb25SZXN1bHQpIFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXNwb25kLmRhdGEudXNlcjtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mbGFnTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIFxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29udGVudCcsIFsnYXBwLmhlYWRlcicsICdhcHAuZm9vdGVyJywndWkucm91dGVyJ10pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0U3RhdGUnLCBcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2xhbmRpbmcvbGFuZGluZy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmYXVsdFN0YXRlKTtcclxuICAgIH0pXHJcbiAgXHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YScsIFsnYXBwLnJvdGFsYXInLCAnYXBwLnJvdGFsYXJEZXRhaWwnLCAnYXBwLnJvdGFla2xlJywgJ3VpLnJvdXRlciddKVxyXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgICAgICB2YXIgcm90YWxhclN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGFsYXIve3Rlcm19P2xhdFNXJmxuZ1NXJmxhdE5FJmxuZ05FJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxyb3RhbGFyPjwvcm90YWxhcj4nLFxyXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJEZXRhaWxTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyRGV0YWlsJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhLzppZCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhci1kZXRhaWw+PC9yb3RhbGFyLWRldGFpbD4nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJvdGFsYXJEZXRhaWxTdGF0ZSk7XHJcbiBcclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2snLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGFla2xlJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlL3JvdGFla2xlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3JvdGFFa2xlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdyb3RhRWtsZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTG9jYXRpb25TdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5sb2NhdGlvbicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva29udW0nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uaHRtbCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tMb2NhdGlvblN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja01ldGFTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5tZXRhJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iaWxnaScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5tZXRhL3JvdGFla2xlLm1ldGEuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja01ldGFTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tDYW1wU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suY2FtcCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva2FtcCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5rYW1wL3JvdGFla2xlLmthbXAuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0NhbXBTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tTZWFzb25TdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5zZWFzb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Nlem9uJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLnNlYXNvbi9yb3RhZWtsZS5zZWFzb24uaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1NlYXNvblN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ltYWdlU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Jlc2ltbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmltYWdlL3JvdGFla2xlLmltYWdlLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tJbWFnZVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0dQWFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmdweCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZ3B4JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmdweC9yb3RhZWtsZS5ncHguaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0dQWFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ZpbmlzaFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmZpbmlzaCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva2F5ZGV0JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmZpbmlzaC9yb3RhZWtsZS5maW5pc2guaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ZpbmlzaFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mb290ZXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2Zvb3RlckRpcmVjdGl2ZScsIGZvb3RlckRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBmb290ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2Zvb3Rlci9mb290ZXIuaHRtbCcsXHJcbiAgICB9O1xyXG4gIFxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG59KSgpOyBcclxuIFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5oZWFkZXInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdoZWFkbGluZURpcmVjdGl2ZScsIGhlYWRsaW5lRGlyZWN0aXZlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoZWFkbGluZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvaGVhZGxpbmUvaGVhZGxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogSGVhZGxpbmVDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIEhlYWRsaW5lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJyRpbnRlcnZhbCcsICckcScsJyR3aW5kb3cnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkbGluZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRpbnRlcnZhbCwgJHEsJHdpbmRvdykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuICAgICAgICB2bS5zZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygncm90YWxhcicsIHtcclxuICAgICAgICAgICAgICAgIHRlcm06IHZtLmVsbWFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjQXV0b2NvbXBsZXRlXCIpLmZvY3VzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKFwiI0F1dG9jb21wbGV0ZVwiKS5vZmZzZXQoKS50b3AgLSA4MFxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB3aW5kb3cuc2Nyb2xsWCA9IDA7XHJcbiAgICAgICAgJHdpbmRvdy5zY3JvbGxUbygwLDApO1xyXG5cclxuXHJcbiAgICAgICAgJGludGVydmFsKGNoYW5nZUJnLCA2NTAwKTtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAxO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VCZygpIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgIC8vcmVzdGFydFxyXG4gICAgICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAvLyB2YXIgaW1nVXJsID0gXCJ1cmwoJy4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGcnKVwiO1xyXG4gICAgICAgICAgICB2YXIgaW1nVXJsID0gXCIuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnXCI7XHJcblxyXG4gICAgICAgICAgICBwcmVsb2FkKGltZ1VybCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCIuaGVhZGxpbmVcIilcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ1cmwoXCIrIGltZ1VybCArXCIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZWxvYWQodXJsKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgIGltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1hZ2UuY29tcGxldGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2MgY2FyZCBjb21wb25lbnQgXHJcbiogQGV4YW1wbGUgPGNhcmQ+PC9jYXJkPlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY2FyZCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnY2FyZERpcmVjdGl2ZScsIGNhcmREaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gY2FyZERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9jYXJkL2NhcmQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICc8JyxcclxuICAgICAgICAgICAgc3VtbWFyeTogJzwnLFxyXG4gICAgICAgICAgICBvd25lcjonPCcsXHJcbiAgICAgICAgICAgIGltZ1NyYzonPCcsICAgIFxyXG4gICAgICAgICAgICBpZDogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQ2FyZENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7IFxyXG4gICAgLy8gdm0uaW1nU3JjID0gdm0uaW1nU3JjLnNwbGl0KCdjbGllbnQnKVsxXTtcclxufSBcclxuIiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsb2dpbkRpcmVjdGl2ZScsIGxvZ2luRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGxvZ2luRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogRm9vdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb25uZWN0JywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdjb25uZWN0Q29tcG9uZW50JywgY29ubmVjdENvbXBvbmVudCk7XHJcbiAgIFxyXG5mdW5jdGlvbiBjb25uZWN0Q29tcG9uZW50KCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9jb25uZWN0L2Nvbm5lY3QuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbm5lY3RDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbm5lY3RDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4gKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiAqIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5uYXZiYXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ25hdmJhckRpcmVjdGl2ZScsIG5hdmJhckRpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL25hdmJhci9uYXZiYXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IG5hdmJhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmF2YmFyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTsgXHJcblxyXG4gICAgdm0ub3Blbk5hdiA9IG9wZW5OYXY7XHJcbiAgICB2bS5jbG9zZU5hdiA9IGNsb3NlTmF2O1xyXG5cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5OYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZU5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCAgPSBcIjAlXCI7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGFzc3dvcmRWZXJpZnknLCBbXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGFzc3dvcmRWZXJpZnknKS5kaXJlY3RpdmUoJ2VxdWFscycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLCAvLyBvbmx5IGFjdGl2YXRlIG9uIGVsZW1lbnQgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsIC8vIGdldCBhIGhvbGQgb2YgTmdNb2RlbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZ01vZGVsKSByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB3YXRjaCBvd24gdmFsdWUgYW5kIHJlLXZhbGlkYXRlIG9uIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gb2JzZXJ2ZSB0aGUgb3RoZXIgdmFsdWUgYW5kIHJlLXZhbGlkYXRlIG9uIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUoJ2VxdWFscycsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2YWx1ZXMgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDEgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDIgPSBhdHRycy5lcXVhbHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCB2YWxpZGl0eVxyXG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdlcXVhbHMnLCAhdmFsMSB8fCAhdmFsMiB8fCB2YWwxID09PSB2YWwyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3Byb2ZpbGVEaXJlY3RpdmUnLCBwcm9maWxlRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBwcm9maWxlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5cclxuXHJcbnByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAndXNlclNlcnZpY2UnLCAndHJhY2tTZXJ2aWNlJywgJ21hcmtlclBhcnNlciddO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UsdHJhY2tTZXJ2aWNlLG1hcmtlclBhcnNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yZWdpc3RlcicsIFsncGFzc3dvcmRWZXJpZnknXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyZWN0aXZlJywgcmVnaXN0ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gcmVnaXN0ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiByZWdpc3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhZWtsZScsIFsnYXBwLm1hcCcsICdhcHAudHJhY2tTZXJ2aWNlJywgJ25nRmlsZVVwbG9hZCcsICdhbmd1bGFyLWxhZGRhJ10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3JvdGFFa2xlQ29udHJvbGxlcicsIHJvdGFFa2xlQ29udHJvbGxlcilcclxuXHJcblxyXG4gICAgcm90YUVrbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAncmV2ZXJzZUdlb2NvZGUnLCAndHJhY2tTZXJ2aWNlJywgJyRzdGF0ZScsICdVcGxvYWQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3RhRWtsZUNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCBtYXBDb25maWdTZXJ2aWNlLCByZXZlcnNlR2VvY29kZSwgdHJhY2tTZXJ2aWNlLCAkc3RhdGUsIFVwbG9hZCkge1xyXG4gICAgICAgIC8vICRvY0xhenlMb2FkLmxvYWQoJy4uLy4uL3NlcnZpY2VzL21hcC9tYXAuYXV0b2NvbXBsZXRlLmpzJyk7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUpO1xyXG4gICAgICAgIC8vIHZtLnN0YXRlID0gJHN0YXRlO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkcm9vdFNjb3BlLnVzZXIpIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHJvb3RTY29wZS51c2VyLl9pZCkpIHtcclxuICAgICAgICAgICAgLy8gJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgICAgICAvLyBicmVhazsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdm0ub3duZWRCeSA9ICRyb290U2NvcGUudXNlci5faWQ7XHJcblxyXG4gICAgICAgIHZtLmltZ19zcmMgPSBcInNyY1wiO1xyXG4gICAgICAgIHZtLnN1bW1hcnk7XHJcbiAgICAgICAgdm0uYWx0aXR1ZGU7XHJcbiAgICAgICAgdm0uZGlzdGFuY2U7XHJcbiAgICAgICAgdm0ubmFtZSA9ICcnO1xyXG4gICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW107XHJcbiAgICAgICAgdm0udXBsb2FkR1BYID0gdXBsb2FkR1BYO1xyXG4gICAgICAgIHZtLnVwbG9hZFBpYyA9IHVwbG9hZFBpYztcclxuICAgICAgICB2bS5jYW1wU2VsZWN0ZWQgPSBjYW1wU2VsZWN0ZWQ7XHJcbiAgICAgICAgdm0uaXNDYW1wID0gbnVsbDtcclxuICAgICAgICB2bS5zZWFzb25zID0gW107XHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZtLnRvZ2dsZVN0YXRlID0gdHJ1ZTtcclxuICAgICAgICB2bS50b2dnbGVQYW5lbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLm5leHQtc3RlcC1wYW5lbCAucGFuZWwtYm9keScpLnRvZ2dsZSgnaGlkZScpO1xyXG4gICAgICAgICAgICAvLyBhbGVydCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLmFkZFRyYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0cmFja1NlcnZpY2UuYWRkVHJhY2sodm0pLnRoZW4oZnVuY3Rpb24gKGFkZFRyYWNrUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncm90YWxhcicpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoYWRkVHJhY2tFcnJvcikge1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZFBpYyhmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3Bob3Rvcy8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWdfc3JjID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRHUFgoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9ncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncHggPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5maW5pc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbXBTZWxlY3RlZChjYW1wKSB7XHJcbiAgICAgICAgICAgIHZtLmlzQ2FtcCA9IGNhbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5zZWFzb25zID0gW3tcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdpbGtiYWhhcicsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuLi8uLi9pbWcvc2Vhc29uL2ZvcmVzdC5zdmcnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IDEwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdZYXonLFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi4vLi4vaW1nL3NlYXNvbi9iZWFjaC5zdmcnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IDIwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnU29uYmFoYXInLFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi4vLi4vaW1nL3NlYXNvbi9maWVsZHMuc3ZnJyxcclxuICAgICAgICAgICAgICAgIGlkOiAzMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0vEscWfJyxcclxuICAgICAgICAgICAgICAgIGltZzogJy4uLy4uL2ltZy9zZWFzb24vbW91bnRhaW5zLnN2ZycsXHJcbiAgICAgICAgICAgICAgICBpZDogNDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB2bS5zZWxlY3RlZFNlYXNvbnMgPSBbXTtcclxuICAgICAgICB2bS5hZGRTZWFzb24gPSBhZGRTZWFzb247XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZFNlYXNvbihpbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgaSA9IHZtLnNlbGVjdGVkU2Vhc29ucy5pbmRleE9mKHZtLnNlYXNvbnNbaW5kZXhdLmlkKTtcclxuICAgICAgICAgICAgaWYgKGkgPiAtMSlcclxuICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkU2Vhc29ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkU2Vhc29ucy5wdXNoKHZtLnNlYXNvbnNbaW5kZXhdLmlkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codm0uc2VsZWN0ZWRTZWFzb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2bS5jaGVja0F2YWlsYWJpbGl0eSA9IGNoZWNrQXZhaWxhYmlsaXR5O1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrQXZhaWxhYmlsaXR5KGFyciwgdmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnIuc29tZShmdW5jdGlvbiAoYXJyVmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsID09PSBhcnJWYWw7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xyXG4gICAgICAgICAgICBtYXJrZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYWluTWFya2VyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2bS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZtLmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmHFn2thIGJpciBub2t0YXlhIHTEsWtsYXlhcmFrIGtheWTEsXIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbignY3VycmVudFN0ZXAnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgdm0uY3VycmVudFN0ZXAgPSBkYXRhO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICRzY29wZS4kb24oXCJsZWFmbGV0RGlyZWN0aXZlTWFwLmNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgbGVhZkV2ZW50ID0gYXJncy5sZWFmbGV0RXZlbnQ7XHJcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlLmdlb2NvZGVMYXRsbmcobGVhZkV2ZW50LmxhdGxuZy5sYXQsIGxlYWZFdmVudC5sYXRsbmcubG5nKS50aGVuKGZ1bmN0aW9uIChnZW9jb2RlU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvY2F0aW9uID0gZ2VvY29kZVN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxhdCA9IGxlYWZFdmVudC5sYXRsbmcubGF0O1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxuZyA9IGxlYWZFdmVudC5sYXRsbmcubG5nO1xyXG4gICAgICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtsZWFmRXZlbnQubGF0bG5nLmxuZywgbGVhZkV2ZW50LmxhdGxuZy5sYXRdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSB0b1N0YXRlLm5hbWUuc3BsaXQoXCIuXCIpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxvY2F0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY2FtcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNlYXNvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1ldGFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImdweFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZpbmlzaFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnY3VycmVudFN0ZXAnLCBzdGVwKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0ZXApO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIiAiLCJhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgcmV0dXJuIGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGxcclxufVxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhcicsIHJvdGFsYXIpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyL3JvdGFsYXIuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLFxyXG4gICAgbWFya2VyUGFyc2VyLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0TWFwRXZlbnRzLCBsZWFmbGV0RGF0YSwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICB2bS5nZXRUcmFjayA9IGdldFRyYWNrO1xyXG4gICAgdm0ubWFwQXV0b1JlZnJlc2ggPSB0cnVlO1xyXG4gICAgdm0ub3Blbk1hcCA9IG9wZW5NYXA7XHJcbiAgICB2bS5jaGFuZ2VJbWcgPSBjaGFuZ2VJbWc7XHJcbiAgICB2bS5wYXJhbXMgPSB7fTtcclxuXHJcblxyXG5cclxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRTVykgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdTVylcclxuICAgICkge1xyXG4gICAgICAgIC8vIHTDvHJraXlleWUgc2FiaXRsZW1layBpw6dpblxyXG4gICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IDQ0LjI5MjtcclxuICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0MS4yNjQ7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gMzIuODA1O1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IDI3Ljc3MztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdm0ucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgICAgICBsYXRTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0U1cpLFxyXG4gICAgICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcbiAgICAkcm9vdFNjb3BlLnNlYXJjaExvY2F0aW9uID0gJHN0YXRlUGFyYW1zLnRlcm07XHJcblxyXG4gICAgLy8gaWYod2luZG93Lm1vYmlsZWNoZWNrICYmIHZtLm1hcEFjdGl2ZSl7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5zZXRab29tKG1hcC5nZXRab29tKCkgLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLmdldFRyYWNrKHZtLnBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgICB2bS50cmFja3MuZGF0YSA9IHJlc3BvbmQuZGF0YTtcclxuICAgICAgICAgICAgaWYgKHZtLnRyYWNrcy5kYXRhID09IFtdKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmtlclBhcnNlci5qc29uVG9NYXJrZXJBcnJheSh2bS50cmFja3MuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnMgPSBtYXJrZXJQYXJzZXIudG9PYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IEwuZ2VvSnNvbih2bS50cmFja3MuZGF0YSkuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnNFbXB0eSA9IGFuZ3VsYXIuZXF1YWxzKE9iamVjdC5rZXlzKHZtLm1hcmtlcnMpLmxlbmd0aCwgMCk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG5cclxuICAgIHZtLmNoYW5nZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgLy8gdmFyIHN3YXAgPSBtYXJrZXIuaWNvbjtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbiA9IG1hcmtlci5pY29uX3N3YXA7XHJcbiAgICAgICAgLy8gbWFya2VyLmljb25fc3dhcCA9IHN3YXA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRsb2NhdGlvbi5zZWFyY2goKS5sYXRORSA9IDIwKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKG1hcmtlci5mb2N1cylcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnI0I3QTRFMycsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcblxyXG4gICAgLy9sb2cgZXZlbnRzIGZvciBtYXJrZXIgb2JqZWN0c1xyXG4gICAgZm9yICh2YXIgayBpbiB2bS5tYXBFdmVudHMpIHtcclxuICAgICAgICAvLyAgY29uc29sZS5sb2codm0ubWFwRXZlbnRzKTtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuJyArIHZtLm1hcEV2ZW50c1trXTtcclxuICAgICAgICAkc2NvcGUuJG9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmNoYW5nZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdXQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuY2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0uZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbWFwRXZlbnQgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC5kcmFnZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50LCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICB1cGRhdGVNYXAoYXJncyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgbWFwRXZlbnQyID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuem9vbWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudDIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIHVwZGF0ZU1hcChhcmdzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU1hcChhcmdzKSB7XHJcbiAgICAgICAgaWYgKHZtLm1hcEF1dG9SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXJrZXJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcuZGF0YS12aXonKS53aWR0aCgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdE5FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ1NXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgdm0ubWFwQWN0aXZlID0gIXZtLm1hcEFjdGl2ZTtcclxuICAgICAgICAkKCcuZGF0YS12aXonKS50b2dnbGVDbGFzcygnbWFwLW9wZW4nKTtcclxuICAgICAgICAkKCcubWFwLWF1dG8tcmVmcmVzaCcpLnRvZ2dsZUNsYXNzKCdyZWZyZXNoLW9wZW4nKTtcclxuICAgICAgICAodm0udG9nZ2xlVGl0bGUgPT0gJyBIYXJpdGEnID8gdm0udG9nZ2xlVGl0bGUgPSAnIExpc3RlJyA6IHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnKVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkKCcuZGF0YS12aXonKS53aWR0aCgpKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZUltZygpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KCcubm90LWZvdW5kLWltZycpLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgdmFsLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59IiwiYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJvdGFsYXJEZXRhaWwnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JvdGFsYXJEZXRhaWwnLCByb3RhbGFyRGV0YWlsKVxyXG5cclxuZnVuY3Rpb24gcm90YWxhckRldGFpbCgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJEZXRhaWxDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJEZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnLCAnd2VhdGhlckFQSSddO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckRldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEsIHdlYXRoZXJBUEkpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja0RldGFpbCA9IHt9O1xyXG4gICAgdm0uY2VudGVyID0ge307XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0cmFja1NlcnZpY2UuZ2V0VHJhY2tEZXRhaWwoJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5pbWdfc3JjO1xyXG4gICAgICAgICAgICB2bS5jZW50ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIHpvb206IDEyXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLmdweERhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHdlYXRoZXJBUEkuZGFya1NreVdlYXRoZXIodm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sIHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHZtLndlYXRoZXIgPSByZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29ucyA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLmFkZChcImljb24xXCIsIHJlcy5jdXJyZW50bHkuaWNvbik7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLnBsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29ucyA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLmFkZChcImljb24yXCIsIHJlcy5jdXJyZW50bHkuaWNvbik7XHJcbiAgICAgICAgICAgICAgICBza3ljb25zLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zRGFpbHkgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdibGFjaydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseVdoaXRlID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS53ZWF0aGVyLmRhaWx5LmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGtleSArIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgayA9IGtleSArIDIwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3MgPSBcImljb25cIiArIHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrayA9IFwiaWNvblwiICsgaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseS5hZGQoc3MsIHZhbHVlLmljb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseVdoaXRlLmFkZChraywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5tb2JpbGVjaGVjaygpKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmRyYWdnaW5nLmRpc2FibGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuYWRkQ29udHJvbChuZXcgTC5Db250cm9sLkZ1bGxzY3JlZW4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiAnMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjknXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cHRJY29uVXJsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyc6ICdpbWcvaWNvbi1nby5zdmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0dlb2NhY2hlIEZvdW5kJzogJ2ltZy9ncHgvZ2VvY2FjaGUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQYXJrJzogJ2ltZy9ncHgvdHJlZS5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SWNvblVybDogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEljb25Vcmw6ICdpbWcvaWNvbi1zdG9wLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1VybDogJ2ltZy9waW4tc2hhZG93LnBuZydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmRpc3RhbmNlID0gZS50YXJnZXQuZ2V0X2Rpc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNaW4gPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21pbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZWxlTWF4ID0gZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9tYXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc2V0MDogZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9kYXRhKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmdldEJvdW5kcygpKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdCb3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9ub3J0aEVhc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQgKyAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nICsgMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zb3V0aFdlc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQgLSAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nIC0gMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobmV3Qm91bmRzLl9ub3J0aEVhc3QubGF0LCBuZXdCb3VuZHMuX25vcnRoRWFzdC5sbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX3NvdXRoV2VzdC5sYXQsIG5ld0JvdW5kcy5fc291dGhXZXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldE1heEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5fbGF5ZXJzTWluWm9vbT0xMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllckZvckRldGFpbCgpO1xyXG4gICAgdmFyIGNvbnRyb2xzID0ge1xyXG4gICAgICAgIGZ1bGxzY3JlZW46IHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZtLmNvbnRyb2xzID0gY29udHJvbHM7XHJcblxyXG59IiwiLyoqXHJcbiAqIEBkZXNjIFNlcnZpY2VzIHRoYXQgY29udmVydHMgZ2VvanNvbiBmZWF0dXJlcyB0byBtYXJrZXJzIGZvciBoYW5kbGluZyBsYXRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hcmtlclBhcnNlcigkcSkge1xyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAganNvblRvTWFya2VyQXJyYXk6IGpzb25Ub01hcmtlckFycmF5LFxyXG4gICAgICAgIHRvT2JqZWN0OiB0b09iamVjdCxcclxuICAgICAgICBtYXJrZXJDb250ZW50OiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuICAgIGZ1bmN0aW9uIGpzb25Ub01hcmtlckFycmF5KHZhbCkge1xyXG4gICAgICAgIHZhciBkZWZlcmVkID0gJHEuZGVmZXIoKTsgLy8gZGVmZXJlZCBvYmplY3QgcmVzdWx0IG9mIGFzeW5jIG9wZXJhdGlvblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgc2VydmljZS5tYXJrZXJDb250ZW50ID0gJ1x0PGRpdiBjbGFzcz1cImNhcmQgY2FyZC1vbi1tYXBcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb3ZlclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxpbWcgZGF0YS1uZy1zcmM9XCInICsgdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyArICdcIiBjbGFzcz1cImltZy1mbHVpZFwiIGFsdD1cIlwiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxhPjxkaXYgY2xhc3M9XCJtYXNrIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPjwvZGl2PjwvYT4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ibG9ja1wiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxoNCBjbGFzcz1cImNhcmQtdGl0bGUgZm9udC1zaXplLTE2XCI+PGEgaHJlZj1cInJvdGEvJysgdmFsW2ldLl9pZCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jyt2YWxbaV0ucHJvcGVydGllcy5uYW1lKyc8L2E+PC9oND4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICB2YXIgbWFyayA9IHtcclxuICAgICAgICAgICAgICAgIGxheWVyOiBcInJvdGFsYXJcIixcclxuICAgICAgICAgICAgICAgIGxhdDogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBtZXNzYWdlOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogc2VydmljZS5tYXJrZXJDb250ZW50LnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiOiB2YWxbaV0ucHJvcGVydGllcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmRpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VtbWFyeVwiOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjogdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChtYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dHB1dCkge1xyXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcclxuICAgICAgICB2YXIgcnYgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IHVuZGVmaW5lZCkgcnZbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXJrZXJQYXJzZXInLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXJrZXJQYXJzZXInLCBtYXJrZXJQYXJzZXIpOyIsImZ1bmN0aW9uIHRyYWNrU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBlbmRwb2ludCA9ICdodHRwOmxvY2FsaG9zdDo4MDgwLydcclxuXHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRUcmFjazogZ2V0VHJhY2ssXHJcblx0XHRhZGRUcmFjazogYWRkVHJhY2ssXHJcblx0XHRnZXRUcmFja0RldGFpbDpnZXRUcmFja0RldGFpbCxcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFjayhwYXJhbXMpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3M/bGF0TkU9JysgcGFyYW1zLmxhdE5FKycmbG5nTkU9JytwYXJhbXMubG5nTkUgKycmbGF0U1c9JytwYXJhbXMubGF0U1cgKycmbG5nU1c9JytwYXJhbXMubG5nU1csXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH0sXHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrRGV0YWlsKGlkKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycraWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gYWRkVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXRhOiAkLnBhcmFtKHtcclxuXHRcdFx0XHRcIm5hbWVcIjogdHJhY2submFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFwiYWx0aXR1ZGVcIjogdHJhY2suYWx0aXR1ZGUsXHJcblx0XHRcdFx0XCJzdW1tYXJ5XCI6IHRyYWNrLnN1bW1hcnksXHJcblx0XHRcdFx0XCJpbWdfc3JjXCI6IHRyYWNrLmltZ19zcmMsXHJcblx0XHRcdFx0XCJjb29yZGluYXRlc1wiOiB0cmFjay5jb29yZGluYXRlcyxcclxuXHRcdFx0XHRcIm93bmVkQnlcIjogdHJhY2sub3duZWRCeSxcclxuXHRcdFx0XHRcImdweFwiOiB0cmFjay5ncHgsXHJcblx0XHRcdFx0XCJpc0NhbXBcIjogdHJhY2suaXNDYW1wLFxyXG5cdFx0XHRcdFwic2Vhc29uc1wiOiB0cmFjay5zZWxlY3RlZFNlYXNvbnMsXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG59XHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAudHJhY2tTZXJ2aWNlJywgW10pXHJcblx0LmZhY3RvcnkoJ3RyYWNrU2VydmljZScsIHRyYWNrU2VydmljZSk7IiwiZnVuY3Rpb24gdXNlclNlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFVzZXI6IGdldFVzZXIsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgXHRyZXR1cm4gJGh0dHAoe1xyXG4gICAgXHRcdG1ldGhvZDogJ0dFVCcsXHJcbiAgICBcdFx0dXJsOiAnYXBpL3Byb2ZpbGUnXHJcbiAgICBcdH0pXHJcbiAgICB9OyBcclxufSBcclxuYW5ndWxhclxyXG4ubW9kdWxlKCdhcHAudXNlclNlcnZpY2UnLCBbXSlcclxuLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgdXNlclNlcnZpY2UpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHNlcnZpY2VJZCA9ICd3ZWF0aGVyQVBJJztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLndlYXRoZXInLCBbXSlcclxuICAgICAgICAuZmFjdG9yeShzZXJ2aWNlSWQsIFsnJHEnLCAnJGh0dHAnLCB3ZWF0aGVyQVBJXSk7XHJcblxyXG4gICAgZnVuY3Rpb24gd2VhdGhlckFQSSgkcSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgd2VhdGhlcjogd2VhdGhlcixcclxuICAgICAgICAgICAgZm9yZWNhc3Q6IGZvcmVjYXN0LFxyXG4gICAgICAgICAgICBkYXJrU2t5V2VhdGhlcjogZGFya1NreVdlYXRoZXIsXHJcbiAgICAgICAgICAgIGFwcGlkOiAnZmEyZDU5M2FhNThlOTBmZGUzMjg0MjZlNjRhNjRlMzgnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gd2VhdGhlcihsYXQsIGxuZykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogJycsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JyArIGxhdCArICcmbG9uPScgKyBsbmcgKyAnJmFwcGlkPScgKyBzZXJ2aWNlLmFwcGlkICsgJyZ1bml0cz1tZXRyaWMmbGFuZz10cidcclxuICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuY29kID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldEhvdXJzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldE1pbnV0ZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgY3VycmVudCBob3VyIHVzaW5nIG9mZnNldCBmcm9tIFVUQy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGV0aW1lID0gbmV3IERhdGUoKHJlcy5kYXRhLmR0ICogMTAwMCkgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bnJpc2UgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3VucmlzZSAqIDEwMDAgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bnNldCA9IG5ldyBEYXRlKHJlcy5kYXRhLnN5cy5zdW5zZXQgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhQ3VycmVudCA9IHt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LmRhdGV0aW1lID0gZGF0ZXRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyID0gZGF0YUN1cnJlbnQuZGF0ZXRpbWUuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuc3VucmlzZUhvdXIgPSBzdW5yaXNlLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnNldEhvdXIgPSBzdW5zZXQuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIb3VyIGJldHdlZW4gc3Vuc2V0IGFuZCBzdW5yaXNlIGJlaW5nIG5pZ2h0IHRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5pZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ3VycmVudC5jdXJyZW50SG91ciA+PSBkYXRhQ3VycmVudC5zdW5zZXRIb3VyIHx8IGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyIDw9IGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHdlYXRoZXIgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckRlc2NyaXB0aW9uID0gcmVzLmRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoYW5nZSB3ZWF0aGVyIGljb24gY2xhc3MgYWNjb3JkaW5nIHRvIHdlYXRoZXIgY29kZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5pZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtdGh1bmRlcnN0b3JtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zdG9ybS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1yYWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1zbm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1yYWluLW1peFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc0MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtY2xlYXJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtaGFpbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtY2xvdWR5LXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWZvZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktc3VubnlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktaGFpbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktY2xvdWR5LXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzYyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZHVzdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbW9rZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXN0cm9uZy13aW5kXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc4MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktdG9ybmFkb1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktaHVycmljYW5lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXNub3dmbGFrZS1jb2xkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWhvdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQ6IGRhdGFDdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzLmRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWplY3QuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JlY2FzdChsYXQsIGxuZykge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRhcmtTa3lXZWF0aGVyKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvd2VhdGhlci8nICsgbGF0ICsgJy8nICsgbG5nLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jdXJyZW50bHkudGltZSA9IG5ldyBEYXRlKChkYXRhLmN1cnJlbnRseS50aW1lICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YS5kYWlseS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kYWlseS5kYXRhW2tleV0udGltZSA9ICBuZXcgRGF0ZSgodmFsdWUudGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWplY3QuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUeXBlOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsImZ1bmN0aW9uIG1hcENvbmZpZ1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgZ2V0TGF5ZXI6IGdldExheWVyLFxyXG4gICAgICAgIGdldENlbnRlcjogZ2V0Q2VudGVyLFxyXG4gICAgICAgIGdldExheWVyRm9yRGV0YWlsOiBnZXRMYXllckZvckRldGFpbCxcclxuICAgIH07XHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllcigpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBcmF6aScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfU2F0ZWxsaXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1V5ZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zYXRlbGxpdGUtc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfT3V0ZG9vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvb3V0ZG9vcnMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X0xhbnNjYXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ8Swem9oaXBzJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vbGFuZHNjYXBlL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFlhbmRleDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdZYW5kZXggWW9sJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneWFuZGV4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyVHlwZTogJ21hcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG92ZXJsYXlzOiB7XHJcbiAgICAgICAgICAgICAgICByb3RhbGFyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dyb3VwJyxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldENlbnRlcigpIHtcclxuICAgICAgICB2YXIgY2VudGVyID0ge1xyXG4gICAgICAgICAgICBsYXQ6IDM5LjkwMzI5MTgsXHJcbiAgICAgICAgICAgIGxuZzogMzIuNjIyMzM5NixcclxuICAgICAgICAgICAgem9vbTogNlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyRm9yRGV0YWlsKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VsYXllcnM6IHtcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfU2F0ZWxsaXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1V5ZHUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zYXRlbGxpdGUtc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBNYXBib3hfT3V0ZG9vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvb3V0ZG9vcnMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBZYW5kZXg6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWWFuZGV4IFlvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3lhbmRleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllclR5cGU6ICdtYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxheWVycztcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubWFwJywgW10pXHJcbiAgICAuZmFjdG9yeSgnbWFwQ29uZmlnU2VydmljZScsIG1hcENvbmZpZ1NlcnZpY2UpOyIsImZ1bmN0aW9uIGdlb2NvZGUoJHEpIHtcclxuICByZXR1cm4geyBcclxuICAgIGdlb2NvZGVBZGRyZXNzOiBmdW5jdGlvbihhZGRyZXNzKSB7XHJcbiAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiBhZGRyZXNzIH0sIGZ1bmN0aW9uIChyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICAgIC8vIHdpbmRvdy5maW5kTG9jYXRpb24ocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ2dlb2NvZGUnLCBnZW9jb2RlKTsiLCJmdW5jdGlvbiByZXZlcnNlR2VvY29kZSgkcSwgJGh0dHApIHtcclxuICAgIHZhciBvYmogPSB7fTtcclxuICAgIG9iai5nZW9jb2RlTGF0bG5nID0gZnVuY3Rpb24gZ2VvY29kZVBvc2l0aW9uKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICB2YXIgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7XHJcbiAgICAgICAgICAgIGxhdExuZzogbGF0bG5nXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZXMgJiYgcmVzcG9uc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlc1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdyZXZlcnNlR2VvY29kZScsIHJldmVyc2VHZW9jb2RlKTsiXX0=
