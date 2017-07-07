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
            }, function (addTrackError) {})
        }

        function uploadPic(file) {
            if (file) {
                vm.uploading = true;
                var imageFile;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function (e) {
                    imageFile = e.target.result;
                    file.upload = Upload.upload({
                            url: 'api/photos/',
                            data: {
                                file: imageFile
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
                        })

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYXBwLmpzIiwiYXBwLnJ1bi5qcyIsImNvbnRlbnQvYXBwLmNvbnRlbnQuanMiLCJ1c2VyL2FwcC51c2VyLmpzIiwicm90YS9hcHAucm90YS5qcyIsImhlYWRsaW5lL2hlYWRsaW5lLmpzIiwiZm9vdGVyL2Zvb3Rlci5qcyIsImNhcmQvY2FyZC5kaXJlY3RpdmUuanMiLCJjb25uZWN0L2Nvbm5lY3QuZGlyZWN0aXZlLmpzIiwibG9naW4vbG9naW4uanMiLCJuYXZiYXIvbmF2YmFyLmpzIiwicGFzc3dvcmQtdmVyaWZ5L3Bhc3N3b3JkLXZlcmlmeS5kaXJlY3RpdmUuanMiLCJwcm9maWxlL3Byb2ZpbGUuanMiLCJyZWdpc3Rlci9yZWdpc3Rlci5qcyIsInJvdGFla2xlL3JvdGFla2xlLmpzIiwicm90YWVrbGUubG9jYXRpb24vcm90YWVrbGUubG9jYXRpb24uanMiLCJyb3RhbGFyL3JvdGFsYXIuanMiLCJyb3RhbGFyaW0vcm90YWxhcmltLmRpcmVjdGl2ZS5qcyIsInJvdGFsYXIuZGV0YWlsL3JvdGFsYXIuZGV0YWlsLmpzIiwibWFya2VycGFyc2VyLmpzIiwidHJhY2suanMiLCJ1c2VyLmpzIiwid2VhdGhlckFQSS5qcyIsIm1hcC9tYXAuY29uZmlnLmpzIiwibWFwL21hcC5nZW9jb2RlLmpzIiwibWFwL21hcC5yZXZlcnNlR2VvY29kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFVBQVUsYUFBYSxVQUFVLFFBQVEsYUFBYTtJQUN6RCxJQUFJLFNBQVM7O0lBRWIsT0FBTyxPQUFPLE1BQU0sUUFBUSxLQUFLOzs7O0FBSXJDLE9BQU8sbUJBQW1CLFlBQVk7SUFDbEMsRUFBRSx5QkFBeUIsS0FBSyxZQUFZO1FBQ3hDLElBQUksT0FBTztRQUNYLEVBQUUsTUFBTSxVQUFVO1lBQ2QsUUFBUSxVQUFVLE9BQU8sU0FBUztnQkFDOUIsSUFBSSxjQUFjO2dCQUNsQixFQUFFLFFBQVEsK0hBQStILE9BQU8sVUFBVSxNQUFN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O1FBSzNCLE9BQU87Ozs7OztBQU1mO0tBQ0ssT0FBTyxXQUFXO0tBQ2xCLFFBQVEsb0JBQW9CLGtCQUFrQjs7eUJDdEhuRCxTQUFTLFFBQVEsSUFBSTtFQUNuQixPQUFPO0lBQ0wsZ0JBQWdCLFNBQVMsU0FBUztNQUNoQyxJQUFJLFdBQVcsSUFBSSxPQUFPLEtBQUs7TUFDL0IsSUFBSSxXQUFXLEdBQUc7TUFDbEIsU0FBUyxRQUFRLEVBQUUsV0FBVyxXQUFXLFVBQVUsU0FBUyxRQUFRO1FBQ2xFLElBQUksVUFBVSxPQUFPLEtBQUssZUFBZSxJQUFJO1VBQzNDLE9BQU8sU0FBUyxRQUFRLFFBQVEsR0FBRyxTQUFTOzs7UUFHOUMsT0FBTyxTQUFTOztNQUVsQixPQUFPLFNBQVM7Ozs7O0FBS3RCO0VBQ0UsT0FBTztFQUNQLFFBQVEsV0FBVyxTQUFTOzt5Q0NuQjlCLFNBQVMsZUFBZSxJQUFJLE9BQU87SUFDL0IsSUFBSSxNQUFNO0lBQ1YsSUFBSSxnQkFBZ0IsU0FBUyxnQkFBZ0IsS0FBSyxLQUFLO1FBQ25ELElBQUksV0FBVyxJQUFJLE9BQU8sS0FBSztRQUMvQixJQUFJLFdBQVcsR0FBRztRQUNsQixJQUFJLFNBQVMsSUFBSSxPQUFPLEtBQUssT0FBTyxLQUFLO1FBQ3pDLFNBQVMsUUFBUTtZQUNiLFFBQVE7V0FDVCxTQUFTLFdBQVc7WUFDbkIsSUFBSSxhQUFhLFVBQVUsU0FBUyxHQUFHO2dCQUNuQyxPQUFPLFNBQVMsUUFBUSxVQUFVLEdBQUc7bUJBQ2xDO2dCQUNILE9BQU8sU0FBUyxRQUFROztXQUU3QixVQUFVLEtBQUs7WUFDZCxPQUFPLFNBQVMsUUFBUTs7UUFFNUIsT0FBTyxTQUFTOztJQUVwQixPQUFPOzs7QUFHWDtFQUNFLE9BQU87RUFDUCxRQUFRLGtCQUFrQixnQkFBZ0IiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uIChzZWFyY2gsIHJlcGxhY2VtZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlbWVudCk7XHJcbn07XHJcblxyXG5cclxud2luZG93LmxvYWRBdXRvQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcuZ2VvY29kZS1hdXRvY29tcGxldGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGF0KS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChxdWVyeSwgcHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZWRpY3Rpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICAkLmdldEpTT04oJ2h0dHBzOi8vZ2VvY29kZS1tYXBzLnlhbmRleC5ydS8xLngvP3Jlc3VsdHM9NSZiYm94PTI0LjEyNTk3NywzNC40NTIyMTh+NDUuMTA5ODYzLDQyLjYwMTYyMCZmb3JtYXQ9anNvbiZsYW5nPXRyX1RSJmdlb2NvZGU9JyArIHF1ZXJ5LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QubmFtZSArICcsICcgKyBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24ucmVwbGFjZSgnLCBUw7xya2l5ZScsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb25nbGF0OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuUG9pbnQucG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YS5yZXNwb25zZS5HZW9PYmplY3RDb2xsZWN0aW9uLmZlYXR1cmVNZW1iZXJbaV0uR2VvT2JqZWN0Lm1ldGFEYXRhUHJvcGVydHkuR2VvY29kZXJNZXRhRGF0YS5raW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0X3R5cGU6IGRhdGEucmVzcG9uc2UuR2VvT2JqZWN0Q29sbGVjdGlvbi5mZWF0dXJlTWVtYmVyW2ldLkdlb09iamVjdC5tZXRhRGF0YVByb3BlcnR5Lkdlb2NvZGVyTWV0YURhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYm94OiBkYXRhLnJlc3BvbnNlLkdlb09iamVjdENvbGxlY3Rpb24uZmVhdHVyZU1lbWJlcltpXS5HZW9PYmplY3QuYm91bmRlZEJ5LkVudmVsb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kZXNjcmlwdGlvbi5pbmRleE9mKCdUw7xya2l5ZScpID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWN0aW9ucy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAocHJlZGljdGlvbnMgJiYgcHJlZGljdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXN1bHRzID0gJC5tYXAocHJlZGljdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jdGlvbiAocHJlZGljdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHZhciBkZXN0ID0gcHJlZGljdGlvbi5uYW1lICsgXCIsIFwiICsgcHJlZGljdGlvbi5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0ID0gZGVzdC5yZXBsYWNlKCcsIFTDvHJraXllJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzKHByZWRpY3Rpb25zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlclNlbGVjdDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhdFNXID0gaXRlbS5iYm94Lmxvd2VyQ29ybmVyLnNwbGl0KCcgJylbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbG5nU1cgPSBpdGVtLmJib3gubG93ZXJDb3JuZXIuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBsYXRORSA9IGl0ZW0uYmJveC51cHBlckNvcm5lci5zcGxpdCgnICcpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuZ05FID0gaXRlbS5iYm94LnVwcGVyQ29ybmVyLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9ICcvcm90YWxhci8nICsgaXRlbS5uYW1lICtcclxuICAgICAgICAgICAgICAgICAgICAnP2xhdFNXPScgKyBsYXRTVy50b1N0cmluZygpICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ1NXPScgKyBsbmdTVy50b1N0cmluZygpICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxhdE5FPScgKyBsYXRORS50b1N0cmluZygpICtcclxuICAgICAgICAgICAgICAgICAgICAnJmxuZ05FPScgKyBsbmdORS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9ICc8c3BhbiBjbGFzcz1cIml0ZW0tYWRkcmVzc1wiPicgKyBpdGVtICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDMsXHJcbiAgICAgICAgICAgIGZpdFRvRWxlbWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhhdCkub24oJ3R5cGVhaGVhZDpjaGFuZ2UnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGF0KS52YWwoaXRlbS5maW5kKCdhPnNwYW4uaXRlbS1hZGRyZXNzJykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG53aW5kb3cubW9iaWxlY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY2hlY2sgPSBmYWxzZTtcclxuICAgIChmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsIDQpKSkgY2hlY2sgPSB0cnVlO1xyXG4gICAgfSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XHJcbiAgICByZXR1cm4gY2hlY2s7XHJcbn07XHJcblxyXG53aW5kb3cubG9hZEF1dG9Db21wbGV0ZSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICAgJ2FwcC5uYXZiYXInLFxyXG4gICAgICAnYXBwLmxvZ2luJyxcclxuICAgICAgJ2FwcC5yZWdpc3RlcicsXHJcbiAgICAgICdhcHAuY29ubmVjdCcsXHJcbiAgICAgICdhcHAuY2FyZCcsXHJcbiAgICAgICdhcHAucHJvZmlsZScsXHJcbiAgICAgICdhcHAudXNlclNlcnZpY2UnLFxyXG4gICAgICAnYXBwLnRyYWNrU2VydmljZScsXHJcbiAgICAgICdhcHAubWFya2VyUGFyc2VyJyxcclxuICAgICAgJ2FwcC5tYXAnLFxyXG4gICAgICAnYXBwLmNvbnRlbnQnLFxyXG4gICAgICAnYXBwLnJvdGEnLFxyXG4gICAgICAnb2MubGF6eUxvYWQnLFxyXG4gICAgICAndWkucm91dGVyJyxcclxuICAgICAgJ2xlYWZsZXQtZGlyZWN0aXZlJyxcclxuICAgICAgJ2FwcC53ZWF0aGVyJyxcclxuICAgICAgJ3Bhc3N3b3JkVmVyaWZ5JyxcclxuICAgIF0pXHJcbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJGxvZ1Byb3ZpZGVyJywgJyRvY0xhenlMb2FkUHJvdmlkZXInLCAnJGNvbXBpbGVQcm92aWRlcicsICduZ0RpYWxvZ1Byb3ZpZGVyJyxcclxuICAgICAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJGxvZ1Byb3ZpZGVyLCAkb2NMYXp5TG9hZFByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCBuZ0RpYWxvZ1Byb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgIG5nRGlhbG9nUHJvdmlkZXIuc2V0RGVmYXVsdHMoe1xyXG4gICAgICAgICAgcHJlQ2xvc2VDYWxsYmFjazogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICQoJy5jb250YWluZXInKS5jc3Moe1xyXG4gICAgICAgICAgICAgICdmaWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy13ZWJraXQtZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctbW96LWZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLW8tZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctbXMtZmlsdGVyJzogJ25vbmUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcubmF2YmFyJykuY3NzKHtcclxuICAgICAgICAgICAgICAnZmlsdGVyJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICctd2Via2l0LWZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLW1vei1maWx0ZXInOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJy1vLWZpbHRlcic6ICdub25lJyxcclxuICAgICAgICAgICAgICAnLW1zLWZpbHRlcic6ICdub25lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbk9wZW5DYWxsYmFjazogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICQoJy5jb250YWluZXInKS5jc3Moe1xyXG4gICAgICAgICAgICAgICdmaWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLXdlYmtpdC1maWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLW1vei1maWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLW8tZmlsdGVyJzogJ2JsdXIoNXB4KScsXHJcbiAgICAgICAgICAgICAgJy1tcy1maWx0ZXInOiAnYmx1cig1cHgpJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnLm5hdmJhcicpLmNzcyh7XHJcbiAgICAgICAgICAgICAgJ2ZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctd2Via2l0LWZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctbW96LWZpbHRlcic6ICdibHVyKDVweCknLFxyXG4gICAgICAgICAgICAgICctby1maWx0ZXInOiAnYmx1cig1cHgpJyxcclxuICAgICAgICAgICAgICAnLW1zLWZpbHRlcic6ICdibHVyKDVweCknXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAkb2NMYXp5TG9hZFByb3ZpZGVyLmNvbmZpZyh7XHJcbiAgICAgICAgICBkZWJ1ZzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuICAgICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKGZhbHNlKTtcclxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy8jLycpO1xyXG4gICAgICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XHJcblxyXG4gICAgICAgIHZhciBsb2dpblN0YXRlID0ge1xyXG4gICAgICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgICAgIHVybDogJy9naXJpcycsXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxsb2dpbi1kaXJlY3RpdmU+PC9sb2dpbi1kaXJlY3RpdmU+J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobG9naW5TdGF0ZSk7XHJcblxyXG4gICAgICAgIHZhciByZWdpc3RlclN0YXRlID0ge1xyXG4gICAgICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgICAgIHVybDogJy9rYXlpdCcsXHJcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxyZWdpc3Rlci1kaXJlY3RpdmU+PC9yZWdpc3Rlci1kaXJlY3RpdmU+J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocmVnaXN0ZXJTdGF0ZSk7XHJcblxyXG4gICAgICAgIHZhciBwcm9maWxlU3RhdGUgPSB7XHJcbiAgICAgICAgICBuYW1lOiAncHJvZmlsZScsXHJcbiAgICAgICAgICB1cmw6ICcvcHJvZmlsJyxcclxuICAgICAgICAgIHRlbXBsYXRlOiAnPHByb2ZpbGUtZGlyZWN0aXZlPjwvcHJvZmlsZS1kaXJlY3RpdmU+J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocHJvZmlsZVN0YXRlKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbm5lY3RTdGF0ZSA9IHtcclxuICAgICAgICAgIG5hbWU6ICdjb25uZWN0JyxcclxuICAgICAgICAgIHVybDogJy9lcG9zdGEtYmFnbGEnLFxyXG4gICAgICAgICAgdGVtcGxhdGU6ICc8Y29ubmVjdC1jb21wb25lbnQ+PC9jb25uZWN0LWNvbXBvbmVudD4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShjb25uZWN0U3RhdGUpO1xyXG4gICAgICB9XHJcbiAgICBdKVxyXG5cclxuXHJcblxyXG59KSgpOyIsIiAgKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICBcclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCB1c2VyU2VydmljZSkge1xyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGdldFVzZXIoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgICAgcmV0dXJuIHVzZXJTZXJ2aWNlLmdldFVzZXIoKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25kKSB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uZC5kYXRhLk9wZXJhdGlvblJlc3VsdCkgXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUudXNlciA9IHJlc3BvbmQuZGF0YS51c2VyO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmZsYWdMb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICB9IFxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAge1xyXG4gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb250ZW50JywgWydhcHAuaGVhZGVyJywgJ2FwcC5mb290ZXInLCd1aS5yb3V0ZXInXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7IC8vIHByb3ZpZGVyLWluamVjdG9yXHJcblxyXG4gICAgICAgIC8vICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcnLCAnLyMvJyk7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJ2RlZmF1bHRTdGF0ZScsIFxyXG4gICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvbGFuZGluZy9sYW5kaW5nLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShkZWZhdWx0U3RhdGUpO1xyXG4gICAgfSlcclxuICBcclxufSkoKTsiLCIiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5yb3RhJywgWydhcHAucm90YWxhcicsICdhcHAucm90YWxhckRldGFpbCcsICdhcHAucm90YWVrbGUnLCAndWkucm91dGVyJywnbmdEaWFsb2cnXSlcclxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikgeyAvLyBwcm92aWRlci1pbmplY3RvclxyXG5cclxuICAgICAgICAgICAgdmFyIHJvdGFsYXJTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb3RhbGFyJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhbGFyL3t0ZXJtfT9sYXRTVyZsbmdTVyZsYXRORSZsbmdORScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxuYXZiYXItZGlyZWN0aXZlPjwvbmF2YmFyLWRpcmVjdGl2ZT48cm90YWxhcj48L3JvdGFsYXI+JyxcclxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUocm90YWxhclN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByb3RhbGFyRGV0YWlsU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncm90YWxhckRldGFpbCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcm90YS86aWQnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8bmF2YmFyLWRpcmVjdGl2ZT48L25hdmJhci1kaXJlY3RpdmU+PHJvdGFsYXItZGV0YWlsPjwvcm90YWxhci1kZXRhaWw+J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3RhbGFyRGV0YWlsU3RhdGUpO1xyXG4gXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yb3RhZWtsZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS9yb3RhZWtsZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdyb3RhRWtsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncm90YUVrbGVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShhZGRUcmFja1N0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZGRUcmFja0xvY2F0aW9uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2tvbnVtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9yb3RhL3JvdGFla2xlLmxvY2F0aW9uL3JvdGFla2xlLmxvY2F0aW9uLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrTG9jYXRpb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tNZXRhU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2subWV0YScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmlsZ2knLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUubWV0YS9yb3RhZWtsZS5tZXRhLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tNZXRhU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrQ2FtcFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmNhbXAnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2thbXAnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWVrbGUua2FtcC9yb3RhZWtsZS5rYW1wLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tDYW1wU3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZFRyYWNrU2Vhc29uU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWRkdHJhY2suc2Vhc29uJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9zZXpvbicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5zZWFzb24vcm90YWVrbGUuc2Vhc29uLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tTZWFzb25TdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tJbWFnZVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZHRyYWNrLmltYWdlJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXNpbWxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5pbWFnZS9yb3RhZWtsZS5pbWFnZS5odG1sJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFkZFRyYWNrSW1hZ2VTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tHUFhTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5ncHgnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2dweCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5ncHgvcm90YWVrbGUuZ3B4Lmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tHUFhTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkVHJhY2tGaW5pc2hTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGR0cmFjay5maW5pc2gnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2theWRldCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhZWtsZS5maW5pc2gvcm90YWVrbGUuZmluaXNoLmh0bWwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWRkVHJhY2tGaW5pc2hTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5oZWFkZXInLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdoZWFkbGluZURpcmVjdGl2ZScsIGhlYWRsaW5lRGlyZWN0aXZlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoZWFkbGluZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvaGVhZGxpbmUvaGVhZGxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogSGVhZGxpbmVDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIEhlYWRsaW5lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJyRpbnRlcnZhbCcsICckcScsJyR3aW5kb3cnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkbGluZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRpbnRlcnZhbCwgJHEsJHdpbmRvdykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmxvYWRBdXRvQ29tcGxldGUoKTtcclxuICAgICAgICB2bS5zZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygncm90YWxhcicsIHtcclxuICAgICAgICAgICAgICAgIHRlcm06IHZtLmVsbWFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjQXV0b2NvbXBsZXRlXCIpLmZvY3VzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKFwiI0F1dG9jb21wbGV0ZVwiKS5vZmZzZXQoKS50b3AgLSA4MFxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB3aW5kb3cuc2Nyb2xsWCA9IDA7XHJcbiAgICAgICAgJHdpbmRvdy5zY3JvbGxUbygwLDApO1xyXG5cclxuXHJcbiAgICAgICAgJGludGVydmFsKGNoYW5nZUJnLCA2NTAwKTtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAxO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VCZygpIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDUpIHtcclxuICAgICAgICAgICAgICAgIC8vcmVzdGFydFxyXG4gICAgICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAvLyB2YXIgaW1nVXJsID0gXCJ1cmwoJy4uLy4uL2ltZy9iZy1cIiArIGkgKyBcIi5qcGcnKVwiO1xyXG4gICAgICAgICAgICB2YXIgaW1nVXJsID0gXCIuLi8uLi9pbWcvYmctXCIgKyBpICsgXCIuanBnXCI7XHJcblxyXG4gICAgICAgICAgICBwcmVsb2FkKGltZ1VybCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCIuaGVhZGxpbmVcIilcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ1cmwoXCIrIGltZ1VybCArXCIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZWxvYWQodXJsKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgIGltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1hZ2UuY29tcGxldGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZvb3RlcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnZm9vdGVyRGlyZWN0aXZlJywgZm9vdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGZvb3RlckRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2NvbnRlbnQvZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG59XHJcbn0pKCk7IFxyXG4gXHJcbiIsIi8qKlxyXG4qIEBkZXNjIGNhcmQgY29tcG9uZW50IFxyXG4qIEBleGFtcGxlIDxjYXJkPjwvY2FyZD5cclxuKi9cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNhcmQnLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2NhcmREaXJlY3RpdmUnLCBjYXJkRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoKSB7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vY2FyZC9jYXJkLmh0bWwnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnPCcsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6ICc8JyxcclxuICAgICAgICAgICAgb3duZXI6JzwnLFxyXG4gICAgICAgICAgICBpbWdTcmM6JzwnLCAgICBcclxuICAgICAgICAgICAgaWQ6ICc8JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IENhcmRDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2FyZENvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzOyBcclxuICAgIC8vIHZtLmltZ1NyYyA9IHZtLmltZ1NyYy5zcGxpdCgnY2xpZW50JylbMV07XHJcbn0gXHJcbiIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb25uZWN0JywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdjb25uZWN0Q29tcG9uZW50JywgY29ubmVjdENvbXBvbmVudCk7XHJcbiAgIFxyXG5mdW5jdGlvbiBjb25uZWN0Q29tcG9uZW50KCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9jb25uZWN0L2Nvbm5lY3QuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGNvbm5lY3RDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbm5lY3RDb250cm9sbGVyKCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxufSIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5sb2dpbicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnbG9naW5EaXJlY3RpdmUnLCBsb2dpbkRpcmVjdGl2ZSk7XHJcbiAgIFxyXG5mdW5jdGlvbiBsb2dpbkRpcmVjdGl2ZSgpIHtcclxuICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3VzZXIvbG9naW4vbG9naW4uaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IEZvb3RlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIvKipcclxuICogQGRlc2Mgc3Bpbm5lciBkaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCBhbnl3aGVyZSBhY3Jvc3MgYXBwcyBhdCBhIGNvbXBhbnkgbmFtZWQgQWNtZVxyXG4gKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiAqL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubmF2YmFyJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCduYXZiYXJEaXJlY3RpdmUnLCBuYXZiYXJEaXJlY3RpdmUpO1xyXG5cclxuZnVuY3Rpb24gbmF2YmFyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9uYXZiYXIvbmF2YmFyLmh0bWwnLFxyXG4gICAgICAgIC8vIHNjb3BlOiB7XHJcbiAgICAgICAgLy8gICAgIG1heDogJz0nXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBjb250cm9sbGVyOiBuYXZiYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIoKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgIHdpbmRvdy5sb2FkQXV0b0NvbXBsZXRlKCk7IFxyXG5cclxuICAgIHZtLm9wZW5OYXYgPSBvcGVuTmF2O1xyXG4gICAgdm0uY2xvc2VOYXYgPSBjbG9zZU5hdjtcclxuXHJcblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuTmF2KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlOYXZcIikuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VOYXYoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU5hdlwiKS5zdHlsZS5oZWlnaHQgID0gXCIwJVwiO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bhc3N3b3JkVmVyaWZ5JywgW10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bhc3N3b3JkVmVyaWZ5JykuZGlyZWN0aXZlKCdlcXVhbHMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJywgLy8gb25seSBhY3RpdmF0ZSBvbiBlbGVtZW50IGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLCAvLyBnZXQgYSBob2xkIG9mIE5nTW9kZWxDb250cm9sbGVyXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmdNb2RlbCkgcmV0dXJuOyAvLyBkbyBub3RoaW5nIGlmIG5vIG5nLW1vZGVsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gd2F0Y2ggb3duIHZhbHVlIGFuZCByZS12YWxpZGF0ZSBvbiBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5uZ01vZGVsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG9ic2VydmUgdGhlIG90aGVyIHZhbHVlIGFuZCByZS12YWxpZGF0ZSBvbiBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdlcXVhbHMnLCBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFsdWVzIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwxID0gbmdNb2RlbC4kdmlld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwyID0gYXR0cnMuZXF1YWxzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgdmFsaWRpdHlcclxuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsLiRzZXRWYWxpZGl0eSgnZXF1YWxzJywgIXZhbDEgfHwgIXZhbDIgfHwgdmFsMSA9PT0gdmFsMik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4qIEBkZXNjIHNwaW5uZXIgZGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgYW55d2hlcmUgYWNyb3NzIGFwcHMgYXQgYSBjb21wYW55IG5hbWVkIEFjbWVcclxuKiBAZXhhbXBsZSA8ZGl2IGFjbWUtc2hhcmVkLXNwaW5uZXI+PC9kaXY+XHJcbiovXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdwcm9maWxlRGlyZWN0aXZlJywgcHJvZmlsZURpcmVjdGl2ZSk7XHJcblxyXG5mdW5jdGlvbiBwcm9maWxlRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9wcm9maWxlL3Byb2ZpbGUuaHRtbCcsXHJcbiAgICAgICAgLy8gc2NvcGU6IHtcclxuICAgICAgICAvLyAgICAgbWF4OiAnPSdcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogcHJvZmlsZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG5wcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ3VzZXJTZXJ2aWNlJywgJ3RyYWNrU2VydmljZScsICdtYXJrZXJQYXJzZXInXTtcclxuXHJcbmZ1bmN0aW9uIHByb2ZpbGVDb250cm9sbGVyKCRyb290U2NvcGUsIHVzZXJTZXJ2aWNlLHRyYWNrU2VydmljZSxtYXJrZXJQYXJzZXIpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50cmFja3MgPSB7fTtcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgXHJcbiAgICB9XHJcbn0iLCIvKipcclxuKiBAZGVzYyBzcGlubmVyIGRpcmVjdGl2ZSB0aGF0IGNhbiBiZSB1c2VkIGFueXdoZXJlIGFjcm9zcyBhcHBzIGF0IGEgY29tcGFueSBuYW1lZCBBY21lXHJcbiogQGV4YW1wbGUgPGRpdiBhY21lLXNoYXJlZC1zcGlubmVyPjwvZGl2PlxyXG4qL1xyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucmVnaXN0ZXInLCBbJ3Bhc3N3b3JkVmVyaWZ5J10pXHJcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcmVjdGl2ZScsIHJlZ2lzdGVyRGlyZWN0aXZlKTtcclxuICAgXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyZWN0aXZlKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdXNlci9yZWdpc3Rlci9yZWdpc3Rlci5odG1sJyxcclxuICAgICAgICAvLyBzY29wZToge1xyXG4gICAgICAgIC8vICAgICBtYXg6ICc9J1xyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogcmVnaXN0ZXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbGxlcigpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbn0iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucm90YWVrbGUnLCBbJ2FwcC5tYXAnLCAnYXBwLnRyYWNrU2VydmljZScsICduZ0ZpbGVVcGxvYWQnLCAnYW5ndWxhci1sYWRkYSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdyb3RhRWtsZUNvbnRyb2xsZXInLCByb3RhRWtsZUNvbnRyb2xsZXIpXHJcblxyXG5cclxuICAgIHJvdGFFa2xlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdtYXBDb25maWdTZXJ2aWNlJywgJ3JldmVyc2VHZW9jb2RlJywgJ3RyYWNrU2VydmljZScsICckc3RhdGUnLCAnVXBsb2FkJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YUVrbGVDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgbWFwQ29uZmlnU2VydmljZSwgcmV2ZXJzZUdlb2NvZGUsIHRyYWNrU2VydmljZSwgJHN0YXRlLCBVcGxvYWQpIHtcclxuICAgICAgICAvLyAkb2NMYXp5TG9hZC5sb2FkKCcuLi8uLi9zZXJ2aWNlcy9tYXAvbWFwLmF1dG9jb21wbGV0ZS5qcycpO1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coJHN0YXRlKTtcclxuICAgICAgICAvLyB2bS5zdGF0ZSA9ICRzdGF0ZTtcclxuICAgICAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICAgICAgdm0uY2VudGVyID0gbWFwQ29uZmlnU2VydmljZS5nZXRDZW50ZXIoKTtcclxuICAgICAgICB2bS5sb2NhdGlvbjtcclxuXHJcbiAgICAgICAgLy9UcmFjayBwYXJhbWV0ZXJzXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWRPck51bGwoJHJvb3RTY29wZS51c2VyKSB8fCBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRyb290U2NvcGUudXNlci5faWQpKSB7XHJcbiAgICAgICAgICAgIC8vICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgICAgICAgICAgLy8gYnJlYWs7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHZtLm93bmVkQnkgPSAkcm9vdFNjb3BlLnVzZXIuX2lkO1xyXG5cclxuICAgICAgICB2bS5pbWdfc3JjID0gXCJzcmNcIjtcclxuICAgICAgICB2bS5zdW1tYXJ5O1xyXG4gICAgICAgIHZtLmFsdGl0dWRlO1xyXG4gICAgICAgIHZtLmRpc3RhbmNlO1xyXG4gICAgICAgIHZtLm5hbWUgPSAnJztcclxuICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtdO1xyXG4gICAgICAgIHZtLnVwbG9hZEdQWCA9IHVwbG9hZEdQWDtcclxuICAgICAgICB2bS51cGxvYWRQaWMgPSB1cGxvYWRQaWM7XHJcbiAgICAgICAgdm0uY2FtcFNlbGVjdGVkID0gY2FtcFNlbGVjdGVkO1xyXG4gICAgICAgIHZtLmlzQ2FtcCA9IG51bGw7XHJcbiAgICAgICAgdm0uc2Vhc29ucyA9IFtdO1xyXG5cclxuICAgICAgICAkc2NvcGUubG9naW5Mb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICB2bS50b2dnbGVTdGF0ZSA9IHRydWU7XHJcbiAgICAgICAgdm0udG9nZ2xlUGFuZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5uZXh0LXN0ZXAtcGFuZWwgLnBhbmVsLWJvZHknKS50b2dnbGUoJ2hpZGUnKTtcclxuICAgICAgICAgICAgLy8gYWxlcnQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5hZGRUcmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdHJhY2tTZXJ2aWNlLmFkZFRyYWNrKHZtKS50aGVuKGZ1bmN0aW9uIChhZGRUcmFja1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3JvdGFsYXInKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGFkZFRyYWNrRXJyb3IpIHt9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkUGljKGZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2VGaWxlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlRmlsZSA9IGUudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3Bob3Rvcy8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGltYWdlRmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLk9wZXJhdGlvblJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbWdfc3JjID0gcmVzcC5kYXRhLkRhdGEucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkZHRyYWNrLmdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkgeyAvL2NhdGNoIGVycm9yXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiB1cGxvYWRHUFgoZmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS9ncHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ncHggPSByZXNwLmRhdGEuRGF0YS5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZGR0cmFjay5maW5pc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3ApIHsgLy9jYXRjaCBlcnJvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlbJ2ZpbmFsbHknXShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FtcFNlbGVjdGVkKGNhbXApIHtcclxuICAgICAgICAgICAgdm0uaXNDYW1wID0gY2FtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLnNlYXNvbnMgPSBbe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2lsa2JhaGFyJyxcclxuICAgICAgICAgICAgICAgIGltZzogJy4uLy4uL2ltZy9zZWFzb24vZm9yZXN0LnN2ZycsXHJcbiAgICAgICAgICAgICAgICBpZDogMTBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ1lheicsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuLi8uLi9pbWcvc2Vhc29uL2JlYWNoLnN2ZycsXHJcbiAgICAgICAgICAgICAgICBpZDogMjAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdTb25iYWhhcicsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuLi8uLi9pbWcvc2Vhc29uL2ZpZWxkcy5zdmcnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IDMwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnS8SxxZ8nLFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi4vLi4vaW1nL3NlYXNvbi9tb3VudGFpbnMuc3ZnJyxcclxuICAgICAgICAgICAgICAgIGlkOiA0MCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHZtLnNlbGVjdGVkU2Vhc29ucyA9IFtdO1xyXG4gICAgICAgIHZtLmFkZFNlYXNvbiA9IGFkZFNlYXNvbjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkU2Vhc29uKGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gdm0uc2VsZWN0ZWRTZWFzb25zLmluZGV4T2Yodm0uc2Vhc29uc1tpbmRleF0uaWQpO1xyXG4gICAgICAgICAgICBpZiAoaSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRTZWFzb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRTZWFzb25zLnB1c2godm0uc2Vhc29uc1tpbmRleF0uaWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5zZWxlY3RlZFNlYXNvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLmNoZWNrQXZhaWxhYmlsaXR5ID0gY2hlY2tBdmFpbGFiaWxpdHk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrQXZhaWxhYmlsaXR5KGFyciwgdmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnIuc29tZShmdW5jdGlvbiAoYXJyVmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsID09PSBhcnJWYWw7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwge1xyXG4gICAgICAgICAgICBtYXJrZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYWluTWFya2VyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0OiB2bS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgICAgICAgICBsbmc6IHZtLmNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmHFn2thIGJpciBub2t0YXlhIHTEsWtsYXlhcmFrIGtheWTEsXIuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbignY3VycmVudFN0ZXAnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgdm0uY3VycmVudFN0ZXAgPSBkYXRhO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICRzY29wZS4kb24oXCJsZWFmbGV0RGlyZWN0aXZlTWFwLmNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgbGVhZkV2ZW50ID0gYXJncy5sZWFmbGV0RXZlbnQ7XHJcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlLmdlb2NvZGVMYXRsbmcobGVhZkV2ZW50LmxhdGxuZy5sYXQsIGxlYWZFdmVudC5sYXRsbmcubG5nKS50aGVuKGZ1bmN0aW9uIChnZW9jb2RlU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvY2F0aW9uID0gZ2VvY29kZVN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxhdCA9IGxlYWZFdmVudC5sYXRsbmcubGF0O1xyXG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5tYWluTWFya2VyLmxuZyA9IGxlYWZFdmVudC5sYXRsbmcubG5nO1xyXG4gICAgICAgICAgICB2bS5jb29yZGluYXRlcyA9IFtsZWFmRXZlbnQubGF0bG5nLmxuZywgbGVhZkV2ZW50LmxhdGxuZy5sYXRdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSB0b1N0YXRlLm5hbWUuc3BsaXQoXCIuXCIpWzFdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxvY2F0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY2FtcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNlYXNvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1ldGFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImdweFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZpbmlzaFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gNztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnY3VycmVudFN0ZXAnLCBzdGVwKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0ZXApO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIiAiLCJhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgcmV0dXJuIGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGxcclxufVxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhcicsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhcicsIHJvdGFsYXIpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyL3JvdGFsYXIuaHRtbCcsXHJcbiAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbn1cclxuXHJcblJvdGFsYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJyxcclxuICAgICdtYXJrZXJQYXJzZXInLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0TWFwRXZlbnRzJywgJ2xlYWZsZXREYXRhJywgJyRsb2NhdGlvbicsICckd2luZG93J1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgdHJhY2tTZXJ2aWNlLFxyXG4gICAgbWFya2VyUGFyc2VyLCBtYXBDb25maWdTZXJ2aWNlLCBsZWFmbGV0TWFwRXZlbnRzLCBsZWFmbGV0RGF0YSwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tzID0ge307XHJcbiAgICB2bS5nZXRUcmFjayA9IGdldFRyYWNrO1xyXG4gICAgdm0ubWFwQXV0b1JlZnJlc2ggPSB0cnVlO1xyXG4gICAgdm0ub3Blbk1hcCA9IG9wZW5NYXA7XHJcbiAgICB2bS5jaGFuZ2VJbWcgPSBjaGFuZ2VJbWc7XHJcbiAgICB2bS5wYXJhbXMgPSB7fTtcclxuXHJcblxyXG5cclxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdORSkgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sYXRTVykgfHxcclxuICAgICAgICBhbmd1bGFyLmlzVW5kZWZpbmVkT3JOdWxsKCRzdGF0ZVBhcmFtcy5sbmdTVylcclxuICAgICkge1xyXG4gICAgICAgIC8vIHTDvHJraXlleWUgc2FiaXRsZW1layBpw6dpblxyXG4gICAgICAgIHZtLnBhcmFtcy5sYXRORSA9IDQ0LjI5MjtcclxuICAgICAgICB2bS5wYXJhbXMubG5nTkUgPSA0MS4yNjQ7XHJcbiAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gMzIuODA1O1xyXG4gICAgICAgIHZtLnBhcmFtcy5sbmdTVyA9IDI3Ljc3MztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdm0ucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBsYXRORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0TkUpLFxyXG4gICAgICAgICAgICBsbmdORTogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nTkUpLFxyXG4gICAgICAgICAgICBsYXRTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubGF0U1cpLFxyXG4gICAgICAgICAgICBsbmdTVzogcGFyc2VGbG9hdCgkc3RhdGVQYXJhbXMubG5nU1cpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcbiAgICAkcm9vdFNjb3BlLnNlYXJjaExvY2F0aW9uID0gJHN0YXRlUGFyYW1zLnRlcm07XHJcblxyXG4gICAgLy8gaWYod2luZG93Lm1vYmlsZWNoZWNrICYmIHZtLm1hcEFjdGl2ZSl7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgaWYgKHZtLnBhcmFtcy5sYXRORSAmJiB2bS5wYXJhbXMubG5nTkUgJiYgdm0ucGFyYW1zLmxhdFNXICYmIHZtLnBhcmFtcy5sbmdTVykge1xyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgW3ZtLnBhcmFtcy5sYXRORSwgdm0ucGFyYW1zLmxuZ05FXSxcclxuICAgICAgICAgICAgICAgICAgICBbdm0ucGFyYW1zLmxhdFNXLCB2bS5wYXJhbXMubG5nU1ddLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5zZXRab29tKG1hcC5nZXRab29tKCkgLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uZ2V0VHJhY2soKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUcmFjaygpIHtcclxuICAgICAgICByZXR1cm4gdHJhY2tTZXJ2aWNlLmdldFRyYWNrKHZtLnBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzcG9uZCkge1xyXG4gICAgICAgICAgICB2bS50cmFja3MuZGF0YSA9IHJlc3BvbmQuZGF0YTtcclxuICAgICAgICAgICAgaWYgKHZtLnRyYWNrcy5kYXRhID09IFtdKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmtlclBhcnNlci5qc29uVG9NYXJrZXJBcnJheSh2bS50cmFja3MuZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnMgPSBtYXJrZXJQYXJzZXIudG9PYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IEwuZ2VvSnNvbih2bS50cmFja3MuZGF0YSkuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgIHZtLm1hcmtlcnNFbXB0eSA9IGFuZ3VsYXIuZXF1YWxzKE9iamVjdC5rZXlzKHZtLm1hcmtlcnMpLmxlbmd0aCwgMCk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHt9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5sYXllcnMgPSBtYXBDb25maWdTZXJ2aWNlLmdldExheWVyKCk7XHJcbiAgICB2bS5jZW50ZXIgPSBtYXBDb25maWdTZXJ2aWNlLmdldENlbnRlcigpO1xyXG5cclxuICAgIHZtLmNoYW5nZUljb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgLy8gdmFyIHN3YXAgPSBtYXJrZXIuaWNvbjtcclxuICAgICAgICAvLyBtYXJrZXIuaWNvbiA9IG1hcmtlci5pY29uX3N3YXA7XHJcbiAgICAgICAgLy8gbWFya2VyLmljb25fc3dhcCA9IHN3YXA7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRsb2NhdGlvbi5zZWFyY2goKS5sYXRORSA9IDIwKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKG1hcmtlci5mb2N1cylcclxuICAgICAgICAvLyAgICAgbWFya2VyLmZvY3VzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgICBtYXJrZXIuZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgIG1hcmtlci5pY29uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgIGljb246ICdwYXJrJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdm0ucmVtb3ZlSWNvbiA9IGZ1bmN0aW9uIChtYXJrZXIpIHtcclxuICAgICAgICBtYXJrZXIuaWNvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogJ21ha2lNYXJrZXInLFxyXG4gICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnI0I3QTRFMycsXHJcbiAgICAgICAgICAgIHNpemU6IFwibFwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnpvb21NYXJrZXIgPSBmdW5jdGlvbiAobWFya2VyKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZ3MgPSBbXHJcbiAgICAgICAgICAgIFttYXJrZXIubGF0LCBtYXJrZXIubG5nXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIG1hcmtlckJvdW5kcyA9IEwubGF0TG5nQm91bmRzKGxhdExuZ3MpO1xyXG4gICAgICAgIGxlYWZsZXREYXRhLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKG1hcmtlckJvdW5kcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0ubWFwRXZlbnRzID0gbGVhZmxldE1hcEV2ZW50cy5nZXRBdmFpbGFibGVNYXBFdmVudHMoKTtcclxuXHJcblxyXG4gICAgLy9sb2cgZXZlbnRzIGZvciBtYXJrZXIgb2JqZWN0c1xyXG4gICAgZm9yICh2YXIgayBpbiB2bS5tYXBFdmVudHMpIHtcclxuICAgICAgICAvLyAgY29uc29sZS5sb2codm0ubWFwRXZlbnRzKTtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuJyArIHZtLm1hcEV2ZW50c1trXTtcclxuICAgICAgICAkc2NvcGUuJG9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5uYW1lID09ICdsZWFmbGV0RGlyZWN0aXZlTWFya2VyLm1vdXNlb3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmNoYW5nZUljb24odm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIubW91c2VvdXQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5yZW1vdmVJY29uKHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLm1hcmtlcnNbYXJncy5tb2RlbE5hbWVdLmZvY3VzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGV2ZW50Lm5hbWUgPT0gJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuY2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ucmVtb3ZlSWNvbih2bS5tYXJrZXJzW2FyZ3MubW9kZWxOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgdm0ubWFya2Vyc1thcmdzLm1vZGVsTmFtZV0uZm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YXIgbWFwRXZlbnQgPSAnbGVhZmxldERpcmVjdGl2ZU1hcC5kcmFnZW5kJztcclxuXHJcbiAgICAkc2NvcGUuJG9uKG1hcEV2ZW50LCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICB1cGRhdGVNYXAoYXJncyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgbWFwRXZlbnQyID0gJ2xlYWZsZXREaXJlY3RpdmVNYXAuem9vbWVuZCc7XHJcblxyXG4gICAgJHNjb3BlLiRvbihtYXBFdmVudDIsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xyXG4gICAgICAgIHVwZGF0ZU1hcChhcmdzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU1hcChhcmdzKSB7XHJcbiAgICAgICAgaWYgKHZtLm1hcEF1dG9SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXJrZXJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdE5FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ05FID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubG5nO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxhdFNXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubGF0O1xyXG4gICAgICAgICAgICAgICAgdm0ucGFyYW1zLmxuZ1NXID0gYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcuZGF0YS12aXonKS53aWR0aCgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdE5FJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsbmdORSc6IGFyZ3MubGVhZmxldE9iamVjdC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICAgICAgICAgICAgICAnbGF0U1cnOiBhcmdzLmxlYWZsZXRPYmplY3QuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xuZ1NXJzogYXJncy5sZWFmbGV0T2JqZWN0LmdldEJvdW5kcygpLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5nZXRUcmFjaygpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgdm0ubWFwQWN0aXZlID0gIXZtLm1hcEFjdGl2ZTtcclxuICAgICAgICAkKCcuZGF0YS12aXonKS50b2dnbGVDbGFzcygnbWFwLW9wZW4nKTtcclxuICAgICAgICAkKCcubWFwLWF1dG8tcmVmcmVzaCcpLnRvZ2dsZUNsYXNzKCdyZWZyZXNoLW9wZW4nKTtcclxuICAgICAgICAodm0udG9nZ2xlVGl0bGUgPT0gJyBIYXJpdGEnID8gdm0udG9nZ2xlVGl0bGUgPSAnIExpc3RlJyA6IHZtLnRvZ2dsZVRpdGxlID0gJyBIYXJpdGEnKVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygkKCcuZGF0YS12aXonKS53aWR0aCgpKTtcclxuICAgICAgICBsZWFmbGV0RGF0YS5nZXRNYXAoKS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgbWFwLmludmFsaWRhdGVTaXplKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZUltZygpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KCcubm90LWZvdW5kLWltZycpLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgdmFsLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59IiwiLy8gICAoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4vLyAgICAgICAgIGFuZ3VsYXJcclxuLy8gICAgICAgICAgICAgLm1vZHVsZSgnYXBwLnJvdGFsYXJpbScsIFtdKVxyXG4vLyAgICAgICAgICAgICAuZGlyZWN0aXZlKCdyb3RhbGFyaW0nLCByb3RhbGFyaW0pXHJcblxyXG4vLyAgICAgICAgIGZ1bmN0aW9uIHJvdGFsYXJEZXRhaWwoKSB7XHJcbi8vICAgICAgICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbi8vICAgICAgICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4vLyAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL3JvdGEvcm90YWxhcmltL3JvdGFsYXJpbS5odG1sJyxcclxuLy8gICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuLy8gICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJvdGFsYXJpbUNvbnRyb2xsZXIsXHJcbi8vICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbi8vICAgICAgICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbi8vICAgICAgICAgICAgIH07XHJcblxyXG4vLyAgICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlOyBcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIFJvdGFsYXJpbUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICd0cmFja1NlcnZpY2UnLCAnbWFwQ29uZmlnU2VydmljZScsICdsZWFmbGV0RGF0YScsICd3ZWF0aGVyQVBJJywgJ25nRGlhbG9nJ107XHJcblxyXG4vLyAgICAgICAgIGZ1bmN0aW9uIFJvdGFsYXJpbUNvbnRyb2xsZXIoKXtcclxuICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgfSkoKTsiLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucm90YWxhckRldGFpbCcsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncm90YWxhckRldGFpbCcsIHJvdGFsYXJEZXRhaWwpXHJcblxyXG5mdW5jdGlvbiByb3RhbGFyRGV0YWlsKCkge1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvcm90YS9yb3RhbGFyLmRldGFpbC9yb3RhbGFyLmRldGFpbC5odG1sJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgY29udHJvbGxlcjogUm90YWxhckRldGFpbENvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTsgXHJcbn1cclxuXHJcblJvdGFsYXJEZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAndHJhY2tTZXJ2aWNlJywgJ21hcENvbmZpZ1NlcnZpY2UnLCAnbGVhZmxldERhdGEnLCAnd2VhdGhlckFQSScsICduZ0RpYWxvZyddO1xyXG5cclxuZnVuY3Rpb24gUm90YWxhckRldGFpbENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHRyYWNrU2VydmljZSwgbWFwQ29uZmlnU2VydmljZSwgbGVhZmxldERhdGEsIHdlYXRoZXJBUEksIG5nRGlhbG9nKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udHJhY2tEZXRhaWwgPSB7fTtcclxuICAgIHZtLmNlbnRlciA9IHt9O1xyXG4gICAgdm0ubGF5ZXJzID0gbWFwQ29uZmlnU2VydmljZS5nZXRMYXllckZvckRldGFpbCgpO1xyXG4gICAgdm0uY29udHJvbHMgPSB7XHJcbiAgICAgICAgZnVsbHNjcmVlbjoge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcGxlZnQnXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnVwZGF0ZVRyYWNrID0gdXBkYXRlVHJhY2s7XHJcbiAgICB2bS5kZWxldGVUcmFjayA9IGRlbGV0ZVRyYWNrO1xyXG4gICAgdm0uZGVsZXRlVHJhY2tPSyA9IGRlbGV0ZVRyYWNrT0s7XHJcbiAgICB2bS51cGRhdGVUcmFjayA9IHVwZGF0ZVRyYWNrO1xyXG4gICAgdm0udXBkYXRlVHJhY2tPSyA9IHVwZGF0ZVRyYWNrT0s7XHJcbiBcclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgdHJhY2tTZXJ2aWNlLmdldFRyYWNrRGV0YWlsKCRzdGF0ZVBhcmFtcy5pZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrRGV0YWlsID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuaW1nX3NyYyA9IHZtLnRyYWNrRGV0YWlsLnByb3BlcnRpZXMuaW1nX3NyYztcclxuICAgICAgICAgICAgdm0uY2VudGVyID0ge1xyXG4gICAgICAgICAgICAgICAgbGF0OiB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIGxuZzogdm0udHJhY2tEZXRhaWwuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgICAgICB6b29tOiAxMlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2bS5ncHhEYXRhID0ge307XHJcblxyXG4gICAgICAgICAgICB3ZWF0aGVyQVBJLmRhcmtTa3lXZWF0aGVyKHZtLnRyYWNrRGV0YWlsLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLCB2bS50cmFja0RldGFpbC5nZW9tZXRyeS5jb29yZGluYXRlc1swXSkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB2bS53ZWF0aGVyID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnMgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdibGFjaydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2t5Y29ucy5hZGQoXCJpY29uMVwiLCByZXMuY3VycmVudGx5Lmljb24pO1xyXG4gICAgICAgICAgICAgICAgc2t5Y29ucy5wbGF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNreWNvbnMgPSBuZXcgU2t5Y29ucyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2t5Y29ucy5hZGQoXCJpY29uMlwiLCByZXMuY3VycmVudGx5Lmljb24pO1xyXG4gICAgICAgICAgICAgICAgc2t5Y29ucy5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2t5Y29uc0RhaWx5ID0gbmV3IFNreWNvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBza3ljb25zRGFpbHlXaGl0ZSA9IG5ldyBTa3ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0ud2VhdGhlci5kYWlseS5kYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBrZXkgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGsgPSBrZXkgKyAyMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNzID0gXCJpY29uXCIgKyBzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2sgPSBcImljb25cIiArIGs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHkuYWRkKHNzLCB2YWx1ZS5pY29uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza3ljb25zRGFpbHlXaGl0ZS5hZGQoa2ssIHZhbHVlLmljb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNreWNvbnNEYWlseVdoaXRlLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgbGVhZmxldERhdGEuZ2V0TWFwKCkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Lm1vYmlsZWNoZWNrKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNjcm9sbFdoZWVsWm9vbS5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZHJhZ2dpbmcuZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1hcC5hZGRDb250cm9sKG5ldyBMLkNvbnRyb2wuRnVsbHNjcmVlbigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ3B4ID0gdm0udHJhY2tEZXRhaWwucHJvcGVydGllcy5ncHg7IC8vIFVSTCB0byB5b3VyIEdQWCBmaWxlIG9yIHRoZSBHUFggaXRzZWxmXHJcbiAgICAgICAgICAgICAgICB2YXIgZyA9IG5ldyBMLkdQWChncHgsIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2x5bGluZV9vcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAneWVsbG93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGFzaEFycmF5OiAnMTAsMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6ICczJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogJzAuOSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcl9vcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdwdEljb25VcmxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJzogJ2ltZy9pY29uLWdvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnR2VvY2FjaGUgRm91bmQnOiAnaW1nL2dweC9nZW9jYWNoZS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BhcmsnOiAnaW1nL2dweC90cmVlLnBuZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJY29uVXJsOiAnaW1nL2ljb24tZ28uc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kSWNvblVybDogJ2ltZy9pY29uLXN0b3Auc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93VXJsOiAnaW1nL3Bpbi1zaGFkb3cucG5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmdweERhdGEuZGlzdGFuY2UgPSBlLnRhcmdldC5nZXRfZGlzdGFuY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ncHhEYXRhLmVsZU1pbiA9IGUudGFyZ2V0LmdldF9lbGV2YXRpb25fbWluKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3B4RGF0YS5lbGVNYXggPSBlLnRhcmdldC5nZXRfZWxldmF0aW9uX21heCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzZXQwOiBlLnRhcmdldC5nZXRfZWxldmF0aW9uX2RhdGEoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhlLnRhcmdldC5nZXRCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQuZ2V0Qm91bmRzKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0JvdW5kcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX25vcnRoRWFzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBlLnRhcmdldC5nZXRCb3VuZHMoKS5fbm9ydGhFYXN0LmxhdCArIDAuMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX25vcnRoRWFzdC5sbmcgKyAwLjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3NvdXRoV2VzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBlLnRhcmdldC5nZXRCb3VuZHMoKS5fc291dGhXZXN0LmxhdCAtIDAuMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogZS50YXJnZXQuZ2V0Qm91bmRzKCkuX3NvdXRoV2VzdC5sbmcgLSAwLjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3V0aFdlc3QgPSBMLmxhdExuZyhuZXdCb3VuZHMuX25vcnRoRWFzdC5sYXQsIG5ld0JvdW5kcy5fbm9ydGhFYXN0LmxuZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcnRoRWFzdCA9IEwubGF0TG5nKG5ld0JvdW5kcy5fc291dGhXZXN0LmxhdCwgbmV3Qm91bmRzLl9zb3V0aFdlc3QubG5nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXAuc2V0TWF4Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLl9sYXllcnNNaW5ab29tID0gMTBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZy5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVsZXRlVHJhY2tPSygpIHtcclxuXHJcbiAgICAgICAgbmdEaWFsb2cub3Blbih7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAndGVtcGxhdGVJZCcsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2U6IGZhbHNlLFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBzY29wZTogJHNjb3BlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9IFxyXG5cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVRyYWNrKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKDEpO1xyXG4gICAgICAgIHRyYWNrU2VydmljZS5kZWxldGVUcmFjayh2bS50cmFja0RldGFpbCkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmKHJlcy5PcGVyYXRpb25SZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcInJvdGFsYXJTdGF0ZVwiKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAocmVqKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWonKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRyYWNrT0soKSB7XHJcblxyXG4gICAgICAgIG5nRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3VwZGF0ZVRyYWNrJyxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXHJcbiAgICAgICAgICAgIHNob3dDbG9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRyYWNrKGRldGFpbCkge1xyXG4gICAgICAgIHJldHVybiB0cmFja1NlcnZpY2UudXBkYXRlVHJhY2soZGV0YWlsKS50aGVuKGZ1bmN0aW9uICgpIHt9LCBmdW5jdGlvbiAoKSB7fSk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIi8qKlxyXG4gKiBAZGVzYyBTZXJ2aWNlcyB0aGF0IGNvbnZlcnRzIGdlb2pzb24gZmVhdHVyZXMgdG8gbWFya2VycyBmb3IgaGFuZGxpbmcgbGF0ZXJcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXJrZXJQYXJzZXIoJHEpIHtcclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgIGpzb25Ub01hcmtlckFycmF5OiBqc29uVG9NYXJrZXJBcnJheSxcclxuICAgICAgICB0b09iamVjdDogdG9PYmplY3QsXHJcbiAgICAgICAgbWFya2VyQ29udGVudDogbnVsbCxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgICAvLyBjb252ZXJ0IGZlYXR1cmUgZ2VvanNvbiB0byBhcnJheSBvZiBtYXJrZXJzXHJcbiAgICBmdW5jdGlvbiBqc29uVG9NYXJrZXJBcnJheSh2YWwpIHtcclxuICAgICAgICB2YXIgZGVmZXJlZCA9ICRxLmRlZmVyKCk7IC8vIGRlZmVyZWQgb2JqZWN0IHJlc3VsdCBvZiBhc3luYyBvcGVyYXRpb25cclxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHNlcnZpY2UubWFya2VyQ29udGVudCA9ICdcdDxkaXYgY2xhc3M9XCJjYXJkIGNhcmQtb24tbWFwXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtaW1hZ2UtY29udGFpbmVyXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtaW1hZ2UtY292ZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICc8aW1nIGRhdGEtbmctc3JjPVwiJyArIHZhbFtpXS5wcm9wZXJ0aWVzLmltZ19zcmMgKyAnXCIgY2xhc3M9XCJpbWctZmx1aWRcIiBhbHQ9XCJcIj48L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8YT48ZGl2IGNsYXNzPVwibWFzayB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHRcIj48L2Rpdj48L2E+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtYmxvY2tcIj4nICtcclxuICAgICAgICAgICAgICAgICc8aDQgY2xhc3M9XCJjYXJkLXRpdGxlIGZvbnQtc2l6ZS0xNlwiPjxhIGhyZWY9XCJyb3RhLycrIHZhbFtpXS5faWQrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrdmFsW2ldLnByb3BlcnRpZXMubmFtZSsnPC9hPjwvaDQ+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgICAgICAgdmFyIG1hcmsgPSB7XHJcbiAgICAgICAgICAgICAgICBsYXllcjogXCJyb3RhbGFyXCIsXHJcbiAgICAgICAgICAgICAgICBsYXQ6IHZhbFtpXS5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIGxuZzogdmFsW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gbWVzc2FnZTogdmFsW2ldLnByb3BlcnRpZXMubmFtZSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHNlcnZpY2UubWFya2VyQ29udGVudC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgaWNvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYWtpTWFya2VyJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAncGFyaycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTEyREE4JyxcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiBcImxcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIGljb25fc3dhcCA6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0eXBlOiAnbWFraU1hcmtlcicsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogJ3BhcmsnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbG9yOiAnIzUxMkRBOCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2l6ZTogXCJsXCJcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB2YWxbaV0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiB2YWxbaV0ucHJvcGVydGllcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYWx0aXR1ZGVcIjogdmFsW2ldLnByb3BlcnRpZXMuYWx0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXN0YW5jZVwiOiB2YWxbaV0ucHJvcGVydGllcy5kaXN0YW5jZSxcclxuICAgICAgICAgICAgICAgICAgICBcInN1bW1hcnlcIjogdmFsW2ldLnByb3BlcnRpZXMuc3VtbWFyeSxcclxuICAgICAgICAgICAgICAgICAgICBcIm93bmVyXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLm93bmVkQnksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWdfc3JjXCI6IHZhbFtpXS5wcm9wZXJ0aWVzLmltZ19zcmMsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2gobWFyayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvdXRwdXQpIHtcclxuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBkZWZlcmVkLnJlamVjdCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XHJcbiAgICAgICAgdmFyIHJ2ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgaWYgKGFycmF5W2ldICE9PSB1bmRlZmluZWQpIHJ2W2ldID0gYXJyYXlbaV07XHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAubWFya2VyUGFyc2VyJywgW10pXHJcbiAgICAuZmFjdG9yeSgnbWFya2VyUGFyc2VyJywgbWFya2VyUGFyc2VyKTsiLCJmdW5jdGlvbiB0cmFja1NlcnZpY2UoJGh0dHApIHtcclxuXHR2YXIgZW5kcG9pbnQgPSAnaHR0cDpsb2NhbGhvc3Q6ODA4MC8nXHJcblxyXG5cdHZhciBzZXJ2aWNlID0ge1xyXG5cdFx0Z2V0VHJhY2s6IGdldFRyYWNrLFxyXG5cdFx0YWRkVHJhY2s6IGFkZFRyYWNrLFxyXG5cdFx0dXBkYXRlVHJhY2s6IHVwZGF0ZVRyYWNrLFxyXG5cdFx0ZGVsZXRlVHJhY2s6IGRlbGV0ZVRyYWNrLFxyXG5cdFx0Z2V0VHJhY2tEZXRhaWw6IGdldFRyYWNrRGV0YWlsLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRyYWNrKHBhcmFtcykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcz9sYXRORT0nICsgcGFyYW1zLmxhdE5FICsgJyZsbmdORT0nICsgcGFyYW1zLmxuZ05FICsgJyZsYXRTVz0nICsgcGFyYW1zLmxhdFNXICsgJyZsbmdTVz0nICsgcGFyYW1zLmxuZ1NXLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUcmFja0RldGFpbChpZCkge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nICsgaWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gYWRkVHJhY2sodHJhY2spIHtcclxuXHRcdHJldHVybiAkaHR0cCh7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXRhOiAkLnBhcmFtKHtcclxuXHRcdFx0XHRcIm5hbWVcIjogdHJhY2submFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLmRpc3RhbmNlLCBcclxuXHRcdFx0XHRcImFsdGl0dWRlXCI6IHRyYWNrLmFsdGl0dWRlLFxyXG5cdFx0XHRcdFwic3VtbWFyeVwiOiB0cmFjay5zdW1tYXJ5LFxyXG5cdFx0XHRcdFwiaW1nX3NyY1wiOiB0cmFjay5pbWdfc3JjLFxyXG5cdFx0XHRcdFwiY29vcmRpbmF0ZXNcIjogdHJhY2suY29vcmRpbmF0ZXMsXHJcblx0XHRcdFx0XCJvd25lZEJ5XCI6IHRyYWNrLm93bmVkQnksXHJcblx0XHRcdFx0XCJncHhcIjogdHJhY2suZ3B4LFxyXG5cdFx0XHRcdFwiaXNDYW1wXCI6IHRyYWNrLmlzQ2FtcCxcclxuXHRcdFx0XHRcInNlYXNvbnNcIjogdHJhY2suc2VsZWN0ZWRTZWFzb25zLFxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHVwZGF0ZVRyYWNrKHRyYWNrKSB7XHJcblx0XHRyZXR1cm4gJGh0dHAoe1xyXG5cdFx0XHRtZXRob2Q6ICdQVVQnLFxyXG5cdFx0XHR1cmw6ICdhcGkvdHJhY2tzLycgKyB0cmFjay5faWQsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF0YTogJC5wYXJhbSh7XHJcblx0XHRcdFx0XCJuYW1lXCI6IHRyYWNrLnByb3BlcnRpZXMubmFtZSxcclxuXHRcdFx0XHRcImRpc3RhbmNlXCI6IHRyYWNrLnByb3BlcnRpZXMuZGlzdGFuY2UsXHJcblx0XHRcdFx0XCJhbHRpdHVkZVwiOiB0cmFjay5wcm9wZXJ0aWVzLmFsdGl0dWRlLFxyXG5cdFx0XHRcdFwic3VtbWFyeVwiOiB0cmFjay5wcm9wZXJ0aWVzLnN1bW1hcnksXHJcblx0XHRcdFx0XCJpbWdfc3JjXCI6IHRyYWNrLnByb3BlcnRpZXMuaW1nX3NyYyxcclxuXHRcdFx0XHRcImNvb3JkaW5hdGVzXCI6IHRyYWNrLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxyXG5cdFx0XHRcdFwiZ3B4XCI6IHRyYWNrLnByb3BlcnRpZXMuZ3B4LFxyXG5cdFx0XHRcdFwiaXNDYW1wXCI6IHRyYWNrLnByb3BlcnRpZXMuaXNDYW1wLFxyXG5cdFx0XHRcdFwic2Vhc29uc1wiOiB0cmFjay5wcm9wZXJ0aWVzLnNlbGVjdGVkU2Vhc29ucyxcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkZWxldGVUcmFjayh0cmFjaykge1xyXG5cdFx0cmV0dXJuICRodHRwKHtcclxuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcclxuXHRcdFx0dXJsOiAnYXBpL3RyYWNrcy8nICsgdHJhY2suX2lkLFxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxufVxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLnRyYWNrU2VydmljZScsIFtdKVxyXG5cdC5mYWN0b3J5KCd0cmFja1NlcnZpY2UnLCB0cmFja1NlcnZpY2UpOyIsImZ1bmN0aW9uIHVzZXJTZXJ2aWNlKCRodHRwKSB7XHJcblx0dmFyIHNlcnZpY2UgPSB7XHJcblx0XHRnZXRVc2VyOiBnZXRVc2VyLFxyXG5cdH07XHJcblx0cmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlcigpIHtcclxuICAgIFx0cmV0dXJuICRodHRwKHtcclxuICAgIFx0XHRtZXRob2Q6ICdHRVQnLFxyXG4gICAgXHRcdHVybDogJ2FwaS9wcm9maWxlJ1xyXG4gICAgXHR9KVxyXG4gICAgfTsgXHJcbn0gXHJcbmFuZ3VsYXJcclxuLm1vZHVsZSgnYXBwLnVzZXJTZXJ2aWNlJywgW10pXHJcbi5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBzZXJ2aWNlSWQgPSAnd2VhdGhlckFQSSc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC53ZWF0aGVyJywgW10pXHJcbiAgICAgICAgLmZhY3Rvcnkoc2VydmljZUlkLCBbJyRxJywgJyRodHRwJywgd2VhdGhlckFQSV0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdlYXRoZXJBUEkoJHEsICRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIHdlYXRoZXI6IHdlYXRoZXIsXHJcbiAgICAgICAgICAgIGZvcmVjYXN0OiBmb3JlY2FzdCxcclxuICAgICAgICAgICAgZGFya1NreVdlYXRoZXI6IGRhcmtTa3lXZWF0aGVyLFxyXG4gICAgICAgICAgICBhcHBpZDogJ2ZhMmQ1OTNhYTU4ZTkwZmRlMzI4NDI2ZTY0YTY0ZTM4J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHdlYXRoZXIobGF0LCBsbmcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PScgKyBsYXQgKyAnJmxvbj0nICsgbG5nICsgJyZhcHBpZD0nICsgc2VydmljZS5hcHBpZCArICcmdW5pdHM9bWV0cmljJmxhbmc9dHInXHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmNvZCA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRIb3VycyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRNaW51dGVzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGN1cnJlbnQgaG91ciB1c2luZyBvZmZzZXQgZnJvbSBVVEMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRldGltZSA9IG5ldyBEYXRlKChyZXMuZGF0YS5kdCAqIDEwMDApICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5yaXNlID0gbmV3IERhdGUocmVzLmRhdGEuc3lzLnN1bnJpc2UgKiAxMDAwICsgKG9mZnNldEhvdXJzICogMzYwMDAwMCkgKyAob2Zmc2V0TWludXRlcyAqIDYwMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdW5zZXQgPSBuZXcgRGF0ZShyZXMuZGF0YS5zeXMuc3Vuc2V0ICogMTAwMCArIChvZmZzZXRIb3VycyAqIDM2MDAwMDApICsgKG9mZnNldE1pbnV0ZXMgKiA2MDAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUN1cnJlbnQgPSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5kYXRldGltZSA9IGRhdGV0aW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA9IGRhdGFDdXJyZW50LmRhdGV0aW1lLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LnN1bnJpc2VIb3VyID0gc3VucmlzZS5nZXRVVENIb3VycygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC5zdW5zZXRIb3VyID0gc3Vuc2V0LmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSG91ciBiZXR3ZWVuIHN1bnNldCBhbmQgc3VucmlzZSBiZWluZyBuaWdodCB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUN1cnJlbnQuY3VycmVudEhvdXIgPj0gZGF0YUN1cnJlbnQuc3Vuc2V0SG91ciB8fCBkYXRhQ3VycmVudC5jdXJyZW50SG91ciA8PSBkYXRhQ3VycmVudC5zdW5yaXNlSG91cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCB3ZWF0aGVyIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJEZXNjcmlwdGlvbiA9IHJlcy5kYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXMuZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGFuZ2Ugd2VhdGhlciBpY29uIGNsYXNzIGFjY29yZGluZyB0byB3ZWF0aGVyIGNvZGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LXRodW5kZXJzdG9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDIzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc3Rvcm0tc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMxNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc2hvd2Vyc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUwNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUyMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDUzMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYwMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtc25vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYyMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDYxMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1uaWdodC1hbHQtcmFpbi1taXhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtZm9nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWNsZWFyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLW5pZ2h0LWFsdC1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktbmlnaHQtYWx0LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzLmRhdGEud2VhdGhlclswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjEyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS10aHVuZGVyc3Rvcm1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN0b3JtLXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzMjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNob3dlcnNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MjI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1MzE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXNub3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2MTI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXJhaW4tbWl4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzIxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzQxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1mb2dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4MDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LXN1bm55XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWRheS1jbG91ZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWhhaWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktZGF5LWNsb3VkeS13aW5keVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuZGF0YS53ZWF0aGVyWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDczMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzUxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDc2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWR1c3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzExOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktc21va2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNzcxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1ODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zdHJvbmctd2luZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA3ODE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDkwMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLXRvcm5hZG9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NjE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk2MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQ3VycmVudC53ZWF0aGVyQ2xhc3MgPSBcIndpLWh1cnJpY2FuZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1zbm93Zmxha2UtY29sZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5MDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUN1cnJlbnQud2VhdGhlckNsYXNzID0gXCJ3aS1ob3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1MjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTUzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5NTQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk1NTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgOTU2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50LndlYXRoZXJDbGFzcyA9IFwid2ktd2luZHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDdXJyZW50OiBkYXRhQ3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9yZWNhc3QobGF0LCBsbmcpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkYXJrU2t5V2VhdGhlcihsYXQsIGxuZykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3dlYXRoZXIvJyArIGxhdCArICcvJyArIGxuZyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLk9wZXJhdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudGx5LnRpbWUgPSBuZXcgRGF0ZSgoZGF0YS5jdXJyZW50bHkudGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdGEuZGFpbHkuZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGFpbHkuZGF0YVtrZXldLnRpbWUgPSAgbmV3IERhdGUoKHZhbHVlLnRpbWUgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVqZWN0LmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yVHlwZTogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCJmdW5jdGlvbiBtYXBDb25maWdTZXJ2aWNlKCkge1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgIGdldExheWVyOiBnZXRMYXllcixcclxuICAgICAgICBnZXRDZW50ZXI6IGdldENlbnRlcixcclxuICAgICAgICBnZXRMYXllckZvckRldGFpbDogZ2V0TGF5ZXJGb3JEZXRhaWwsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGF5ZXIoKSB7XHJcbiAgICAgICAgdmFyIGxheWVycyA9IHtcclxuICAgICAgICAgICAgYmFzZWxheWVyczoge1xyXG4gICAgICAgICAgICAgICAgU3RhbWVuX1RlcnJhaW46IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXJhemknLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgTWFwYm94X1NhdGVsbGl0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdVeWR1JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc2F0ZWxsaXRlLXN0cmVldHMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X091dGRvb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L291dGRvb3JzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgVGh1bmRlcmZvcmVzdF9MYW5zY2FwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfEsHpvaGlwcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL2xhbmRzY2FwZS97en0ve3h9L3t5fS5wbmc/YXBpa2V5PTJlN2EzMzE1YTdjODQ1NTQ4ZmJkOGExY2YyMjFhOTg1JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBZYW5kZXg6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWWFuZGV4IFlvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3lhbmRleCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllclR5cGU6ICdtYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvdmVybGF5czoge1xyXG4gICAgICAgICAgICAgICAgcm90YWxhcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JvdGFsYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGF5ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7XHJcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgbGF0OiAzOS45MDMyOTE4LFxyXG4gICAgICAgICAgICBsbmc6IDMyLjYyMjMzOTYsXHJcbiAgICAgICAgICAgIHpvb206IDZcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMYXllckZvckRldGFpbCgpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0ge1xyXG4gICAgICAgICAgICBiYXNlbGF5ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBUaHVuZGVyZm9yZXN0X091dGRvb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ091dGRvb3IgMicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3tzfS50aWxlLnRodW5kZXJmb3Jlc3QuY29tL291dGRvb3JzL3t6fS97eH0ve3l9LnBuZz9hcGlrZXk9MmU3YTMzMTVhN2M4NDU1NDhmYmQ4YTFjZjIyMWE5ODUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd4eXonLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFN0YW1lbl9UZXJyYWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FyYXppJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX0ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPiwgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X1NhdGVsbGl0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdVeWR1JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc2F0ZWxsaXRlLXN0cmVldHMtdjEwL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2liM0poWW1GNmIzSWlMQ0poSWpvaWRHOUxSSGxpTkNKOS5TSFlibWZlbi1qd0tXQ1lEaU9CVVdRJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAneHl6JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCB0aWxlcyBieSBNYXBib3gnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgTWFwYm94X091dGRvb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L291dGRvb3JzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYjNKaFltRjZiM0lpTENKaElqb2lkRzlMUkhsaU5DSjkuU0hZYm1mZW4tandLV0NZRGlPQlVXUScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgdGlsZXMgYnkgTWFwYm94J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFRodW5kZXJmb3Jlc3RfT3V0ZG9vcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnT3V0ZG9vciAyJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8ve3N9LnRpbGUudGh1bmRlcmZvcmVzdC5jb20vb3V0ZG9vcnMve3p9L3t4fS97eX0ucG5nP2FwaWtleT0yZTdhMzMxNWE3Yzg0NTU0OGZiZDhhMWNmMjIxYTk4NScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3h5eicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgWWFuZGV4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1lhbmRleCBZb2wnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd5YW5kZXgnLCBcclxuICAgICAgICAgICAgICAgICAgICBsYXllck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJUeXBlOiAnbWFwJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYXllcnM7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLm1hcCcsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ21hcENvbmZpZ1NlcnZpY2UnLCBtYXBDb25maWdTZXJ2aWNlKTsiLCJmdW5jdGlvbiBnZW9jb2RlKCRxKSB7XHJcbiAgcmV0dXJuIHsgXHJcbiAgICBnZW9jb2RlQWRkcmVzczogZnVuY3Rpb24oYWRkcmVzcykge1xyXG4gICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcclxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7ICdhZGRyZXNzJzogYWRkcmVzcyB9LCBmdW5jdGlvbiAocmVzdWx0cywgc3RhdHVzKSB7XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xyXG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAvLyB3aW5kb3cuZmluZExvY2F0aW9uKHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAubW9kdWxlKCdhcHAubWFwJylcclxuIC5mYWN0b3J5KCdnZW9jb2RlJywgZ2VvY29kZSk7IiwiZnVuY3Rpb24gcmV2ZXJzZUdlb2NvZGUoJHEsICRodHRwKSB7XHJcbiAgICB2YXIgb2JqID0ge307XHJcbiAgICBvYmouZ2VvY29kZUxhdGxuZyA9IGZ1bmN0aW9uIGdlb2NvZGVQb3NpdGlvbihsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoe1xyXG4gICAgICAgICAgICBsYXRMbmc6IGxhdGxuZ1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2VzICYmIHJlc3BvbnNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZXNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gLm1vZHVsZSgnYXBwLm1hcCcpXHJcbiAuZmFjdG9yeSgncmV2ZXJzZUdlb2NvZGUnLCByZXZlcnNlR2VvY29kZSk7Il19
