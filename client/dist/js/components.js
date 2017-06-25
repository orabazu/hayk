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
//   (function () {
//       'use strict';

//         angular
//             .module('app.rotalarim', [])
//             .directive('rotalarim', rotalarim)

//         function rotalarDetail() {
//             var directive = {
//                 restrict: 'A',
//                 templateUrl: '../../components/rota/rotalarim/rotalarim.html',
//                 scope: {},
//                 controller: RotalarimController,
//                 controllerAs: 'vm',
//                 bindToController: true
//             };

//             return directive; 
//         }

//         RotalarimController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData', 'weatherAPI', 'ngDialog'];

//         function RotalarimController(){
             
//         }

//   })();
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
    vm.controls = {
        fullscreen: {
            position: 'topleft'
        }
    };
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
        
    function updateTrack(detail) {
        return trackService.updateTrack(detail).then(function () {}, function () {});
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
				"name": track.properties.name,
				"distance": track.properties.distance,
				"altitude": track.properties.altitude,
				"summary": track.properties.summary,
				"img_src": track.properties.img_src,
				"coordinates": track.geometry.coordinates,
				"gpx": track.properties.gpx,
				"isCamp": track.properties.isCamp,
				"seasons": track.properties.selectedSeasons,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiYXBwLnJ1bi5qcyIsImNvbnRlbnQvYXBwLmNvbnRlbnQuanMiLCJ1c2VyL2FwcC51c2VyLmpzIiwicm90YS9hcHAucm90YS5qcyIsImZvb3Rlci9mb290ZXIuanMiLCJoZWFkbGluZS9oZWFkbGluZS5qcyIsImNhcmQvY2FyZC5kaXJlY3RpdmUuanMiLCJjb25uZWN0L2Nvbm5lY3QuZGlyZWN0aXZlLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicGFzc3dvcmQtdmVyaWZ5L3Bhc3N3b3JkLXZlcmlmeS5kaXJlY3RpdmUuanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJyZWdpc3Rlci9yZWdpc3Rlci5qcyIsInJvdGFla2xlL3JvdGFla2xlLmpzIiwicm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uanMiLCJyb3RhbGFyL3JvdGFsYXIuanMiLCJyb3RhbGFyaW0vcm90YWxhcmltLmRpcmVjdGl2ZS5qcyIsInJvdGFsYXIuZGV0YWlsL3JvdGFsYXIuZGV0YWlsLmpzIiwibWFya2VycGFyc2VyLmpzIiwidHJhY2suanMiLCJ1c2VyLmpzIiwid2VhdGhlckFQSS5qcyIsIm1hcC9tYXAuY29uZmlnLmpzIiwibWFwL21hcC5nZW9jb2RlLmpzIiwibWFwL21hcC5yZXZlcnNlR2VvY29kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFVBQVUsYUFBYSxVQUFVLFFBQVEsYUFBYTtJQUN6RCxJQUFJLFNBQVM7O0lBRWIsT0FBTyxPQUFPLE1BQU0sUUFBUSxLQUFLOzs7O0FBSXJDLE9BQU8sbUJBQW1CLFlBQVk7SUFDbEMsRUFBRSx5QkFBeUIsS0FBSyxZQUFZO1FBQ3hDLElBQUksT0FBTztRQUNYLEVBQUUsTUFBTSxVQUFVO1lBQ2QsUUFBUSxVQUFVLE9BQU8sU0FBUztnQkFDOUIsSUFBSSxjQUFjO2dCQUNsQixFQUFFLFFBQVEsK0hBQStILE9BQU8sVUFBVSxNQUFN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QkFBZ0IsU0FBUyxTQUFTO01BQ2hDLElBQUksV0FBVyxJQUFJLE9BQU8sS0FBSztNQUMvQixJQUFJLFdBQVcsR0FBRztNQUNsQixTQUFTLFFBQVEsRUFBRSxXQUFXLFdBQVcsVUFBVSxTQUFTLFFBQVE7UUFDbEUsSUFBSSxVQUFVLE9BQU8sS0FBSyxlQUFlLElBQUk7VUFDM0MsT0FBTyxTQUFTLFFBQVEsUUFBUSxHQUFHLFNBQVM7OztRQUc5QyxPQUFPLFNBQVM7O01BRWxCLE9BQU8sU0FBUzs7Ozs7QUFLdEI7RUFDRSxPQUFPO0VBQ1AsUUFBUSxXQUFXLFNBQVM7O3lDQ25COUIsU0FBUyxlQUFlLElBQUksT0FBTztJQUMvQixJQUFJLE1BQU07SUFDVixJQUFJLGdCQUFnQixTQUFTLGdCQUFnQixLQUFLLEtBQUs7UUFDbkQsSUFBSSxXQUFXLElBQUksT0FBTyxLQUFLO1FBQy9CLElBQUksV0FBVyxHQUFHO1FBQ2xCLElBQUksU0FBUyxJQUFJLE9BQU8sS0FBSyxPQUFPLEtBQUs7UUFDekMsU0FBUyxRQUFRO1lBQ2IsUUFBUTtXQUNULFNBQVMsV0FBVztZQUNuQixJQUFJLGFBQWEsVUFBVSxTQUFTLEdBQUc7Z0JBQ25DLE9BQU8sU0FBUyxRQUFRLFVBQVUsR0FBRzttQkFDbEM7Z0JBQ0gsT0FBTyxTQUFTLFFBQVE7O1dBRTdCLFVBQVUsS0FBSztZQUNkLE9BQU8sU0FBUyxRQUFROztRQUU1QixPQUFPLFNBQVM7O0lBRXBCLE9BQU87OztBQUdYO0VBQ0UsT0FBTztFQUNQLFFBQVEsa0JBQWtCLGdCQUFnQiIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24gKHNlYXJjaCwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiB0YXJnZXQuc3BsaXQoc2VhcmNoKS5qb2luKHJlcGxhY2VtZW50KTtcclxufTtcclxuXHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5nZW9jb2RlLWF1dG9jb21wbGV0ZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAkKHRoYXQpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24gKHF1ZXJ5LCBwcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJlZGljdGlvbnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICQuZ2V0SlNPTignaHR0cHM6Ly9nZW9jb2RlLW1hcHMueWFuZGV4LnJ1LzEueC8/cmVzdWx0cz01JmJib3g9MjQuMTI1OTc3LDM0LjQ1MjIxOH40NS4xMDk4NjMsNDIuNjAxNjIwJmZvcm1hdD1qc29uJmxhbmc9dHJfVFImZ2VvY29kZT0nICsgcXVlcnksIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5uYW1lICsgJywgJyArIGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbi5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdsYXQ6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5Qb2ludC5wb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubWV0YURhdGFQcm9wZXJ0eS5HZW9jb2Rlck1ldGFEYXRhLmtpbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRfdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJib3g6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5ib3VuZGVkQnkuRW52ZWxvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmRlc2NyaXB0aW9uLmluZGV4T2YoJ1TDvHJraXllJykgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWRpY3Rpb25zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChwcmVkaWN0aW9ucyAmJiBwcmVkaWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHJlc3VsdHMgPSAkLm1hcChwcmVkaWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZ1bmN0aW9uIChwcmVkaWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGRlc3QgPSBwcmVkaWN0aW9uLm5hbWUgKyBcIiwgXCIgKyBwcmVkaWN0aW9uLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRlc3QgPSBkZXN0LnJlcGxhY2UoJywgVMO8cmtpeWUnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MocHJlZGljdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFmdGVyU2VsZWN0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF0U1cgPSBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBsbmdTVyA9IGl0ZW0uYmJveC5sb3dlckNvcm5lci5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhdE5FID0gaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbG5nTkUgPSBpdGVtLmJib3gudXBwZXJDb3JuZXIuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gJy9yb3RhbGFyLycgKyBpdGVtLm5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICAgICc/bGF0U1c9JyArIGxhdFNXLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nU1c9JyArIGxuZ1NXLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbGF0TkU9JyArIGxhdE5FLnRvU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcmbG5nTkU9JyArIGxuZ05FLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpdGVtID0gJzxzcGFuIGNsYXNzPVwiaXRlbS1hZGRyZXNzXCI+JyArIGl0ZW0gKyAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMyxcclxuICAgICAgICAgICAgZml0VG9FbGVtZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGF0KS5vbigndHlwZWFoZWFkOmNoYW5nZScsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoYXQpLnZhbChpdGVtLmZpbmQoJ2E+c3Bhbi5pdGVtLWFkZHJlc3MnKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbndpbmRvdy5tb2JpbGVjaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGVjayA9IGZhbHNlO1xyXG4gICAgKGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgaWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCwgNCkpKSBjaGVjayA9IHRydWU7XHJcbiAgICB9KShuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgd2luZG93Lm9wZXJhKTtcclxuICAgIHJldHVybiBjaGVjaztcclxufTtcclxuXHJcbndpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgICAnYXBwLm5hdmJhcicsXHJcbiAgICAgICdhcHAubG9naW4nLFxyXG4gICAgICAnYXBwLnJlZ2lzdGVyJyxcclxuICAgICAgJ2FwcC5jb25uZWN0JyxcclxuICAgICAgJ2FwcC5jYXJkJyxcclxuICAgICAgJ2FwcC5wcm9maWxlJyxcclxuICAgICAgJ2FwcC51c2VyU2VydmljZScsXHJcbiAgICAgICdhcHAudHJhY2tTZXJ2aWNlJyxcclxuICAgICAgJ2FwcC5tYXJrZXJQYXJzZXInLFxyXG4gICAgICAnYXBwLm1hcCcsXHJcbiAgICAgICdhcHAuY29udGVudCcsXHJcbiAgICAgICdhcHAucm90YScsXHJcbiAgICAgICdvYy5sYXp5TG9hZCcsXHJcbiAgICAgICd1aS5yb3V0ZXInLFxyXG4gICAgICAnbGVhZmxldC1kaXJlY3RpdmUnLFxyXG4gICAgICAnYXBwLndlYXRoZXInLFxyXG4gICAgICAncGFzc3dvcmRWZXJpZnknLFxyXG4gICAgXSlcclxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckbG9nUHJvdmlkZXInLCAnJG9jTGF6eUxvYWRQcm92aWRlcicsICckY29tcGlsZVByb3ZpZGVyJywgJ25nRGlhbG9nUHJvdmlkZXInLFxyXG4gICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbG9nUHJvdmlkZXIsICRvY0xhenlMb2FkUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsIG5nRGlhbG9nUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgbmdEaWFsb2dQcm92aWRlci5zZXREZWZhdWx0cyh7XHJcbiAgICAgICAgICBwcmVDbG9zZUNhbGxiYWNrOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgJCgnLmNvbnRhaW5lcicpLmNzcyh7XHJcbiAgICAgICAgICAgICAgJ2ZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLXdlYmtpdC1maWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy1tb3otZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctby1maWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy1tcy1maWx0ZXInOiAnbm9uZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJy5uYXZiYXInKS5jc3Moe1xyXG4gICAgICAgICAgICAgICdmaWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy13ZWJraXQtZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctbW96LWZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLW8tZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctbXMtZmlsdGVyJzogJ25vbmUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uT3BlbkNhbGxiYWNrOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgJCgnLmNvbnRhaW5lcicpLmNzcyh7XHJcbiAgICAgICAgICAgICAgJ2ZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctd2Via2l0LWZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctbW96LWZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctby1maWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLW1zLWZpbHRlcic6ICdibHVyKDVweCknXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcubmF2YmFyJykuY3NzKHtcclxuICAgICAgICAgICAgICAnZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy13ZWJraXQtZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy1tb3otZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy1vLWZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctbXMtZmlsdGVyJzogJ2JsdXIoNXB4KSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcclxuICAgICAgICAgIGRlYnVnOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoZmFsc2UpO1xyXG4gICAgICAgIC8vICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnLyMvJyk7XHJcbiAgICAgICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdmFyIGxvZ2luU3RhdGUgPSB7XHJcbiAgICAgICAgICBuYW1lOiAnbG9naW4nLFxyXG4gICAgICAgICAgdXJsOiAnL2dpcmlzJyxcclxuICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luLWRpcmVjdGl2ZT48L2xvZ2luLWRpcmVjdGl2ZT4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsb2dpblN0YXRlKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ2lzdGVyU3RhdGUgPSB7XHJcbiAgICAgICAgICBuYW1lOiAncmVnaXN0ZXInLFxyXG4gICAgICAgICAgdXJsOiAnL2theWl0JyxcclxuICAgICAgICAgIHRlbXBsYXRlOiAnPHJlZ2lzdGVyLWRpcmVjdGl2ZT48L3JlZ2lzdGVyLWRpcmVjdGl2ZT4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyZWdpc3RlclN0YXRlKTtcclxuXHJcbiAgICAgICAgdmFyIHByb2ZpbGVTdGF0ZSA9IHtcclxuICAgICAgICAgIG5hbWU6ICdwcm9maWxlJyxcclxuICAgICAgICAgIHVybDogJy9wcm9maWwnLFxyXG4gICAgICAgICAgdGVtcGxhdGU6ICc8cHJvZmlsZS1kaXJlY3RpdmU+PC9wcm9maWxlLWRpcmVjdGl2ZT4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwcm9maWxlU3RhdGUpO1xyXG5cclxuICAgICAgICB2YXIgY29ubmVjdFN0YXRlID0ge1xyXG4gICAgICAgICAgbmFtZTogJ2Nvbm5lY3QnLFxyXG4gICAgICAgICAgdXJsOiAnL2Vwb3N0YS1iYWdsYScsXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxjb25uZWN0LWNvbXBvbmVudD48L2Nvbm5lY3QtY29tcG9uZW50PidcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGNvbm5lY3RTdGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIF0pXHJcblxyXG5cclxuXHJcbn0pKCk7IiwiICAoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gIFxyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlKSB7XHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICByZXR1cm4gZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgICByZXR1cm4gdXNlclNlcnZpY2UuZ2V0VXNlcigpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgIGlmIChyZXNwb25kLmRhdGEuT3BlcmF0aW9uUmVzdWx0KSBcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gcmVzcG9uZC5kYXRhLnVzZXI7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuZmxhZ0xvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICB7XHJcbiBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbnRlbnQnLCBbJ2FwcC5oZWFkZXInLCAnYXBwLmZvb3RlcicsJ3VpLnJvdXRlciddKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHsgLy8gcHJvdmlkZXItaW5qZWN0b3JcclxuXHJcbiAgICAgICAgLy8gJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvIy8nKTtcclxuICAgICAgICB2YXIgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnZGVmYXVsdFN0YXRlJywgXHJcbiAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvY29udGVudC9sYW5kaW5nL2xhbmRpbmcuaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGRlZmF1bHRTdGF0ZSk7XHJcbiAgICB9KVxyXG4gIFxyXG59KSgpOyIsIiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGEnLCBbJ2FwcC5yb3RhbGFyJywgJ2FwcC5yb3RhbGFyRGV0YWlsJywgJ2FwcC5yb3RhZWtsZScsICd1aS5yb3V0ZXInLCduZ0RpYWxvZyddKVxyXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgICAgICB2YXIgcm90YWxhclN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGFsYXIve3Rlcm19P2xhdFNXJmxuZ1NXJmxhdE5FJmxuZ05FJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPG5hdmJhci1kaXJlY3RpdmU+PC9uYXZiYXItZGlyZWN0aXZlPjxyb3RhbGFyPjwvcm90YWxhcj4nLFxyXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJEZXRhaWxTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyRGV0YWlsJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhLzppZCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhci1kZXRhaWw+PC9yb3RhbGFyLWRldGFpbD4nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJvdGFsYXJEZXRhaWxTdGF0ZSk7XHJcbiBcclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2snLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JvdGFla2xlJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlL3JvdGFla2xlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3JvdGFFa2xlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdyb3RhRWtsZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrTG9jYXRpb25TdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5sb2NhdGlvbicsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva29udW0nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uaHRtbCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tMb2NhdGlvblN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja01ldGFTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5tZXRhJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iaWxnaScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5tZXRhL3JvdGFla2xlLm1ldGEuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja01ldGFTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tDYW1wU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suY2FtcCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva2FtcCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5rYW1wL3JvdGFla2xlLmthbXAuaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0NhbXBTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tTZWFzb25TdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5zZWFzb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Nlem9uJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLnNlYXNvbi9yb3RhZWtsZS5zZWFzb24uaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1NlYXNvblN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ltYWdlU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Jlc2ltbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmltYWdlL3JvdGFla2xlLmltYWdlLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tJbWFnZVN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0dQWFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmdweCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZ3B4JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmdweC9yb3RhZWtsZS5ncHguaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0dQWFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0ZpbmlzaFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmZpbmlzaCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcva2F5ZGV0JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmZpbmlzaC9yb3RhZWtsZS5maW5pc2guaHRtbCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja0ZpbmlzaFN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mb290ZXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2Zvb3RlckRpcmVjdGl2ZScsIGZvb3RlckRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBmb290ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb250ZW50L2Zvb3Rlci9mb290ZXIuaHRtbCcsXHJcbiAgICB9O1xyXG4gIFxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG59KSgpOyBcclxuIFxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5oZWFkZXInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdoZWFkbGluZURpcmVjdGl2ZScsIGhlYWRsaW5lRGlyZWN0aXZlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoZWFkbGluZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvaGVhZGxpbmUvaGVhZGxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogSGVhZGxpbmVDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIEhlYWRsaW5lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJyRpbnRlcnZhbCcsICckcScsJyR3aW5kb3cnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkbGluZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRpbnRlcnZhbCwgJHEsJHdpbmRvdykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuICAgICAgICB2bS5zZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygncm90YWxhcicsIHtcclxuICAgICAgICAgICAgICAgIHRlcm06IHZtLmVsbWFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjQXV0b2NvbXBsZXRlXCIpLmZvY3VzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKFwiI0F1dG9jb21wbGV0ZVwiKS5vZmZzZXQoKS50b3AgLSA4MFxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB3aW5kb3cuc2Nyb2xsWCA9IDA7XHJcbiAgICAgICAgJHdpbmRvdy5zY3JvbGxUbygwLDApO1xyXG5cclxuXHJcbiAgICAgICAgJGludGVydmFsKGNoYW5nZUJnLCA2NTAwKTtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAxO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VCZygpIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgIC8vcmVzdGFydFxyXG4gICAgICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAvLyB2YXIgaW1nVXJsID0gXCJ1cmwoJy4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGcnKVwiO1xyXG4gICAgICAgICAgICB2YXIgaW1nVXJsID0gXCIuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnXCI7XHJcblxyXG4gICAgICAgICAgICBwcmVsb2FkKGltZ1VybCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCIuaGVhZGxpbmVcIilcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ1cmwoXCIrIGltZ1VybCArXCIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZWxvYWQodXJsKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgIGltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1hZ2UuY29tcGxldGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2MgY2FyZCBjb21wb25lbnQgXHJcbiogQGV4YW1wbGUgPGNhcmQ+PC9jYXJkPlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY2FyZCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnY2FyZERpcmVjdGl2ZScsIGNhcmREaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gY2FyZERpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9jYXJkL2NhcmQuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICc8JyxcclxuICAgICAgICAgICAgc3VtbWFyeTogJzwnLFxyXG4gICAgICAgICAgICBvd25lcjonPCcsXHJcbiAgICAgICAgICAgIGltZ1NyYzonPCcsICAgIFxyXG4gICAgICAgICAgICBpZDogJzwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQ2FyZENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7IFxyXG4gICAgLy8gdm0uaW1nU3JjID0gdm0uaW1nU3JjLnNwbGl0KCdjbGllbnQnKVsxXTtcclxufSBcclxuIiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbm5lY3QnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2Nvbm5lY3RDb21wb25lbnQnLCBjb25uZWN0Q29tcG9uZW50KTtcclxuICAgXHJcbmZ1bmN0aW9uIGNvbm5lY3RDb21wb25lbnQoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL2Nvbm5lY3QvY29ubmVjdC5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogY29ubmVjdENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29ubmVjdENvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG59IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmxvZ2luJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdsb2dpbkRpcmVjdGl2ZScsIGxvZ2luRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGxvZ2luRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogRm9vdGVyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4gKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiAqIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuICovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5uYXZiYXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ25hdmJhckRpcmVjdGl2ZScsIG5hdmJhckRpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBuYXZiYXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL25hdmJhci9uYXZiYXIuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IG5hdmJhckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmF2YmFyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTsgXHJcblxyXG4gICAgdm0ub3Blbk5hdiA9IG9wZW5OYXY7XHJcbiAgICB2bS5jbG9zZU5hdiA9IGNsb3NlTmF2O1xyXG5cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5OYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZU5hdigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TmF2XCIpLnN0eWxlLmhlaWdodCAgPSBcIjAlXCI7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGFzc3dvcmRWZXJpZnknLCBbXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGFzc3dvcmRWZXJpZnknKS5kaXJlY3RpdmUoJ2VxdWFscycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLCAvLyBvbmx5IGFjdGl2YXRlIG9uIGVsZW1lbnQgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsIC8vIGdldCBhIGhvbGQgb2YgTmdNb2RlbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZ01vZGVsKSByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB3YXRjaCBvd24gdmFsdWUgYW5kIHJlLXZhbGlkYXRlIG9uIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gb2JzZXJ2ZSB0aGUgb3RoZXIgdmFsdWUgYW5kIHJlLXZhbGlkYXRlIG9uIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUoJ2VxdWFscycsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2YWx1ZXMgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDEgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDIgPSBhdHRycy5lcXVhbHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCB2YWxpZGl0eVxyXG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdlcXVhbHMnLCAhdmFsMSB8fCAhdmFsMiB8fCB2YWwxID09PSB2YWwyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4qIEBleGFtcGxlIDxkaXYgYWNtZS1zaGFyZWQtc3Bpbm5lcj48L2Rpdj5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3Byb2ZpbGVEaXJlY3RpdmUnLCBwcm9maWxlRGlyZWN0aXZlKTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBwcm9maWxlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5cclxuXHJcbnByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAndXNlclNlcnZpY2UnLCAndHJhY2tTZXJ2aWNlJywgJ21hcmtlclBhcnNlciddO1xyXG5cclxuZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgdXNlclNlcnZpY2UsdHJhY2tTZXJ2aWNlLG1hcmtlclBhcnNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5yZWdpc3RlcicsIFsncGFzc3dvcmRWZXJpZnknXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyZWN0aXZlJywgcmVnaXN0ZXJEaXJlY3RpdmUpO1xyXG4gICBcclxuZnVuY3Rpb24gcmVnaXN0ZXJEaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy91c2VyL3JlZ2lzdGVyL3JlZ2lzdGVyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiByZWdpc3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhZWtsZScsIFsnYXBwLm1hcCcsICdhcHAudHJhY2tTZXJ2aWNlJywgJ25nRmlsZVVwbG9hZCcsICdhbmd1bGFyLWxhZGRhJ10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3JvdGFFa2xlQ29udHJvbGxlcicsIHJvdGFFa2xlQ29udHJvbGxlcilcclxuXHJcblxyXG4gICAgcm90YUVrbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAncmV2ZXJzZUdlb2NvZGUnLCAndHJhY2tTZXJ2aWNlJywgJyRzdGF0ZScsICdVcGxvYWQnXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3RhRWtsZUNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCBtYXBDb25maWdTZXJ2aWNlLCByZXZlcnNlR2VvY29kZSwgdHJhY2tTZXJ2aWNlLCAkc3RhdGUsIFVwbG9hZCkge1xyXG4gICAgICAgIC8vICRvY0xhenlMb2FkLmxvYWQoJy4uLy4uL3NlcnZpY2VzL21hcC9tYXAuYXV0b2NvbXBsZXRlLmpzJyk7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUpO1xyXG4gICAgICAgIC8vIHZtLnN0YXRlID0gJHN0YXRlO1xyXG4gICAgICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXIoKTtcclxuICAgICAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG4gICAgICAgIHZtLmxvY2F0aW9uO1xyXG5cclxuICAgICAgICAvL1RyYWNrIHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkcm9vdFNjb3BlLnVzZXIpIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHJvb3RTY29wZS51c2VyLl9pZCkpIHtcclxuICAgICAgICAgICAgLy8gJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgICAgICAvLyBicmVhazsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdm0ub3duZWRCeSA9ICRyb290U2NvcGUudXNlci5faWQ7XHJcblxyXG4gICAgICAgIHZtLmltZ19zcmMgPSBcInNyY1wiO1xyXG4gICAgICAgIHZtLnN1bW1hcnk7XHJcbiAgICAgICAgdm0uYWx0aXR1ZGU7XHJcbiAgICAgICAgdm0uZGlzdGFuY2U7XHJcbiAgICAgICAgdm0ubmFtZSA9ICcnO1xyXG4gICAgICAgIHZtLmNvb3JkaW5hdGVzID0gW107XHJcbiAgICAgICAgdm0udXBsb2FkR1BYID0gdXBsb2FkR1BYO1xyXG4gICAgICAgIHZtLnVwbG9hZFBpYyA9IHVwbG9hZFBpYztcclxuICAgICAgICB2bS5jYW1wU2VsZWN0ZWQgPSBjYW1wU2VsZWN0ZWQ7XHJcbiAgICAgICAgdm0uaXNDYW1wID0gbnVsbDtcclxuICAgICAgICB2bS5zZWFzb25zID0gW107XHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbkxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZtLnRvZ2dsZVN0YXRlID0gdHJ1ZTtcclxuICAgICAgICB2bS50b2dnbGVQYW5lbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLm5leHQtc3RlcC1wYW5lbCAucGFuZWwtYm9keScpLnRvZ2dsZSgnaGlkZScpO1xyXG4gICAgICAgICAgICAvLyBhbGVydCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLmFkZFRyYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0cmFja1NlcnZpY2UuYWRkVHJhY2sodm0pLnRoZW4oZnVuY3Rpb24gKGFkZFRyYWNrUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncm90YWxhcicpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoYWRkVHJhY2tFcnJvcikgeyBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZFBpYyhmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3Bob3Rvcy8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWdfc3JjID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRkdHJhY2suZ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRHUFgoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9ncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncHggPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5maW5pc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVsnZmluYWxseSddKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbXBTZWxlY3RlZChjYW1wKSB7XHJcbiAgICAgICAgICAgIHZtLmlzQ2FtcCA9IGNhbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5zZWFzb25zID0gW3tcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdpbGtiYWhhcicsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuLi8uLi9pbWcvc2Vhc29uL2ZvcmVzdC5zdmcnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IDEwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdZYXonLFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi4vLi4vaW1nL3NlYXNvbi9iZWFjaC5zdmcnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IDIwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnU29uYmFoYXInLFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi4vLi4vaW1nL3NlYXNvbi9maWVsZHMuc3ZnJyxcclxuICAgICAgICAgICAgICAgIGlkOiAzMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0vEscWfJyxcclxuICAgICAgICAgICAgICAgIGltZzogJy4uLy4uL2ltZy9zZWFzb24vbW91bnRhaW5zLnN2ZycsXHJcbiAgICAgICAgICAgICAgICBpZDogNDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdOyBcclxuXHJcbiAgICAgICAgdm0uc2VsZWN0ZWRTZWFzb25zID0gW107XHJcbiAgICAgICAgdm0uYWRkU2Vhc29uID0gYWRkU2Vhc29uO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRTZWFzb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSB2bS5zZWxlY3RlZFNlYXNvbnMuaW5kZXhPZih2bS5zZWFzb25zW2luZGV4XS5pZCk7XHJcbiAgICAgICAgICAgIGlmIChpID4gLTEpXHJcbiAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZFNlYXNvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZFNlYXNvbnMucHVzaCh2bS5zZWFzb25zW2luZGV4XS5pZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnNlbGVjdGVkU2Vhc29ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdm0uY2hlY2tBdmFpbGFiaWxpdHkgPSBjaGVja0F2YWlsYWJpbGl0eTtcclxuICAgICAgICBmdW5jdGlvbiBjaGVja0F2YWlsYWJpbGl0eShhcnIsIHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyLnNvbWUoZnVuY3Rpb24gKGFyclZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gYXJyVmFsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHtcclxuICAgICAgICAgICAgbWFya2Vyczoge1xyXG4gICAgICAgICAgICAgICAgbWFpbk1hcmtlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdDogdm0uY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG5nOiB2bS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJhxZ9rYSBiaXIgbm9rdGF5YSB0xLFrbGF5YXJhayBrYXlkxLFyLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS4kb24oJ2N1cnJlbnRTdGVwJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnRTdGVwID0gZGF0YTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKFwibGVhZmxldERpcmVjdGl2ZU1hcC5jbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGxlYWZFdmVudCA9IGFyZ3MubGVhZmxldEV2ZW50O1xyXG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZS5nZW9jb2RlTGF0bG5nKGxlYWZFdmVudC5sYXRsbmcubGF0LCBsZWFmRXZlbnQubGF0bG5nLmxuZykudGhlbihmdW5jdGlvbiAoZ2VvY29kZVN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2NhdGlvbiA9IGdlb2NvZGVTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcmtlcnMubWFpbk1hcmtlci5sYXQgPSBsZWFmRXZlbnQubGF0bG5nLmxhdDtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcmtlcnMubWFpbk1hcmtlci5sbmcgPSBsZWFmRXZlbnQubGF0bG5nLmxuZztcclxuICAgICAgICAgICAgdm0uY29vcmRpbmF0ZXMgPSBbbGVhZkV2ZW50LmxhdGxuZy5sbmcsIGxlYWZFdmVudC5sYXRsbmcubGF0XTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gdG9TdGF0ZS5uYW1lLnNwbGl0KFwiLlwiKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBzdGVwO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsb2NhdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNhbXBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFzb25cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtZXRhXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSA0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW1hZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJncHhcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2N1cnJlbnRTdGVwJywgc3RlcCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGVwKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIgIiwiYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgIHJldHVybiBhbmd1bGFyLmlzVW5kZWZpbmVkKHZhbCkgfHwgdmFsID09PSBudWxsXHJcbn1cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJvdGFsYXInLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JvdGFsYXInLCByb3RhbGFyKVxyXG5cclxuZnVuY3Rpb24gcm90YWxhcigpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWxhci9yb3RhbGFyLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICBjb250cm9sbGVyOiBSb3RhbGFyQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcblxyXG5Sb3RhbGFyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsXHJcbiAgICAnbWFya2VyUGFyc2VyJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldE1hcEV2ZW50cycsICdsZWFmbGV0RGF0YScsICckbG9jYXRpb24nLCAnJHdpbmRvdydcclxuXTtcclxuXHJcbmZ1bmN0aW9uIFJvdGFsYXJDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSxcclxuICAgIG1hcmtlclBhcnNlciwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldE1hcEV2ZW50cywgbGVhZmxldERhdGEsICRsb2NhdGlvbiwgJHdpbmRvdykge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrcyA9IHt9O1xyXG4gICAgdm0uZ2V0VHJhY2sgPSBnZXRUcmFjaztcclxuICAgIHZtLm1hcEF1dG9SZWZyZXNoID0gdHJ1ZTtcclxuICAgIHZtLm9wZW5NYXAgPSBvcGVuTWFwO1xyXG4gICAgdm0uY2hhbmdlSW1nID0gY2hhbmdlSW1nO1xyXG4gICAgdm0ucGFyYW1zID0ge307XHJcblxyXG5cclxuXHJcbiAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkc3RhdGVQYXJhbXMubGF0TkUpIHx8XHJcbiAgICAgICAgYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkc3RhdGVQYXJhbXMubG5nTkUpIHx8XHJcbiAgICAgICAgYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkc3RhdGVQYXJhbXMubGF0U1cpIHx8XHJcbiAgICAgICAgYW5ndWxhci5pc1VuZGVmaW5lZE9yTnVsbCgkc3RhdGVQYXJhbXMubG5nU1cpXHJcbiAgICApIHtcclxuICAgICAgICAvLyB0w7xya2l5ZXllIHNhYml0bGVtZWsgacOnaW5cclxuICAgICAgICB2bS5wYXJhbXMubGF0TkUgPSA0NC4yOTI7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gNDEuMjY0O1xyXG4gICAgICAgIHZtLnBhcmFtcy5sYXRTVyA9IDMyLjgwNTtcclxuICAgICAgICB2bS5wYXJhbXMubG5nU1cgPSAyNy43NzM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZtLnBhcmFtcyA9IHtcclxuICAgICAgICAgICAgbGF0TkU6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxhdE5FKSxcclxuICAgICAgICAgICAgbG5nTkU6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxuZ05FKSxcclxuICAgICAgICAgICAgbGF0U1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxhdFNXKSxcclxuICAgICAgICAgICAgbG5nU1c6IHBhcnNlRmxvYXQoJHN0YXRlUGFyYW1zLmxuZ1NXKSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG4gICAgJHJvb3RTY29wZS5zZWFyY2hMb2NhdGlvbiA9ICRzdGF0ZVBhcmFtcy50ZXJtO1xyXG5cclxuICAgIC8vIGlmKHdpbmRvdy5tb2JpbGVjaGVjayAmJiB2bS5tYXBBY3RpdmUpe1xyXG5cclxuICAgIC8vIH1cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIGlmICh2bS5wYXJhbXMubGF0TkUgJiYgdm0ucGFyYW1zLmxuZ05FICYmIHZtLnBhcmFtcy5sYXRTVyAmJiB2bS5wYXJhbXMubG5nU1cpIHtcclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFt2bS5wYXJhbXMubGF0TkUsIHZtLnBhcmFtcy5sbmdORV0sXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRTVywgdm0ucGFyYW1zLmxuZ1NXXSxcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuc2V0Wm9vbShtYXAuZ2V0Wm9vbSgpIC0gMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmdldFRyYWNrKCkudGhlbihmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VHJhY2soKSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYWNrU2VydmljZS5nZXRUcmFjayh2bS5wYXJhbXMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbmQpIHtcclxuICAgICAgICAgICAgdm0udHJhY2tzLmRhdGEgPSByZXNwb25kLmRhdGE7XHJcbiAgICAgICAgICAgIGlmICh2bS50cmFja3MuZGF0YSA9PSBbXSkge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXJrZXJQYXJzZXIuanNvblRvTWFya2VyQXJyYXkodm0udHJhY2tzLmRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXJrZXJzID0gbWFya2VyUGFyc2VyLnRvT2JqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBMLmdlb0pzb24odm0udHJhY2tzLmRhdGEpLmdldEJvdW5kcygpO1xyXG4gICAgICAgICAgICAgICAgLy8gbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXJrZXJzRW1wdHkgPSBhbmd1bGFyLmVxdWFscyhPYmplY3Qua2V5cyh2bS5tYXJrZXJzKS5sZW5ndGgsIDApO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllcigpO1xyXG4gICAgdm0uY2VudGVyID0gbWFwQ29uZmlnU2VydmljZS5nZXRDZW50ZXIoKTtcclxuXHJcbiAgICB2bS5jaGFuZ2VJY29uID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIC8vIHZhciBzd2FwID0gbWFya2VyLmljb247XHJcbiAgICAgICAgLy8gbWFya2VyLmljb24gPSBtYXJrZXIuaWNvbl9zd2FwO1xyXG4gICAgICAgIC8vIG1hcmtlci5pY29uX3N3YXAgPSBzd2FwO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkbG9jYXRpb24uc2VhcmNoKCkubGF0TkUgPSAyMCk7XHJcblxyXG4gICAgICAgIC8vIGlmIChtYXJrZXIuZm9jdXMpXHJcbiAgICAgICAgLy8gICAgIG1hcmtlci5mb2N1cyA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzUxMkRBOCcsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnJlbW92ZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgbWFya2VyLmljb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyNCN0E0RTMnLFxyXG4gICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS56b29tTWFya2VyID0gZnVuY3Rpb24gKG1hcmtlcikge1xyXG4gICAgICAgIHZhciBsYXRMbmdzID0gW1xyXG4gICAgICAgICAgICBbbWFya2VyLmxhdCwgbWFya2VyLmxuZ11cclxuICAgICAgICBdO1xyXG4gICAgICAgIHZhciBtYXJrZXJCb3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhsYXRMbmdzKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhtYXJrZXJCb3VuZHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLm1hcEV2ZW50cyA9IGxlYWZsZXRNYXBFdmVudHMuZ2V0QXZhaWxhYmxlTWFwRXZlbnRzKCk7XHJcblxyXG5cclxuICAgIC8vbG9nIGV2ZW50cyBmb3IgbWFya2VyIG9iamVjdHNcclxuICAgIGZvciAodmFyIGsgaW4gdm0ubWFwRXZlbnRzKSB7XHJcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKHZtLm1hcEV2ZW50cyk7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLicgKyB2bS5tYXBFdmVudHNba107XHJcbiAgICAgICAgJHNjb3BlLiRvbihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQubmFtZSA9PSAnbGVhZmxldERpcmVjdGl2ZU1hcmtlci5tb3VzZW92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5jaGFuZ2VJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3V0Jykge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXS5mb2N1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLmNsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgLy8gIHZtLnJlbW92ZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gIHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdmFyIG1hcEV2ZW50ID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuZHJhZ2VuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudCwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgdXBkYXRlTWFwKGFyZ3MpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIG1hcEV2ZW50MiA9ICdsZWFmbGV0RGlyZWN0aXZlTWFwLnpvb21lbmQnO1xyXG5cclxuICAgICRzY29wZS4kb24obWFwRXZlbnQyLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICB1cGRhdGVNYXAoYXJncyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVNYXAoYXJncykge1xyXG4gICAgICAgIGlmICh2bS5tYXBBdXRvUmVmcmVzaCkge1xyXG4gICAgICAgICAgICBpZiAodm0ubWFya2VycyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdDtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sbmdORSA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZztcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sYXRTVyA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdDtcclxuICAgICAgICAgICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxuZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCgnLmRhdGEtdml6Jykud2lkdGgoKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgICAgICdsYXRORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG5nTkUnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdFNXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdTVyc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxuZ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2bS50b2dnbGVUaXRsZSA9ICcgSGFyaXRhJztcclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuTWFwKCkge1xyXG4gICAgICAgIHZtLm1hcEFjdGl2ZSA9ICF2bS5tYXBBY3RpdmU7XHJcbiAgICAgICAgJCgnLmRhdGEtdml6JykudG9nZ2xlQ2xhc3MoJ21hcC1vcGVuJyk7XHJcbiAgICAgICAgJCgnLm1hcC1hdXRvLXJlZnJlc2gnKS50b2dnbGVDbGFzcygncmVmcmVzaC1vcGVuJyk7XHJcbiAgICAgICAgKHZtLnRvZ2dsZVRpdGxlID09ICcgSGFyaXRhJyA/IHZtLnRvZ2dsZVRpdGxlID0gJyBMaXN0ZScgOiB2bS50b2dnbGVUaXRsZSA9ICcgSGFyaXRhJylcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJCgnLmRhdGEtdml6Jykud2lkdGgoKSk7XHJcbiAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VJbWcoKSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudCgnLm5vdC1mb3VuZC1pbWcnKSwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XHJcbiAgICAgICAgICAgIHZhbC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRlJyk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG5cclxufSIsIi8vICAgKGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gICAgICAgICBhbmd1bGFyXHJcbi8vICAgICAgICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhbGFyaW0nLCBbXSlcclxuLy8gICAgICAgICAgICAgLmRpcmVjdGl2ZSgncm90YWxhcmltJywgcm90YWxhcmltKVxyXG5cclxuLy8gICAgICAgICBmdW5jdGlvbiByb3RhbGFyRGV0YWlsKCkge1xyXG4vLyAgICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4vLyAgICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuLy8gICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFsYXJpbS9yb3RhbGFyaW0uaHRtbCcsXHJcbi8vICAgICAgICAgICAgICAgICBzY29wZToge30sXHJcbi8vICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBSb3RhbGFyaW1Db250cm9sbGVyLFxyXG4vLyAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4vLyAgICAgICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4vLyAgICAgICAgICAgICB9O1xyXG5cclxuLy8gICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTsgXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICBSb3RhbGFyaW1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnLCAnd2VhdGhlckFQSScsICduZ0RpYWxvZyddO1xyXG5cclxuLy8gICAgICAgICBmdW5jdGlvbiBSb3RhbGFyaW1Db250cm9sbGVyKCl7XHJcbiAgICAgICAgICAgICBcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgIH0pKCk7IiwiYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnJvdGFsYXJEZXRhaWwnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3JvdGFsYXJEZXRhaWwnLCByb3RhbGFyRGV0YWlsKVxyXG5cclxuZnVuY3Rpb24gcm90YWxhckRldGFpbCgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWxhci5kZXRhaWwvcm90YWxhci5kZXRhaWwuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJEZXRhaWxDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7IFxyXG59XHJcblxyXG5Sb3RhbGFyRGV0YWlsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ3RyYWNrU2VydmljZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ2xlYWZsZXREYXRhJywgJ3dlYXRoZXJBUEknLCAnbmdEaWFsb2cnXTtcclxuXHJcbmZ1bmN0aW9uIFJvdGFsYXJEZXRhaWxDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCB0cmFja1NlcnZpY2UsIG1hcENvbmZpZ1NlcnZpY2UsIGxlYWZsZXREYXRhLCB3ZWF0aGVyQVBJLCBuZ0RpYWxvZykge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnRyYWNrRGV0YWlsID0ge307XHJcbiAgICB2bS5jZW50ZXIgPSB7fTtcclxuICAgIHZtLmxheWVycyA9IG1hcENvbmZpZ1NlcnZpY2UuZ2V0TGF5ZXJGb3JEZXRhaWwoKTtcclxuICAgIHZtLmNvbnRyb2xzID0ge1xyXG4gICAgICAgIGZ1bGxzY3JlZW46IHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0J1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2bS51cGRhdGVUcmFjayA9IHVwZGF0ZVRyYWNrO1xyXG4gICAgdm0uZGVsZXRlVHJhY2sgPSBkZWxldGVUcmFjaztcclxuICAgIHZtLmRlbGV0ZVRyYWNrT0sgPSBkZWxldGVUcmFja09LO1xyXG4gICAgdm0udXBkYXRlVHJhY2sgPSB1cGRhdGVUcmFjaztcclxuICAgIHZtLnVwZGF0ZVRyYWNrT0sgPSB1cGRhdGVUcmFja09LO1xyXG4gXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5nZXRUcmFja0RldGFpbCgkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbCA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmMgPSB2bS50cmFja0RldGFpbC5wcm9wZXJ0aWVzLmltZ19zcmM7XHJcbiAgICAgICAgICAgIHZtLmNlbnRlciA9IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTJcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0uZ3B4RGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgd2VhdGhlckFQSS5kYXJrU2t5V2VhdGhlcih2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdm0ud2VhdGhlciA9IHJlcztcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjFcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMuYWRkKFwiaWNvbjJcIiwgcmVzLmN1cnJlbnRseS5pY29uKTtcclxuICAgICAgICAgICAgICAgIHNreWNvbnMucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnNEYWlseSA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ2JsYWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29uc0RhaWx5V2hpdGUgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLndlYXRoZXIuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0ga2V5ICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrID0ga2V5ICsgMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcyA9IFwiaWNvblwiICsgcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtrID0gXCJpY29uXCIgKyBrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5LmFkZChzcywgdmFsdWUuaWNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2t5Y29uc0RhaWx5V2hpdGUuYWRkKGtrLCB2YWx1ZS5pY29uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHkucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHlXaGl0ZS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5tb2JpbGVjaGVjaygpKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmRyYWdnaW5nLmRpc2FibGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuYWRkQ29udHJvbChuZXcgTC5Db250cm9sLkZ1bGxzY3JlZW4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdweCA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuZ3B4OyAvLyBVUkwgdG8geW91ciBHUFggZmlsZSBvciB0aGUgR1BYIGl0c2VsZlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBuZXcgTC5HUFgoZ3B4LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhc2hBcnJheTogJzEwLDEwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiAnMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjknXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJfb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cHRJY29uVXJsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyc6ICdpbWcvaWNvbi1nby5zdmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0dlb2NhY2hlIEZvdW5kJzogJ2ltZy9ncHgvZ2VvY2FjaGUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQYXJrJzogJ2ltZy9ncHgvdHJlZS5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SWNvblVybDogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZEljb25Vcmw6ICdpbWcvaWNvbi1zdG9wLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1VybDogJ2ltZy9waW4tc2hhZG93LnBuZydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5vbignbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmRpc3RhbmNlID0gZS50YXJnZXQuZ2V0X2Rpc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNaW4gPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21pbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZWxlTWF4ID0gZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9tYXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhc2V0MDogZS50YXJnZXQuZ2V0X2VsZXZhdGlvbl9kYXRhKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoZS50YXJnZXQuZ2V0Qm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmdldEJvdW5kcygpKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdCb3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9ub3J0aEVhc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sYXQgKyAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nICsgMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zb3V0aFdlc3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQgLSAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGUudGFyZ2V0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nIC0gMC4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcobmV3Qm91bmRzLl9ub3J0aEVhc3QubGF0LCBuZXdCb3VuZHMuX25vcnRoRWFzdC5sbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX3NvdXRoV2VzdC5sYXQsIG5ld0JvdW5kcy5fc291dGhXZXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKHNvdXRoV2VzdCwgbm9ydGhFYXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldE1heEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5fbGF5ZXJzTWluWm9vbSA9IDEwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGcuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVRyYWNrT0soKSB7XHJcblxyXG4gICAgICAgIG5nRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3RlbXBsYXRlSWQnLFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0JyxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgc2NvcGU6ICRzY29wZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBcclxuXHJcbiAgICBmdW5jdGlvbiBkZWxldGVUcmFjaygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygxKTtcclxuICAgICAgICB0cmFja1NlcnZpY2UuZGVsZXRlVHJhY2sodm0udHJhY2tEZXRhaWwpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZihyZXMuT3BlcmF0aW9uUmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJyb3RhbGFyU3RhdGVcIik7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlaikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVqJylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUcmFja09LKCkge1xyXG5cclxuICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICd1cGRhdGVUcmFjaycsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2U6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY29wZTogJHNjb3BlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUcmFjayhkZXRhaWwpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLnVwZGF0ZVRyYWNrKGRldGFpbCkudGhlbihmdW5jdGlvbiAoKSB7fSwgZnVuY3Rpb24gKCkge30pO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuICogQGRlc2MgU2VydmljZXMgdGhhdCBjb252ZXJ0cyBnZW9qc29uIGZlYXR1cmVzIHRvIG1hcmtlcnMgZm9yIGhhbmRsaW5nIGxhdGVyXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWFya2VyUGFyc2VyKCRxKSB7XHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBqc29uVG9NYXJrZXJBcnJheToganNvblRvTWFya2VyQXJyYXksXHJcbiAgICAgICAgdG9PYmplY3Q6IHRvT2JqZWN0LFxyXG4gICAgICAgIG1hcmtlckNvbnRlbnQ6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG4gICAgLy8gY29udmVydCBmZWF0dXJlIGdlb2pzb24gdG8gYXJyYXkgb2YgbWFya2Vyc1xyXG4gICAgZnVuY3Rpb24ganNvblRvTWFya2VyQXJyYXkodmFsKSB7XHJcbiAgICAgICAgdmFyIGRlZmVyZWQgPSAkcS5kZWZlcigpOyAvLyBkZWZlcmVkIG9iamVjdCByZXN1bHQgb2YgYXN5bmMgb3BlcmF0aW9uXHJcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBzZXJ2aWNlLm1hcmtlckNvbnRlbnQgPSAnXHQ8ZGl2IGNsYXNzPVwiY2FyZCBjYXJkLW9uLW1hcFwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWltYWdlLWNvbnRhaW5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWltYWdlLWNvdmVyXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGltZyBkYXRhLW5nLXNyYz1cIicgKyB2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjICsgJ1wiIGNsYXNzPVwiaW1nLWZsdWlkXCIgYWx0PVwiXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAnPGE+PGRpdiBjbGFzcz1cIm1hc2sgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0XCI+PC9kaXY+PC9hPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWJsb2NrXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGg0IGNsYXNzPVwiY2FyZC10aXRsZSBmb250LXNpemUtMTZcIj48YSBocmVmPVwicm90YS8nKyB2YWxbaV0uX2lkKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nK3ZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUrJzwvYT48L2g0PicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgIHZhciBtYXJrID0ge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXI6IFwicm90YWxhclwiLFxyXG4gICAgICAgICAgICAgICAgbGF0OiB2YWxbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sXHJcbiAgICAgICAgICAgICAgICBsbmc6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2U6IHZhbFtpXS5wcm9wZXJ0aWVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBzZXJ2aWNlLm1hcmtlckNvbnRlbnQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIGljb246IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUxMkRBOCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBpY29uX3N3YXAgOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb2xvcjogJyM1MTJEQTgnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdmFsW2ldLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFsdGl0dWRlXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmFsdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzdGFuY2VcIjogdmFsW2ldLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW1tYXJ5XCI6IHZhbFtpXS5wcm9wZXJ0aWVzLnN1bW1hcnksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvd25lclwiOiB2YWxbaV0ucHJvcGVydGllcy5vd25lZEJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1nX3NyY1wiOiB2YWxbaV0ucHJvcGVydGllcy5pbWdfc3JjLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG1hcmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3V0cHV0KSB7XHJcbiAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAvLyAgICAgZGVmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xyXG4gICAgICAgIHZhciBydiA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSAhPT0gdW5kZWZpbmVkKSBydltpXSA9IGFycmF5W2ldO1xyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm1hcmtlclBhcnNlcicsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ21hcmtlclBhcnNlcicsIG1hcmtlclBhcnNlcik7IiwiZnVuY3Rpb24gdHJhY2tTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIGVuZHBvaW50ID0gJ2h0dHA6bG9jYWxob3N0OjgwODAvJ1xyXG5cclxuXHR2YXIgc2VydmljZSA9IHtcclxuXHRcdGdldFRyYWNrOiBnZXRUcmFjayxcclxuXHRcdGFkZFRyYWNrOiBhZGRUcmFjayxcclxuXHRcdHVwZGF0ZVRyYWNrOiB1cGRhdGVUcmFjayxcclxuXHRcdGRlbGV0ZVRyYWNrOiBkZWxldGVUcmFjayxcclxuXHRcdGdldFRyYWNrRGV0YWlsOiBnZXRUcmFja0RldGFpbCxcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFjayhwYXJhbXMpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3M/bGF0TkU9JyArIHBhcmFtcy5sYXRORSArICcmbG5nTkU9JyArIHBhcmFtcy5sbmdORSArICcmbGF0U1c9JyArIHBhcmFtcy5sYXRTVyArICcmbG5nU1c9JyArIHBhcmFtcy5sbmdTVyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuXHRcdFx0fSxcclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHJhY2tEZXRhaWwoaWQpIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MvJyArIGlkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRyYWNrKHRyYWNrKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcycsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF0YTogJC5wYXJhbSh7XHJcblx0XHRcdFx0XCJuYW1lXCI6IHRyYWNrLm5hbWUsXHJcblx0XHRcdFx0XCJkaXN0YW5jZVwiOiB0cmFjay5kaXN0YW5jZSwgXHJcblx0XHRcdFx0XCJhbHRpdHVkZVwiOiB0cmFjay5hbHRpdHVkZSxcclxuXHRcdFx0XHRcInN1bW1hcnlcIjogdHJhY2suc3VtbWFyeSxcclxuXHRcdFx0XHRcImltZ19zcmNcIjogdHJhY2suaW1nX3NyYyxcclxuXHRcdFx0XHRcImNvb3JkaW5hdGVzXCI6IHRyYWNrLmNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdFwib3duZWRCeVwiOiB0cmFjay5vd25lZEJ5LFxyXG5cdFx0XHRcdFwiZ3B4XCI6IHRyYWNrLmdweCxcclxuXHRcdFx0XHRcImlzQ2FtcFwiOiB0cmFjay5pc0NhbXAsXHJcblx0XHRcdFx0XCJzZWFzb25zXCI6IHRyYWNrLnNlbGVjdGVkU2Vhc29ucyxcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1cGRhdGVUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnUFVUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nICsgdHJhY2suX2lkLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcblx0XHRcdH0sXHJcblx0XHRcdGRhdGE6ICQucGFyYW0oe1xyXG5cdFx0XHRcdFwibmFtZVwiOiB0cmFjay5wcm9wZXJ0aWVzLm5hbWUsXHJcblx0XHRcdFx0XCJkaXN0YW5jZVwiOiB0cmFjay5wcm9wZXJ0aWVzLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFwiYWx0aXR1ZGVcIjogdHJhY2sucHJvcGVydGllcy5hbHRpdHVkZSxcclxuXHRcdFx0XHRcInN1bW1hcnlcIjogdHJhY2sucHJvcGVydGllcy5zdW1tYXJ5LFxyXG5cdFx0XHRcdFwiaW1nX3NyY1wiOiB0cmFjay5wcm9wZXJ0aWVzLmltZ19zcmMsXHJcblx0XHRcdFx0XCJjb29yZGluYXRlc1wiOiB0cmFjay5nZW9tZXRyeS5jb29yZGluYXRlcyxcclxuXHRcdFx0XHRcImdweFwiOiB0cmFjay5wcm9wZXJ0aWVzLmdweCxcclxuXHRcdFx0XHRcImlzQ2FtcFwiOiB0cmFjay5wcm9wZXJ0aWVzLmlzQ2FtcCxcclxuXHRcdFx0XHRcInNlYXNvbnNcIjogdHJhY2sucHJvcGVydGllcy5zZWxlY3RlZFNlYXNvbnMsXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGVsZXRlVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ0RFTEVURScsXHJcblx0XHRcdHVybDogJ2FwaS90cmFja3MvJyArIHRyYWNrLl9pZCxcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcbn1cclxuYW5ndWxhclxyXG5cdC5tb2R1bGUoJ2FwcC50cmFja1NlcnZpY2UnLCBbXSlcclxuXHQuZmFjdG9yeSgndHJhY2tTZXJ2aWNlJywgdHJhY2tTZXJ2aWNlKTsiLCJmdW5jdGlvbiB1c2VyU2VydmljZSgkaHR0cCkge1xyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VXNlcjogZ2V0VXNlcixcclxuXHR9O1xyXG5cdHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XHJcbiAgICBcdHJldHVybiAkaHR0cCh7XHJcbiAgICBcdFx0bWV0aG9kOiAnR0VUJyxcclxuICAgIFx0XHR1cmw6ICdhcGkvcHJvZmlsZSdcclxuICAgIFx0fSlcclxuICAgIH07IFxyXG59IFxyXG5hbmd1bGFyXHJcbi5tb2R1bGUoJ2FwcC51c2VyU2VydmljZScsIFtdKVxyXG4uZmFjdG9yeSgndXNlclNlcnZpY2UnLCB1c2VyU2VydmljZSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgc2VydmljZUlkID0gJ3dlYXRoZXJBUEknO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAud2VhdGhlcicsIFtdKVxyXG4gICAgICAgIC5mYWN0b3J5KHNlcnZpY2VJZCwgWyckcScsICckaHR0cCcsIHdlYXRoZXJBUEldKTtcclxuXHJcbiAgICBmdW5jdGlvbiB3ZWF0aGVyQVBJKCRxLCAkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICB3ZWF0aGVyOiB3ZWF0aGVyLFxyXG4gICAgICAgICAgICBmb3JlY2FzdDogZm9yZWNhc3QsXHJcbiAgICAgICAgICAgIGRhcmtTa3lXZWF0aGVyOiBkYXJrU2t5V2VhdGhlcixcclxuICAgICAgICAgICAgYXBwaWQ6ICdmYTJkNTkzYWE1OGU5MGZkZTMyODQyNmU2NGE2NGUzOCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB3ZWF0aGVyKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwKHtcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiAnJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0nICsgbGF0ICsgJyZsb249JyArIGxuZyArICcmYXBwaWQ9JyArIHNlcnZpY2UuYXBwaWQgKyAnJnVuaXRzPW1ldHJpYyZsYW5nPXRyJ1xyXG4gICAgICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5jb2QgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0SG91cnMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0TWludXRlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBjdXJyZW50IGhvdXIgdXNpbmcgb2Zmc2V0IGZyb20gVVRDLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZXRpbWUgPSBuZXcgRGF0ZSgocmVzLmRhdGEuZHQgKiAxMDAwKSArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3VucmlzZSA9IG5ldyBEYXRlKHJlcy5kYXRhLnN5cy5zdW5yaXNlICogMTAwMCArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3Vuc2V0ID0gbmV3IERhdGUocmVzLmRhdGEuc3lzLnN1bnNldCAqIDEwMDAgKyAob2Zmc2V0SG91cnMgKiAzNjAwMDAwKSArIChvZmZzZXRNaW51dGVzICogNjAwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFDdXJyZW50ID0ge31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuZGF0ZXRpbWUgPSBkYXRldGltZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPSBkYXRhQ3VycmVudC5kYXRldGltZS5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5zdW5yaXNlSG91ciA9IHN1bnJpc2UuZ2V0VVRDSG91cnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQuc3Vuc2V0SG91ciA9IHN1bnNldC5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhvdXIgYmV0d2VlbiBzdW5zZXQgYW5kIHN1bnJpc2UgYmVpbmcgbmlnaHQgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDdXJyZW50LmN1cnJlbnRIb3VyID49IGRhdGFDdXJyZW50LnN1bnNldEhvdXIgfHwgZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPD0gZGF0YUN1cnJlbnQuc3VucmlzZUhvdXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgd2VhdGhlciBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyRGVzY3JpcHRpb24gPSByZXMuZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmVzLmRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbi5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhbmdlIHdlYXRoZXIgaWNvbiBjbGFzcyBhY2NvcmRpbmcgdG8gd2VhdGhlciBjb2RlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC10aHVuZGVyc3Rvcm1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXN0b3JtLXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXJhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXNub3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXJhaW4tbWl4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzQxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWZvZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1jbGVhclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtY2xvdWR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1oYWlsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1jbG91ZHktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlcy5kYXRhLndlYXRoZXJbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktdGh1bmRlcnN0b3JtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjMyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zdG9ybS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzEzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zaG93ZXJzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTIyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTMxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1yYWluXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zbm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjE2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjIwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1yYWluLW1peFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc0MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktZm9nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1zdW5ueVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDgwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kYXktY2xvdWR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1oYWlsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1jbG91ZHktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc1MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzYxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1kdXN0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDcxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXNtb2tlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc3MTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU3OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1OTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc3Ryb25nLXdpbmRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzgxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS10b3JuYWRvXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTYxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1odXJyaWNhbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc25vd2ZsYWtlLWNvbGRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktaG90XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXdpbmR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudDogZGF0YUN1cnJlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXMuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlamVjdC5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IDJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcmVjYXN0KGxhdCwgbG5nKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGFya1NreVdlYXRoZXIobGF0LCBsbmcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS93ZWF0aGVyLycgKyBsYXQgKyAnLycgKyBsbmcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5PcGVyYXRpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmN1cnJlbnRseS50aW1lID0gbmV3IERhdGUoKGRhdGEuY3VycmVudGx5LnRpbWUgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLmRhaWx5LmRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhaWx5LmRhdGFba2V5XS50aW1lID0gIG5ldyBEYXRlKCh2YWx1ZS50aW1lICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlamVjdC5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclR5cGU6IDJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiZnVuY3Rpb24gbWFwQ29uZmlnU2VydmljZSgpIHtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICBnZXRMYXllcjogZ2V0TGF5ZXIsXHJcbiAgICAgICAgZ2V0Q2VudGVyOiBnZXRDZW50ZXIsXHJcbiAgICAgICAgZ2V0TGF5ZXJGb3JEZXRhaWw6IGdldExheWVyRm9yRGV0YWlsLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldExheWVyKCkge1xyXG4gICAgICAgIHZhciBsYXllcnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VsYXllcnM6IHtcclxuICAgICAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIE1hcGJveF9TYXRlbGxpdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVXlkdScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L3NhdGVsbGl0ZS1zdHJlZXRzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIE1hcGJveF9PdXRkb29yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9vdXRkb29ycy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfTGFuc2NhcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnxLB6b2hpcHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9sYW5kc2NhcGUve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgWWFuZGV4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1lhbmRleCBZb2wnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd5YW5kZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICBsYXllck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJUeXBlOiAnbWFwJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb3ZlcmxheXM6IHtcclxuICAgICAgICAgICAgICAgIHJvdGFsYXI6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ3JvdXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdSb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxheWVycztcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q2VudGVyKCkge1xyXG4gICAgICAgIHZhciBjZW50ZXIgPSB7XHJcbiAgICAgICAgICAgIGxhdDogMzkuOTAzMjkxOCxcclxuICAgICAgICAgICAgbG5nOiAzMi42MjIzMzk2LFxyXG4gICAgICAgICAgICB6b29tOiA2XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXJGb3JEZXRhaWwoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9PdXRkb29yczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPdXRkb29yIDInLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly97c30udGlsZS50aHVuZGVyZm9yZXN0LmNvbS9vdXRkb29ycy97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBTdGFtZW5fVGVycmFpbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBcmF6aScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIE1hcGJveF9TYXRlbGxpdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVXlkdScsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L3NhdGVsbGl0ZS1zdHJlZXRzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIE1hcGJveF9PdXRkb29yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9vdXRkb29ycy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWIzSmhZbUY2YjNJaUxDSmhJam9pZEc5TFJIbGlOQ0o5LlNIWWJtZmVuLWp3S1dDWURpT0JVV1EnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IE1hcGJveCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFlhbmRleDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdZYW5kZXggWW9sJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneWFuZGV4JywgXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyVHlwZTogJ21hcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5tYXAnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdtYXBDb25maWdTZXJ2aWNlJywgbWFwQ29uZmlnU2VydmljZSk7IiwiZnVuY3Rpb24gZ2VvY29kZSgkcSkge1xyXG4gIHJldHVybiB7IFxyXG4gICAgZ2VvY29kZUFkZHJlc3M6IGZ1bmN0aW9uKGFkZHJlc3MpIHtcclxuICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XHJcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IGFkZHJlc3MgfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcclxuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgICAgLy8gd2luZG93LmZpbmRMb2NhdGlvbihyZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgnZ2VvY29kZScsIGdlb2NvZGUpOyIsImZ1bmN0aW9uIHJldmVyc2VHZW9jb2RlKCRxLCAkaHR0cCkge1xyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgb2JqLmdlb2NvZGVMYXRsbmcgPSBmdW5jdGlvbiBnZW9jb2RlUG9zaXRpb24obGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHtcclxuICAgICAgICAgICAgbGF0TG5nOiBsYXRsbmdcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlcyAmJiByZXNwb25zZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2VzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuIC5tb2R1bGUoJ2FwcC5tYXAnKVxyXG4gLmZhY3RvcnkoJ3JldmVyc2VHZW9jb2RlJywgcmV2ZXJzZUdlb2NvZGUpOyJdfQ==
