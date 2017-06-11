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
    .config(['$stateProvider', '$locationProvider', '$logProvider', '$ocLazyLoadProvider', '$compileProvider', 'ngDialogProvider',
      function ($stateProvider, $locationProvider, $logProvider, $ocLazyLoadProvider, $compileProvider, ngDialogProvider) { // provider-injector

        ngDialogProvider.setDefaults({
          preCloseCallback: function (value) {
            $('.container').css({
              'filter': 'none',
              '-webkit-filter': 'none',
              '-moz-filter': 'none',
              '-o-filter': 'none',
              '-ms-filter': 'none'
            });
            $('.navbar').css({
              'filter': 'none',
              '-webkit-filter': 'none',
              '-moz-filter': 'none',
              '-o-filter': 'none',
              '-ms-filter': 'none'
            });
          },
          onOpenCallback: function (value) {
            $('.container').css({
              'filter': 'blur(5px)',
              '-webkit-filter': 'blur(5px)',
              '-moz-filter': 'blur(5px)',
              '-o-filter': 'blur(5px)',
              '-ms-filter': 'blur(5px)'
            });
            $('.navbar').css({
              'filter': 'blur(5px)',
              '-webkit-filter': 'blur(5px)',
              '-moz-filter': 'blur(5px)',
              '-o-filter': 'blur(5px)',
              '-ms-filter': 'blur(5px)'
            });
          },
        })

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
      }
    ])



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
        .module('app.rota', ['app.rotalar', 'app.rotalarDetail', 'app.rotaekle', 'ui.router','ngDialog'])
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
  (function () {
      'use strict';

        angular
            .module('app.rotalarim', [])
            .directive('rotalarim', rotalarim)

        function rotalarDetail() {
            var directive = {
                restrict: 'A',
                templateUrl: '../../components/rota/rotalarim/rotalarim.html',
                scope: {},
                controller: RotalarimController,
                controllerAs: 'vm',
                bindToController: true
            };

            return directive; 
        }

        RotalarimController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData', 'weatherAPI', 'ngDialog'];

        function RotalarimController(){
             
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

RotalarDetailController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData', 'weatherAPI', 'ngDialog'];

function RotalarDetailController($scope, $stateParams, trackService, mapConfigService, leafletData, weatherAPI, ngDialog) {
    var vm = this;
    vm.trackDetail = {};
    vm.center = {};
    vm.layers = mapConfigService.getLayerForDetail();
    vm.controls = controls;
    vm.updateTrack = updateTrack;
    vm.deleteTrack = deleteTrack;
    vm.deleteTrackOK = deleteTrackOK;
    vm.updateTrack = updateTrack;
    vm.updateTrackOK = updateTrackOK;

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
                if (window.mobilecheck())
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
                    map._layersMinZoom = 10
                });
                g.addTo(map);
            });

        })

    }
    var controls = {
        fullscreen: {
            position: 'topleft'
        }
    }

    function updateTrack() {
        return trackService.updateTrack(vm.trackDetail).then(function () {}, function () {});
    }

    function deleteTrackOK() {

        ngDialog.open({
            template: 'templateId',
            className: 'ngdialog-theme-default',
            showClose: false,
           
            scope: $scope
        });
    } 

    function deleteTrack() {
        console.log(1);
        trackService.deleteTrack(vm.trackDetail).then(function (res) {
            if(res.OperationResult === true) {
                $state.go("rotalarState"); 
            }
        }, function (rej) {
            console.log('rej')
        });
    }

    function updateTrackOK() {

        ngDialog.open({
            template: 'updateTrack',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
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
		updateTrack: updateTrack,
		deleteTrack: deleteTrack,
		getTrackDetail: getTrackDetail,
	};
	return service;

	function getTrack(params) {
		return $http({
			method: 'GET',
			url: 'api/tracks?latNE=' + params.latNE + '&lngNE=' + params.lngNE + '&latSW=' + params.latSW + '&lngSW=' + params.lngSW,
			headers: {
				'content-type': 'application/json; charset=utf-8'
			},
		})
	};

	function getTrackDetail(id) {
		return $http({
			method: 'GET',
			url: 'api/tracks/' + id,
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

	function updateTrack(track) {
		return $http({
			method: 'PUT',
			url: 'api/tracks/' + track._id,
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

	function deleteTrack(track) {
		return $http({
			method: 'DELETE',
			url: 'api/tracks/' + track._id,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiYXBwLnJ1bi5qcyIsImNvbnRlbnQvYXBwLmNvbnRlbnQuanMiLCJ1c2VyL2FwcC51c2VyLmpzIiwicm90YS9hcHAucm90YS5qcyIsImZvb3Rlci9mb290ZXIuanMiLCJoZWFkbGluZS9oZWFkbGluZS5qcyIsImNhcmQvY2FyZC5kaXJlY3RpdmUuanMiLCJjb25uZWN0L2Nvbm5lY3QuZGlyZWN0aXZlLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicGFzc3dvcmQtdmVyaWZ5L3Bhc3N3b3JkLXZlcmlmeS5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9yZWdpc3Rlci5qcyIsInByb2ZpbGUvcHJvZmlsZS5qcyIsInJvdGFla2xlL3JvdGFla2xlLmpzIiwicm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uanMiLCJyb3RhbGFyL3JvdGFsYXIuanMiLCJyb3RhbGFyaW0vcm90YWxhcmltLmRpcmVjdGl2ZS5qcyIsInJvdGFsYXIuZGV0YWlsL3JvdGFsYXIuZGV0YWlsLmpzIiwibWFya2VycGFyc2VyLmpzIiwidHJhY2suanMiLCJ1c2VyLmpzIiwid2VhdGhlckFQSS5qcyIsIm1hcC9tYXAuY29uZmlnLmpzIiwibWFwL21hcC5nZW9jb2RlLmpzIiwibWFwL21hcC5yZXZlcnNlR2VvY29kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFVBQVUsYUFBYSxVQUFVLFFBQVEsYUFBYTtJQUN6RCxJQUFJLFNBQVM7O0lBRWIsT0FBTyxPQUFPLE1BQU0sUUFBUSxLQUFLOzs7O0FBSXJDLE9BQU8sbUJBQW1CLFlBQVk7SUFDbEMsRUFBRSx5QkFBeUIsS0FBSyxZQUFZO1FBQ3hDLElBQUksT0FBTztRQUNYLEVBQUUsTUFBTSxVQUFVO1lBQ2QsUUFBUSxVQUFVLE9BQU8sU0FBUztnQkFDOUIsSUFBSSxjQUFjO2dCQUNsQixFQUFFLFFBQVEsK0hBQStILE9BQU8sVUFBVSxNQUFN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ZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoLCByZXBsYWNlbWVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldC5zcGxpdChzZWFyY2gpLmpvaW4ocmVwbGFjZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdlb2NvZGUtYXV0b2NvbXBsZXRlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICQodGhhdCkudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocXVlcnksIHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmVkaWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwczovL2dlb2NvZGUtbWFwcy55YW5kZXgucnUvMS54Lz9yZXN1bHRzPTUmYmJveD0yNC4xMjU5NzcsMzQuNDUyMjE4fjQ1LjEwOTg2Myw0Mi42MDE2MjAmZm9ybWF0PWpzb24mbGFuZz10cl9UUiZnZW9jb2RlPScgKyBxdWVyeSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm5hbWUgKyAnLCAnICsgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2xhdDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LlBvaW50LnBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEua2luZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdF90eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmJveDogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0LmJvdW5kZWRCeS5FbnZlbG9wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGVzY3JpcHRpb24uaW5kZXhPZignVMO8cmtpeWUnKSA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZGljdGlvbnMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHByZWRpY3Rpb25zICYmIHByZWRpY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVzdWx0cyA9ICQubWFwKHByZWRpY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnVuY3Rpb24gKHByZWRpY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZGVzdCA9IHByZWRpY3Rpb24ubmFtZSArIFwiLCBcIiArIHByZWRpY3Rpb24uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdCA9IGRlc3QucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2VzcyhwcmVkaWN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWZ0ZXJTZWxlY3Q6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIHZhciBsYXRTVyA9IGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuZ1NXID0gaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0TkUgPSBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBsbmdORSA9IGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSAnL3JvdGFsYXIvJyArIGl0ZW0ubmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJz9sYXRTVz0nICsgbGF0U1cudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdTVz0nICsgbG5nU1cudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsYXRORT0nICsgbGF0TkUudG9TdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJyZsbmdORT0nICsgbG5nTkUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSlcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSAnPHNwYW4gY2xhc3M9XCJpdGVtLWFkZHJlc3NcIj4nICsgaXRlbSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAzLFxyXG4gICAgICAgICAgICBmaXRUb0VsZW1lbnQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoYXQpLm9uKCd0eXBlYWhlYWQ6Y2hhbmdlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGUsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICQodGhhdCkudmFsKGl0ZW0uZmluZCgnYT5zcGFuLml0ZW0tYWRkcmVzcycpLnRleHQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxud2luZG93Lm1vYmlsZWNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoZWNrID0gZmFsc2U7XHJcbiAgICAoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLCA0KSkpIGNoZWNrID0gdHJ1ZTtcclxuICAgIH0pKG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmEpO1xyXG4gICAgcmV0dXJuIGNoZWNrO1xyXG59O1xyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXHJcbiAgICAgICdhcHAubmF2YmFyJyxcclxuICAgICAgJ2FwcC5sb2dpbicsXHJcbiAgICAgICdhcHAucmVnaXN0ZXInLFxyXG4gICAgICAnYXBwLmNvbm5lY3QnLFxyXG4gICAgICAnYXBwLmNhcmQnLFxyXG4gICAgICAnYXBwLnByb2ZpbGUnLFxyXG4gICAgICAnYXBwLnVzZXJTZXJ2aWNlJyxcclxuICAgICAgJ2FwcC50cmFja1NlcnZpY2UnLFxyXG4gICAgICAnYXBwLm1hcmtlclBhcnNlcicsXHJcbiAgICAgICdhcHAubWFwJyxcclxuICAgICAgJ2FwcC5jb250ZW50JyxcclxuICAgICAgJ2FwcC5yb3RhJyxcclxuICAgICAgJ29jLmxhenlMb2FkJyxcclxuICAgICAgJ3VpLnJvdXRlcicsXHJcbiAgICAgICdsZWFmbGV0LWRpcmVjdGl2ZScsXHJcbiAgICAgICdhcHAud2VhdGhlcicsXHJcbiAgICAgICdwYXNzd29yZFZlcmlmeScsXHJcbiAgICBdKVxyXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRsb2dQcm92aWRlcicsICckb2NMYXp5TG9hZFByb3ZpZGVyJywgJyRjb21waWxlUHJvdmlkZXInLCAnbmdEaWFsb2dQcm92aWRlcicsXHJcbiAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRsb2dQcm92aWRlciwgJG9jTGF6eUxvYWRQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgbmdEaWFsb2dQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICBuZ0RpYWxvZ1Byb3ZpZGVyLnNldERlZmF1bHRzKHtcclxuICAgICAgICAgIHByZUNsb3NlQ2FsbGJhY2s6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAkKCcuY29udGFpbmVyJykuY3NzKHtcclxuICAgICAgICAgICAgICAnZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctd2Via2l0LWZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLW1vei1maWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy1vLWZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLW1zLWZpbHRlcic6ICdub25lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnLm5hdmJhcicpLmNzcyh7XHJcbiAgICAgICAgICAgICAgJ2ZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLXdlYmtpdC1maWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy1tb3otZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctby1maWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy1tcy1maWx0ZXInOiAnbm9uZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb25PcGVuQ2FsbGJhY2s6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAkKCcuY29udGFpbmVyJykuY3NzKHtcclxuICAgICAgICAgICAgICAnZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy13ZWJraXQtZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy1tb3otZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy1vLWZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctbXMtZmlsdGVyJzogJ2JsdXIoNXB4KSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJy5uYXZiYXInKS5jc3Moe1xyXG4gICAgICAgICAgICAgICdmaWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLXdlYmtpdC1maWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLW1vei1maWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLW8tZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy1tcy1maWx0ZXInOiAnYmx1cig1cHgpJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgJG9jTGF6eUxvYWRQcm92aWRlci5jb25maWcoe1xyXG4gICAgICAgICAgZGVidWc6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbiAgICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZChmYWxzZSk7XHJcbiAgICAgICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xyXG5cclxuICAgICAgICB2YXIgbG9naW5TdGF0ZSA9IHtcclxuICAgICAgICAgIG5hbWU6ICdsb2dpbicsXHJcbiAgICAgICAgICB1cmw6ICcvZ2lyaXMnLFxyXG4gICAgICAgICAgdGVtcGxhdGU6ICc8bG9naW4tZGlyZWN0aXZlPjwvbG9naW4tZGlyZWN0aXZlPidcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxvZ2luU3RhdGUpO1xyXG5cclxuICAgICAgICB2YXIgcmVnaXN0ZXJTdGF0ZSA9IHtcclxuICAgICAgICAgIG5hbWU6ICdyZWdpc3RlcicsXHJcbiAgICAgICAgICB1cmw6ICcva2F5aXQnLFxyXG4gICAgICAgICAgdGVtcGxhdGU6ICc8cmVnaXN0ZXItZGlyZWN0aXZlPjwvcmVnaXN0ZXItZGlyZWN0aXZlPidcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJlZ2lzdGVyU3RhdGUpO1xyXG5cclxuICAgICAgICB2YXIgcHJvZmlsZVN0YXRlID0ge1xyXG4gICAgICAgICAgbmFtZTogJ3Byb2ZpbGUnLFxyXG4gICAgICAgICAgdXJsOiAnL3Byb2ZpbCcsXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxwcm9maWxlLWRpcmVjdGl2ZT48L3Byb2ZpbGUtZGlyZWN0aXZlPidcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHByb2ZpbGVTdGF0ZSk7XHJcblxyXG4gICAgICAgIHZhciBjb25uZWN0U3RhdGUgPSB7XHJcbiAgICAgICAgICBuYW1lOiAnY29ubmVjdCcsXHJcbiAgICAgICAgICB1cmw6ICcvZXBvc3RhLWJhZ2xhJyxcclxuICAgICAgICAgIHRlbXBsYXRlOiAnPGNvbm5lY3QtY29tcG9uZW50PjwvY29ubmVjdC1jb21wb25lbnQ+J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoY29ubmVjdFN0YXRlKTtcclxuICAgICAgfVxyXG4gICAgXSlcclxuXHJcblxyXG5cclxufSkoKTsiLCIgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgXHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIHJldHVybiBnZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyKClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbmQuZGF0YS5PcGVyYXRpb25SZXN1bHQpIFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXNwb25kLmRhdGEudXNlcjtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mbGFnTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIFxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29udGVudCcsIFsnYXBwLmhlYWRlcicsICdhcHAuZm9vdGVyJywndWkucm91dGVyJ10pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdkZWZhdWx0U3RhdGUnLCBcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2xhbmRpbmcvbGFuZGluZy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmYXVsdFN0YXRlKTtcclxuICAgIH0pXHJcbiAgXHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YScsIFsnYXBwLnJvdGFsYXInLCAnYXBwLnJvdGFsYXJEZXRhaWwnLCAnYXBwLnJvdGFla2xlJywgJ3VpLnJvdXRlcicsJ25nRGlhbG9nJ10pXHJcbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgICAgIHZhciByb3RhbGFyU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncm90YWxhcicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YWxhci97dGVybX0/bGF0U1cmbG5nU1cmbGF0TkUmbG5nTkUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHJvdGFsYXI+PC9yb3RhbGFyPicsXHJcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJvdGFsYXJTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcm90YWxhckRldGFpbFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvdGFsYXJEZXRhaWwnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGEvOmlkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxyb3RhbGFyLWRldGFpbD48L3JvdGFsYXItZGV0YWlsPidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocm90YWxhckRldGFpbFN0YXRlKTtcclxuIFxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjaycsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YWVrbGUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUvcm90YWVrbGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncm90YUVrbGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3JvdGFFa2xlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tMb2NhdGlvblN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmxvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rb251bScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5sb2NhdGlvbi9yb3RhZWtsZS5sb2NhdGlvbi5odG1sJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0xvY2F0aW9uU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTWV0YVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLm1ldGEnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2JpbGdpJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLm1ldGEvcm90YWVrbGUubWV0YS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTWV0YVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0NhbXBTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5jYW1wJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rYW1wJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmthbXAvcm90YWVrbGUua2FtcC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrQ2FtcFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1NlYXNvblN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLnNlYXNvbicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2V6b24nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuc2Vhc29uL3JvdGFla2xlLnNlYXNvbi5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrU2Vhc29uU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrSW1hZ2VTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5pbWFnZScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVzaW1sZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuaW1hZ2Uvcm90YWVrbGUuaW1hZ2UuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ltYWdlU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrR1BYU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZ3B4JyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9ncHgnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZ3B4L3JvdGFla2xlLmdweC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrR1BYU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrRmluaXNoU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suZmluaXNoJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9rYXlkZXQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUuZmluaXNoL3JvdGFla2xlLmZpbmlzaC5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrRmluaXNoU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZvb3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnZm9vdGVyRGlyZWN0aXZlJywgZm9vdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGZvb3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcbn0pKCk7IFxyXG4gXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmhlYWRlcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2hlYWRsaW5lRGlyZWN0aXZlJywgaGVhZGxpbmVEaXJlY3RpdmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlYWRsaW5lRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9oZWFkbGluZS9oZWFkbGluZS5odG1sJyxcclxuICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBIZWFkbGluZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgSGVhZGxpbmVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGludGVydmFsJywgJyRxJywnJHdpbmRvdyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRsaW5lQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJGludGVydmFsLCAkcSwkd2luZG93KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHZtLnNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdyb3RhbGFyJywge1xyXG4gICAgICAgICAgICAgICAgdGVybTogdm0uZWxtYVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiNBdXRvY29tcGxldGVcIikuZm9jdXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjQXV0b2NvbXBsZXRlXCIpLm9mZnNldCgpLnRvcCAtIDgwXHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHdpbmRvdy5zY3JvbGxYID0gMDtcclxuICAgICAgICAkd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcblxyXG5cclxuICAgICAgICAkaW50ZXJ2YWwoY2hhbmdlQmcsIDY1MDApO1xyXG5cclxuICAgICAgICB2YXIgaSA9IDE7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZUJnKCkge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gNSkge1xyXG4gICAgICAgICAgICAgICAgLy9yZXN0YXJ0XHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIC8vIHZhciBpbWdVcmwgPSBcInVybCgnLi4vLi4vaW1nL2JnLVwiICsgaSArIFwiLmpwZycpXCI7XHJcbiAgICAgICAgICAgIHZhciBpbWdVcmwgPSBcIi4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGdcIjtcclxuXHJcbiAgICAgICAgICAgIHByZWxvYWQoaW1nVXJsKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIi5oZWFkbGluZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInVybChcIisgaW1nVXJsICtcIilcIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlbG9hZCh1cmwpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHVybDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWFnZS5jb21wbGV0ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuKiBAZGVzYyBjYXJkIGNvbXBvbmVudCBcclxuKiBAZXhhbXBsZSA8Y2FyZD48L2NhcmQ+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jYXJkJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdjYXJkRGlyZWN0aXZlJywgY2FyZERpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBjYXJkRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29tbW9uL2NhcmQvY2FyZC5odG1sJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICB0aXRsZTogJzwnLFxyXG4gICAgICAgICAgICBzdW1tYXJ5OiAnPCcsXHJcbiAgICAgICAgICAgIG93bmVyOic8JyxcclxuICAgICAgICAgICAgaW1nU3JjOic8JywgICAgXHJcbiAgICAgICAgICAgIGlkOiAnPCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiBDYXJkQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENhcmRDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpczsgXHJcbiAgICAvLyB2bS5pbWdTcmMgPSB2bS5pbWdTcmMuc3BsaXQoJ2NsaWVudCcpWzFdO1xyXG59IFxyXG4iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29ubmVjdCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnY29ubmVjdENvbXBvbmVudCcsIGNvbm5lY3RDb21wb25lbnQpO1xyXG4gICBcclxuZnVuY3Rpb24gY29ubmVjdENvbXBvbmVudCgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvY29ubmVjdC9jb25uZWN0Lmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBjb25uZWN0Q29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb25uZWN0Q29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubG9naW4nLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2xvZ2luRGlyZWN0aXZlJywgbG9naW5EaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gbG9naW5EaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL2xvZ2luL2xvZ2luLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBGb290ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiAqIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuICogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4gKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm5hdmJhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbmF2YmFyRGlyZWN0aXZlJywgbmF2YmFyRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIG5hdmJhckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbmF2YmFyL25hdmJhci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogbmF2YmFyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICB3aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpOyBcclxuXHJcbiAgICB2bS5vcGVuTmF2ID0gb3Blbk5hdjtcclxuICAgIHZtLmNsb3NlTmF2ID0gY2xvc2VOYXY7XHJcblxyXG5cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gb3Blbk5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ICA9IFwiMCVcIjtcclxuICAgIH1cclxuXHJcblxyXG59IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwYXNzd29yZFZlcmlmeScsIFtdKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwYXNzd29yZFZlcmlmeScpLmRpcmVjdGl2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsIC8vIG9ubHkgYWN0aXZhdGUgb24gZWxlbWVudCBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJywgLy8gZ2V0IGEgaG9sZCBvZiBOZ01vZGVsQ29udHJvbGxlclxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBuZ01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5nTW9kZWwpIHJldHVybjsgLy8gZG8gbm90aGluZyBpZiBubyBuZy1tb2RlbFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHdhdGNoIG93biB2YWx1ZSBhbmQgcmUtdmFsaWRhdGUgb24gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBvYnNlcnZlIHRoZSBvdGhlciB2YWx1ZSBhbmQgcmUtdmFsaWRhdGUgb24gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTsgXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhbHVlcyBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsMSA9IG5nTW9kZWwuJHZpZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsMiA9IGF0dHJzLmVxdWFscztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHZhbGlkaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0VmFsaWRpdHkoJ2VxdWFscycsICF2YWwxIHx8ICF2YWwyIHx8IHZhbDEgPT09IHZhbDIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucmVnaXN0ZXInLCBbJ3Bhc3N3b3JkVmVyaWZ5J10pXHJcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcmVjdGl2ZScsIHJlZ2lzdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9yZWdpc3Rlci9yZWdpc3Rlci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogcmVnaXN0ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncHJvZmlsZURpcmVjdGl2ZScsIHByb2ZpbGVEaXJlY3RpdmUpO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZURpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvcHJvZmlsZS9wcm9maWxlLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IHByb2ZpbGVDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblxyXG5cclxucHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICd1c2VyU2VydmljZScsICd0cmFja1NlcnZpY2UnLCAnbWFya2VyUGFyc2VyJ107XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlQ29udHJvbGxlcigkcm9vdFNjb3BlLCB1c2VyU2VydmljZSx0cmFja1NlcnZpY2UsbWFya2VyUGFyc2VyKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gIFxyXG4gICAgfVxyXG59IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGFla2xlJywgWydhcHAubWFwJywgJ2FwcC50cmFja1NlcnZpY2UnLCAnbmdGaWxlVXBsb2FkJywgJ2FuZ3VsYXItbGFkZGEnXSlcclxuICAgICAgICAuY29udHJvbGxlcigncm90YUVrbGVDb250cm9sbGVyJywgcm90YUVrbGVDb250cm9sbGVyKVxyXG5cclxuXHJcbiAgICByb3RhRWtsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnbWFwQ29uZmlnU2VydmljZScsICdyZXZlcnNlR2VvY29kZScsICd0cmFja1NlcnZpY2UnLCAnJHN0YXRlJywgJ1VwbG9hZCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGFFa2xlQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIG1hcENvbmZpZ1NlcnZpY2UsIHJldmVyc2VHZW9jb2RlLCB0cmFja1NlcnZpY2UsICRzdGF0ZSwgVXBsb2FkKSB7XHJcbiAgICAgICAgLy8gJG9jTGF6eUxvYWQubG9hZCgnLi4vLi4vc2VydmljZXMvbWFwL21hcC5hdXRvY29tcGxldGUuanMnKTtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCRzdGF0ZSk7XHJcbiAgICAgICAgLy8gdm0uc3RhdGUgPSAkc3RhdGU7XHJcbiAgICAgICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgdm0ubG9jYXRpb247XHJcblxyXG4gICAgICAgIC8vVHJhY2sgcGFyYW1ldGVyc1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRyb290U2NvcGUudXNlcikgfHwgYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkcm9vdFNjb3BlLnVzZXIuX2lkKSkge1xyXG4gICAgICAgICAgICAvLyAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgIC8vIGJyZWFrOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2bS5vd25lZEJ5ID0gJHJvb3RTY29wZS51c2VyLl9pZDtcclxuXHJcbiAgICAgICAgdm0uaW1nX3NyYyA9IFwic3JjXCI7XHJcbiAgICAgICAgdm0uc3VtbWFyeTtcclxuICAgICAgICB2bS5hbHRpdHVkZTtcclxuICAgICAgICB2bS5kaXN0YW5jZTtcclxuICAgICAgICB2bS5uYW1lID0gJyc7XHJcbiAgICAgICAgdm0uY29vcmRpbmF0ZXMgPSBbXTtcclxuICAgICAgICB2bS51cGxvYWRHUFggPSB1cGxvYWRHUFg7XHJcbiAgICAgICAgdm0udXBsb2FkUGljID0gdXBsb2FkUGljO1xyXG4gICAgICAgIHZtLmNhbXBTZWxlY3RlZCA9IGNhbXBTZWxlY3RlZDtcclxuICAgICAgICB2bS5pc0NhbXAgPSBudWxsO1xyXG4gICAgICAgIHZtLnNlYXNvbnMgPSBbXTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ2luTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdm0udG9nZ2xlU3RhdGUgPSB0cnVlO1xyXG4gICAgICAgIHZtLnRvZ2dsZVBhbmVsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcubmV4dC1zdGVwLXBhbmVsIC5wYW5lbC1ib2R5JykudG9nZ2xlKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIC8vIGFsZXJ0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm0uYWRkVHJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRyYWNrU2VydmljZS5hZGRUcmFjayh2bSkudGhlbihmdW5jdGlvbiAoYWRkVHJhY2tSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdyb3RhbGFyJyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChhZGRUcmFja0Vycm9yKSB7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkUGljKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvcGhvdG9zLycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmltZ19zcmMgPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5ncHgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEdQWChmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL2dweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmdweCA9IHJlc3AuZGF0YS5EYXRhLnBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmZpbmlzaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7IC8vY2F0Y2ggZXJyb3JcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pWydmaW5hbGx5J10oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FtcFNlbGVjdGVkKGNhbXApIHtcclxuICAgICAgICAgICAgdm0uaXNDYW1wID0gY2FtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLnNlYXNvbnMgPSBbe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2lsa2JhaGFyJyxcclxuICAgICAgICAgICAgICAgIGltZzogJy4uLy4uL2ltZy9zZWFzb24vZm9yZXN0LnN2ZycsXHJcbiAgICAgICAgICAgICAgICBpZDogMTBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ1lheicsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuLi8uLi9pbWcvc2Vhc29uL2JlYWNoLnN2ZycsXHJcbiAgICAgICAgICAgICAgICBpZDogMjAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdTb25iYWhhcicsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuLi8uLi9pbWcvc2Vhc29uL2ZpZWxkcy5zdmcnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IDMwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnS8SxxZ8nLFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi4vLi4vaW1nL3NlYXNvbi9tb3VudGFpbnMuc3ZnJyxcclxuICAgICAgICAgICAgICAgIGlkOiA0MCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHZtLnNlbGVjdGVkU2Vhc29ucyA9IFtdO1xyXG4gICAgICAgIHZtLmFkZFNlYXNvbiA9IGFkZFNlYXNvbjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkU2Vhc29uKGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gdm0uc2VsZWN0ZWRTZWFzb25zLmluZGV4T2Yodm0uc2Vhc29uc1tpbmRleF0uaWQpO1xyXG4gICAgICAgICAgICBpZiAoaSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRTZWFzb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRTZWFzb25zLnB1c2godm0uc2Vhc29uc1tpbmRleF0uaWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5zZWxlY3RlZFNlYXNvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLmNoZWNrQXZhaWxhYmlsaXR5ID0gY2hlY2tBdmFpbGFiaWxpdHk7XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tBdmFpbGFiaWxpdHkoYXJyLCB2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyci5zb21lKGZ1bmN0aW9uIChhcnJWYWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IGFyclZhbDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgYW5ndWxhci5leHRlbmQoJHNjb3BlLCB7XHJcbiAgICAgICAgICAgIG1hcmtlcnM6IHtcclxuICAgICAgICAgICAgICAgIG1haW5NYXJrZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYXQ6IHZtLmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxuZzogdm0uY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCYcWfa2EgYmlyIG5va3RheWEgdMSxa2xheWFyYWsga2F5ZMSxci5cIixcclxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKCdjdXJyZW50U3RlcCcsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICB2bS5jdXJyZW50U3RlcCA9IGRhdGE7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbihcImxlYWZsZXREaXJlY3RpdmVNYXAuY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWFmRXZlbnQgPSBhcmdzLmxlYWZsZXRFdmVudDtcclxuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUuZ2VvY29kZUxhdGxuZyhsZWFmRXZlbnQubGF0bG5nLmxhdCwgbGVhZkV2ZW50LmxhdGxuZy5sbmcpLnRoZW4oZnVuY3Rpb24gKGdlb2NvZGVTdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9jYXRpb24gPSBnZW9jb2RlU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubGF0ID0gbGVhZkV2ZW50LmxhdGxuZy5sYXQ7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzLm1haW5NYXJrZXIubG5nID0gbGVhZkV2ZW50LmxhdGxuZy5sbmc7XHJcbiAgICAgICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW2xlYWZFdmVudC5sYXRsbmcubG5nLCBsZWFmRXZlbnQubGF0bG5nLmxhdF07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRvU3RhdGUubmFtZS5zcGxpdChcIi5cIilbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RlcDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibG9jYXRpb25cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjYW1wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2Vhc29uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibWV0YVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZ3B4XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA3O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdjdXJyZW50U3RlcCcsIHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RlcCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiICIsImFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICByZXR1cm4gYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpIHx8IHZhbCA9PT0gbnVsbFxyXG59XHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yb3RhbGFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyb3RhbGFyJywgcm90YWxhcilcclxuXHJcbmZ1bmN0aW9uIHJvdGFsYXIoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFsYXIvcm90YWxhci5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogUm90YWxhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuUm90YWxhckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLFxyXG4gICAgJ21hcmtlclBhcnNlcicsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXRNYXBFdmVudHMnLCAnbGVhZmxldERhdGEnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnXHJcbl07XHJcblxyXG5mdW5jdGlvbiBSb3RhbGFyQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsXHJcbiAgICBtYXJrZXJQYXJzZXIsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXRNYXBFdmVudHMsIGxlYWZsZXREYXRhLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIHZtLmdldFRyYWNrID0gZ2V0VHJhY2s7XHJcbiAgICB2bS5tYXBBdXRvUmVmcmVzaCA9IHRydWU7XHJcbiAgICB2bS5vcGVuTWFwID0gb3Blbk1hcDtcclxuICAgIHZtLmNoYW5nZUltZyA9IGNoYW5nZUltZztcclxuICAgIHZtLnBhcmFtcyA9IHt9O1xyXG5cclxuXHJcblxyXG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxhdE5FKSB8fFxyXG4gICAgICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxuZ05FKSB8fFxyXG4gICAgICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxhdFNXKSB8fFxyXG4gICAgICAgIGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHN0YXRlUGFyYW1zLmxuZ1NXKVxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gdMO8cmtpeWV5ZSBzYWJpdGxlbWVrIGnDp2luXHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gNDQuMjkyO1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdORSA9IDQxLjI2NDtcclxuICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSAzMi44MDU7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gMjcuNzczO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2bS5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGxhdE5FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRORSksXHJcbiAgICAgICAgICAgIGxuZ05FOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdORSksXHJcbiAgICAgICAgICAgIGxhdFNXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sYXRTVyksXHJcbiAgICAgICAgICAgIGxuZ1NXOiBwYXJzZUZsb2F0KCRzdGF0ZVBhcmFtcy5sbmdTVyksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuICAgICRyb290U2NvcGUuc2VhcmNoTG9jYXRpb24gPSAkc3RhdGVQYXJhbXMudGVybTtcclxuXHJcbiAgICAvLyBpZih3aW5kb3cubW9iaWxlY2hlY2sgJiYgdm0ubWFwQWN0aXZlKXtcclxuXHJcbiAgICAvLyB9XHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICBpZiAodm0ucGFyYW1zLmxhdE5FICYmIHZtLnBhcmFtcy5sbmdORSAmJiB2bS5wYXJhbXMubGF0U1cgJiYgdm0ucGFyYW1zLmxuZ1NXKSB7XHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdE5FLCB2bS5wYXJhbXMubG5nTkVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0U1csIHZtLnBhcmFtcy5sbmdTV10sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLnNldFpvb20obWFwLmdldFpvb20oKSAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRyYWNrKCkge1xyXG4gICAgICAgIHJldHVybiB0cmFja1NlcnZpY2UuZ2V0VHJhY2sodm0ucGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrcy5kYXRhID0gcmVzcG9uZC5kYXRhO1xyXG4gICAgICAgICAgICBpZiAodm0udHJhY2tzLmRhdGEgPT0gW10pIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFya2VyUGFyc2VyLmpzb25Ub01hcmtlckFycmF5KHZtLnRyYWNrcy5kYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2VycyA9IG1hcmtlclBhcnNlci50b09iamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gTC5nZW9Kc29uKHZtLnRyYWNrcy5kYXRhKS5nZXRCb3VuZHMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0ubWFya2Vyc0VtcHR5ID0gYW5ndWxhci5lcXVhbHMoT2JqZWN0LmtleXModm0ubWFya2VycykubGVuZ3RoLCAwKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgIHZtLmNlbnRlciA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0Q2VudGVyKCk7XHJcblxyXG4gICAgdm0uY2hhbmdlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICAvLyB2YXIgc3dhcCA9IG1hcmtlci5pY29uO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uID0gbWFya2VyLmljb25fc3dhcDtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbl9zd2FwID0gc3dhcDtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpLmxhdE5FID0gMjApO1xyXG5cclxuICAgICAgICAvLyBpZiAobWFya2VyLmZvY3VzKVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSBmYWxzZTtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgbWFya2VyLmljb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS5yZW1vdmVJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjQjdBNEUzJyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0uem9vbU1hcmtlciA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICB2YXIgbGF0TG5ncyA9IFtcclxuICAgICAgICAgICAgW21hcmtlci5sYXQsIG1hcmtlci5sbmddXHJcbiAgICAgICAgXTtcclxuICAgICAgICB2YXIgbWFya2VyQm91bmRzID0gTC5sYXRMbmdCb3VuZHMobGF0TG5ncyk7XHJcbiAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcC5maXRCb3VuZHMobWFya2VyQm91bmRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5tYXBFdmVudHMgPSBsZWFmbGV0TWFwRXZlbnRzLmdldEF2YWlsYWJsZU1hcEV2ZW50cygpO1xyXG5cclxuXHJcbiAgICAvL2xvZyBldmVudHMgZm9yIG1hcmtlciBvYmplY3RzXHJcbiAgICBmb3IgKHZhciBrIGluIHZtLm1hcEV2ZW50cykge1xyXG4gICAgICAgIC8vICBjb25zb2xlLmxvZyh2bS5tYXBFdmVudHMpO1xyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci4nICsgdm0ubWFwRXZlbnRzW2tdO1xyXG4gICAgICAgICRzY29wZS4kb24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdmVyJykge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2hhbmdlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW91dCcpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZtLnJlbW92ZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0uZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5jbGljaycpIHtcclxuICAgICAgICAgICAgICAgIC8vICB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIC8vICB2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXS5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHZhciBtYXBFdmVudCA9ICdsZWFmbGV0RGlyZWN0aXZlTWFwLmRyYWdlbmQnO1xyXG5cclxuICAgICRzY29wZS4kb24obWFwRXZlbnQsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIHVwZGF0ZU1hcChhcmdzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBtYXBFdmVudDIgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC56b29tZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50MiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgdXBkYXRlTWFwKGFyZ3MpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTWFwKGFyZ3MpIHtcclxuICAgICAgICBpZiAodm0ubWFwQXV0b1JlZnJlc2gpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm1hcmtlcnMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0TkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmc7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubGF0U1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQ7XHJcbiAgICAgICAgICAgICAgICB2bS5wYXJhbXMubG5nU1cgPSBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJy5kYXRhLXZpeicpLndpZHRoKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgICAgICAnbGF0TkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ05FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICdsYXRTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG5nU1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YSc7XHJcblxyXG4gICAgZnVuY3Rpb24gb3Blbk1hcCgpIHtcclxuICAgICAgICB2bS5tYXBBY3RpdmUgPSAhdm0ubWFwQWN0aXZlO1xyXG4gICAgICAgICQoJy5kYXRhLXZpeicpLnRvZ2dsZUNsYXNzKCdtYXAtb3BlbicpO1xyXG4gICAgICAgICQoJy5tYXAtYXV0by1yZWZyZXNoJykudG9nZ2xlQ2xhc3MoJ3JlZnJlc2gtb3BlbicpO1xyXG4gICAgICAgICh2bS50b2dnbGVUaXRsZSA9PSAnIEhhcml0YScgPyB2bS50b2dnbGVUaXRsZSA9ICcgTGlzdGUnIDogdm0udG9nZ2xlVGl0bGUgPSAnIEhhcml0YScpXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCQoJy5kYXRhLXZpeicpLndpZHRoKCkpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY2hhbmdlSW1nKCkge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyLmVsZW1lbnQoJy5ub3QtZm91bmQtaW1nJyksIGZ1bmN0aW9uICh2YWwsIGtleSkge1xyXG4gICAgICAgICAgICB2YWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZScpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0iLCIgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgYW5ndWxhclxyXG4gICAgICAgICAgICAubW9kdWxlKCdhcHAucm90YWxhcmltJywgW10pXHJcbiAgICAgICAgICAgIC5kaXJlY3RpdmUoJ3JvdGFsYXJpbScsIHJvdGFsYXJpbSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcm90YWxhckRldGFpbCgpIHtcclxuICAgICAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyaW0vcm90YWxhcmltLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogUm90YWxhcmltQ29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmU7IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgUm90YWxhcmltQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXREYXRhJywgJ3dlYXRoZXJBUEknLCAnbmdEaWFsb2cnXTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gUm90YWxhcmltQ29udHJvbGxlcigpe1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICB9KSgpOyIsImFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yb3RhbGFyRGV0YWlsJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdyb3RhbGFyRGV0YWlsJywgcm90YWxhckRldGFpbClcclxuXHJcbmZ1bmN0aW9uIHJvdGFsYXJEZXRhaWwoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFsYXIuZGV0YWlsL3JvdGFsYXIuZGV0YWlsLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICBjb250cm9sbGVyOiBSb3RhbGFyRGV0YWlsQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlOyBcclxufVxyXG5cclxuUm90YWxhckRldGFpbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0RGF0YScsICd3ZWF0aGVyQVBJJywgJ25nRGlhbG9nJ107XHJcblxyXG5mdW5jdGlvbiBSb3RhbGFyRGV0YWlsQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0RGF0YSwgd2VhdGhlckFQSSwgbmdEaWFsb2cpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja0RldGFpbCA9IHt9O1xyXG4gICAgdm0uY2VudGVyID0ge307XHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyRm9yRGV0YWlsKCk7XHJcbiAgICB2bS5jb250cm9scyA9IGNvbnRyb2xzO1xyXG4gICAgdm0udXBkYXRlVHJhY2sgPSB1cGRhdGVUcmFjaztcclxuICAgIHZtLmRlbGV0ZVRyYWNrID0gZGVsZXRlVHJhY2s7XHJcbiAgICB2bS5kZWxldGVUcmFja09LID0gZGVsZXRlVHJhY2tPSztcclxuICAgIHZtLnVwZGF0ZVRyYWNrID0gdXBkYXRlVHJhY2s7XHJcbiAgICB2bS51cGRhdGVUcmFja09LID0gdXBkYXRlVHJhY2tPSztcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmM7XHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0uZ3B4RGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgd2VhdGhlckFQSS5kYXJrU2t5V2VhdGhlcih2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdm0ud2VhdGhlciA9IHJlcztcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjFcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjJcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseSA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29uc0RhaWx5V2hpdGUgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLndlYXRoZXIuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0ga2V5ICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrID0ga2V5ICsgMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcyA9IFwiaWNvblwiICsgcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtrID0gXCJpY29uXCIgKyBrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LmFkZChzcywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUuYWRkKGtrLCB2YWx1ZS5pY29uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHkucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHlXaGl0ZS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5tb2JpbGVjaGVjaygpKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmRyYWdnaW5nLmRpc2FibGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuYWRkQ29udHJvbChuZXcgTC5Db250cm9sLkZ1bGxzY3JlZW4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiAnMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjknXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cHRJY29uVXJsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyc6ICdpbWcvaWNvbi1nby5zdmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0dlb2NhY2hlIEZvdW5kJzogJ2ltZy9ncHgvZ2VvY2FjaGUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQYXJrJzogJ2ltZy9ncHgvdHJlZS5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SWNvblVybDogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEljb25Vcmw6ICdpbWcvaWNvbi1zdG9wLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1VybDogJ2ltZy9waW4tc2hhZG93LnBuZydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmRpc3RhbmNlID0gZS50YXJnZXQuZ2V0X2Rpc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNaW4gPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21pbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZWxlTWF4ID0gZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9tYXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc2V0MDogZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9kYXRhKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmdldEJvdW5kcygpKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdCb3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9ub3J0aEVhc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQgKyAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nICsgMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zb3V0aFdlc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQgLSAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nIC0gMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobmV3Qm91bmRzLl9ub3J0aEVhc3QubGF0LCBuZXdCb3VuZHMuX25vcnRoRWFzdC5sbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX3NvdXRoV2VzdC5sYXQsIG5ld0JvdW5kcy5fc291dGhXZXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldE1heEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5fbGF5ZXJzTWluWm9vbSA9IDEwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGcuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG4gICAgdmFyIGNvbnRyb2xzID0ge1xyXG4gICAgICAgIGZ1bGxzY3JlZW46IHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLnVwZGF0ZVRyYWNrKHZtLnRyYWNrRGV0YWlsKS50aGVuKGZ1bmN0aW9uICgpIHt9LCBmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVsZXRlVHJhY2tPSygpIHtcclxuXHJcbiAgICAgICAgbmdEaWFsb2cub3Blbih7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAndGVtcGxhdGVJZCcsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2U6IGZhbHNlLFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBzY29wZTogJHNjb3BlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9IFxyXG5cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVRyYWNrKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKDEpO1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5kZWxldGVUcmFjayh2bS50cmFja0RldGFpbCkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmKHJlcy5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcInJvdGFsYXJTdGF0ZVwiKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAocmVqKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWonKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRyYWNrT0soKSB7XHJcblxyXG4gICAgICAgIG5nRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3VwZGF0ZVRyYWNrJyxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXHJcbiAgICAgICAgICAgIHNob3dDbG9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiLyoqXHJcbiAqIEBkZXNjIFNlcnZpY2VzIHRoYXQgY29udmVydHMgZ2VvanNvbiBmZWF0dXJlcyB0byBtYXJrZXJzIGZvciBoYW5kbGluZyBsYXRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hcmtlclBhcnNlcigkcSkge1xyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAganNvblRvTWFya2VyQXJyYXk6IGpzb25Ub01hcmtlckFycmF5LFxyXG4gICAgICAgIHRvT2JqZWN0OiB0b09iamVjdCxcclxuICAgICAgICBtYXJrZXJDb250ZW50OiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vIGNvbnZlcnQgZmVhdHVyZSBnZW9qc29uIHRvIGFycmF5IG9mIG1hcmtlcnNcclxuICAgIGZ1bmN0aW9uIGpzb25Ub01hcmtlckFycmF5KHZhbCkge1xyXG4gICAgICAgIHZhciBkZWZlcmVkID0gJHEuZGVmZXIoKTsgLy8gZGVmZXJlZCBvYmplY3QgcmVzdWx0IG9mIGFzeW5jIG9wZXJhdGlvblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgc2VydmljZS5tYXJrZXJDb250ZW50ID0gJ1x0PGRpdiBjbGFzcz1cImNhcmQgY2FyZC1vbi1tYXBcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1pbWFnZS1jb3ZlclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxpbWcgZGF0YS1uZy1zcmM9XCInICsgdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyArICdcIiBjbGFzcz1cImltZy1mbHVpZFwiIGFsdD1cIlwiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxhPjxkaXYgY2xhc3M9XCJtYXNrIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPjwvZGl2PjwvYT4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1ibG9ja1wiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxoNCBjbGFzcz1cImNhcmQtdGl0bGUgZm9udC1zaXplLTE2XCI+PGEgaHJlZj1cInJvdGEvJysgdmFsW2ldLl9pZCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jyt2YWxbaV0ucHJvcGVydGllcy5uYW1lKyc8L2E+PC9oND4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICB2YXIgbWFyayA9IHtcclxuICAgICAgICAgICAgICAgIGxheWVyOiBcInJvdGFsYXJcIixcclxuICAgICAgICAgICAgICAgIGxhdDogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgbG5nOiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICBmb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBtZXNzYWdlOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogc2VydmljZS5tYXJrZXJDb250ZW50LnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gaWNvbl9zd2FwIDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHZhbFtpXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRpdHVkZVwiOiB2YWxbaV0ucHJvcGVydGllcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmRpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VtbWFyeVwiOiB2YWxbaV0ucHJvcGVydGllcy5zdW1tYXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3duZXJcIjogdmFsW2ldLnByb3BlcnRpZXMub3duZWRCeSxcclxuICAgICAgICAgICAgICAgICAgICBcImltZ19zcmNcIjogdmFsW2ldLnByb3BlcnRpZXMuaW1nX3NyYyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChtYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dHB1dCkge1xyXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUob3V0cHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcclxuICAgICAgICB2YXIgcnYgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IHVuZGVmaW5lZCkgcnZbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXJrZXJQYXJzZXInLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXJrZXJQYXJzZXInLCBtYXJrZXJQYXJzZXIpOyIsImZ1bmN0aW9uIHRyYWNrU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBlbmRwb2ludCA9ICdodHRwOmxvY2FsaG9zdDo4MDgwLydcclxuXHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRUcmFjazogZ2V0VHJhY2ssXHJcblx0XHRhZGRUcmFjazogYWRkVHJhY2ssXHJcblx0XHR1cGRhdGVUcmFjazogdXBkYXRlVHJhY2ssXHJcblx0XHRkZWxldGVUcmFjazogZGVsZXRlVHJhY2ssXHJcblx0XHRnZXRUcmFja0RldGFpbDogZ2V0VHJhY2tEZXRhaWwsXHJcblx0fTtcclxuXHRyZXR1cm4gc2VydmljZTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2socGFyYW1zKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzP2xhdE5FPScgKyBwYXJhbXMubGF0TkUgKyAnJmxuZ05FPScgKyBwYXJhbXMubG5nTkUgKyAnJmxhdFNXPScgKyBwYXJhbXMubGF0U1cgKyAnJmxuZ1NXPScgKyBwYXJhbXMubG5nU1csXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH0sXHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrRGV0YWlsKGlkKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycgKyBpZCxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBhZGRUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MnLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGRhdGE6ICQucGFyYW0oe1xyXG5cdFx0XHRcdFwibmFtZVwiOiB0cmFjay5uYW1lLFxyXG5cdFx0XHRcdFwiZGlzdGFuY2VcIjogdHJhY2suZGlzdGFuY2UsXHJcblx0XHRcdFx0XCJhbHRpdHVkZVwiOiB0cmFjay5hbHRpdHVkZSxcclxuXHRcdFx0XHRcInN1bW1hcnlcIjogdHJhY2suc3VtbWFyeSxcclxuXHRcdFx0XHRcImltZ19zcmNcIjogdHJhY2suaW1nX3NyYyxcclxuXHRcdFx0XHRcImNvb3JkaW5hdGVzXCI6IHRyYWNrLmNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdFwib3duZWRCeVwiOiB0cmFjay5vd25lZEJ5LFxyXG5cdFx0XHRcdFwiZ3B4XCI6IHRyYWNrLmdweCxcclxuXHRcdFx0XHRcImlzQ2FtcFwiOiB0cmFjay5pc0NhbXAsXHJcblx0XHRcdFx0XCJzZWFzb25zXCI6IHRyYWNrLnNlbGVjdGVkU2Vhc29ucyxcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1cGRhdGVUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnUFVUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nICsgdHJhY2suX2lkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGRhdGE6ICQucGFyYW0oe1xyXG5cdFx0XHRcdFwibmFtZVwiOiB0cmFjay5uYW1lLFxyXG5cdFx0XHRcdFwiZGlzdGFuY2VcIjogdHJhY2suZGlzdGFuY2UsXHJcblx0XHRcdFx0XCJhbHRpdHVkZVwiOiB0cmFjay5hbHRpdHVkZSxcclxuXHRcdFx0XHRcInN1bW1hcnlcIjogdHJhY2suc3VtbWFyeSxcclxuXHRcdFx0XHRcImltZ19zcmNcIjogdHJhY2suaW1nX3NyYyxcclxuXHRcdFx0XHRcImNvb3JkaW5hdGVzXCI6IHRyYWNrLmNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdFwib3duZWRCeVwiOiB0cmFjay5vd25lZEJ5LFxyXG5cdFx0XHRcdFwiZ3B4XCI6IHRyYWNrLmdweCxcclxuXHRcdFx0XHRcImlzQ2FtcFwiOiB0cmFjay5pc0NhbXAsXHJcblx0XHRcdFx0XCJzZWFzb25zXCI6IHRyYWNrLnNlbGVjdGVkU2Vhc29ucyxcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkZWxldGVUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nICsgdHJhY2suX2lkLFxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLnRyYWNrU2VydmljZScsIFtdKVxyXG5cdC5mYWN0b3J5KCd0cmFja1NlcnZpY2UnLCB0cmFja1NlcnZpY2UpOyIsImZ1bmN0aW9uIHVzZXJTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRVc2VyOiBnZXRVc2VyLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgIFx0cmV0dXJuICRodHRwKHtcclxuICAgIFx0XHRtZXRob2Q6ICdHRVQnLFxyXG4gICAgXHRcdHVybDogJ2FwaS9wcm9maWxlJ1xyXG4gICAgXHR9KVxyXG4gICAgfTsgXHJcbn0gXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLnVzZXJTZXJ2aWNlJywgW10pXHJcbi5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBzZXJ2aWNlSWQgPSAnd2VhdGhlckFQSSc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC53ZWF0aGVyJywgW10pXHJcbiAgICAgICAgLmZhY3Rvcnkoc2VydmljZUlkLCBbJyRxJywgJyRodHRwJywgd2VhdGhlckFQSV0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdlYXRoZXJBUEkoJHEsICRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIHdlYXRoZXI6IHdlYXRoZXIsXHJcbiAgICAgICAgICAgIGZvcmVjYXN0OiBmb3JlY2FzdCxcclxuICAgICAgICAgICAgZGFya1NreVdlYXRoZXI6IGRhcmtTa3lXZWF0aGVyLFxyXG4gICAgICAgICAgICBhcHBpZDogJ2ZhMmQ1OTNhYTU4ZTkwZmRlMzI4NDI2ZTY0YTY0ZTM4J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHdlYXRoZXIobGF0LCBsbmcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PScgKyBsYXQgKyAnJmxvbj0nICsgbG5nICsgJyZhcHBpZD0nICsgc2VydmljZS5hcHBpZCArICcmdW5pdHM9bWV0cmljJmxhbmc9dHInXHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmNvZCA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRIb3VycyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRNaW51dGVzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGN1cnJlbnQgaG91ciB1c2luZyBvZmZzZXQgZnJvbSBVVEMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRldGltZSA9IG5ldyBEYXRlKChyZXMuZGF0YS5kdCAqIDEwMDApICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5yaXNlID0gbmV3IERhdGUocmVzLmRhdGEuc3lzLnN1bnJpc2UgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5zZXQgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3Vuc2V0ICogMTAwMCArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUN1cnJlbnQgPSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5kYXRldGltZSA9IGRhdGV0aW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA9IGRhdGFDdXJyZW50LmRhdGV0aW1lLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyID0gc3VucmlzZS5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5zdW5zZXRIb3VyID0gc3Vuc2V0LmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSG91ciBiZXR3ZWVuIHN1bnNldCBhbmQgc3VucmlzZSBiZWluZyBuaWdodCB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPj0gZGF0YUN1cnJlbnQuc3Vuc2V0SG91ciB8fCBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA8PSBkYXRhQ3VycmVudC5zdW5yaXNlSG91cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCB3ZWF0aGVyIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJEZXNjcmlwdGlvbiA9IHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXMuZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFuZ2Ugd2VhdGhlciBpY29uIGNsYXNzIGFjY29yZGluZyB0byB3ZWF0aGVyIGNvZGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtZm9nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWNsZWFyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS10aHVuZGVyc3Rvcm1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN0b3JtLXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNub3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW4tbWl4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzQxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN1bm55XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDczMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWR1c3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc21va2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzcxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1ODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zdHJvbmctd2luZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3ODE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXRvcm5hZG9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWh1cnJpY2FuZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbm93Zmxha2UtY29sZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1ob3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50OiBkYXRhQ3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9yZWNhc3QobGF0LCBsbmcpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkYXJrU2t5V2VhdGhlcihsYXQsIGxuZykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3dlYXRoZXIvJyArIGxhdCArICcvJyArIGxuZyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLk9wZXJhdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudGx5LnRpbWUgPSBuZXcgRGF0ZSgoZGF0YS5jdXJyZW50bHkudGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdGEuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGFpbHkuZGF0YVtrZXldLnRpbWUgPSAgbmV3IERhdGUoKHZhbHVlLnRpbWUgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCJmdW5jdGlvbiBtYXBDb25maWdTZXJ2aWNlKCkge1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgIGdldExheWVyOiBnZXRMYXllcixcclxuICAgICAgICBnZXRDZW50ZXI6IGdldENlbnRlcixcclxuICAgICAgICBnZXRMYXllckZvckRldGFpbDogZ2V0TGF5ZXJGb3JEZXRhaWwsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXIoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgTWFwYm94X1NhdGVsbGl0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdVeWR1JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc2F0ZWxsaXRlLXN0cmVldHMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X091dGRvb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L291dGRvb3JzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9MYW5zY2FwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfEsHpvaGlwcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL2xhbmRzY2FwZS97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBZYW5kZXg6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWWFuZGV4IFlvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3lhbmRleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllclR5cGU6ICdtYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvdmVybGF5czoge1xyXG4gICAgICAgICAgICAgICAgcm90YWxhcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgbGF0OiAzOS45MDMyOTE4LFxyXG4gICAgICAgICAgICBsbmc6IDMyLjYyMjMzOTYsXHJcbiAgICAgICAgICAgIHpvb206IDZcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllckZvckRldGFpbCgpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X1NhdGVsbGl0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdVeWR1JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc2F0ZWxsaXRlLXN0cmVldHMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X091dGRvb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L291dGRvb3JzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgWWFuZGV4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1lhbmRleCBZb2wnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd5YW5kZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICBsYXllck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJUeXBlOiAnbWFwJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm1hcCcsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ21hcENvbmZpZ1NlcnZpY2UnLCBtYXBDb25maWdTZXJ2aWNlKTsiLCJmdW5jdGlvbiBnZW9jb2RlKCRxKSB7XHJcbiAgcmV0dXJuIHsgXHJcbiAgICBnZW9jb2RlQWRkcmVzczogZnVuY3Rpb24oYWRkcmVzcykge1xyXG4gICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7ICdhZGRyZXNzJzogYWRkcmVzcyB9LCBmdW5jdGlvbiAocmVzdWx0cywgc3RhdHVzKSB7XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAvLyB3aW5kb3cuZmluZExvY2F0aW9uKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdnZW9jb2RlJywgZ2VvY29kZSk7IiwiZnVuY3Rpb24gcmV2ZXJzZUdlb2NvZGUoJHEsICRodHRwKSB7XHJcbiAgICB2YXIgb2JqID0ge307XHJcbiAgICBvYmouZ2VvY29kZUxhdGxuZyA9IGZ1bmN0aW9uIGdlb2NvZGVQb3NpdGlvbihsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoe1xyXG4gICAgICAgICAgICBsYXRMbmc6IGxhdGxuZ1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2VzICYmIHJlc3BvbnNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZXNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgncmV2ZXJzZUdlb2NvZGUnLCByZXZlcnNlR2VvY29kZSk7Il19
