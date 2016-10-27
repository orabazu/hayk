angular.module('app.core', [
  'app.header',
  'app.footer',
  'app.layout',
  'app.navbar',
  'app.login',
  'app.register',
  'app.card',
  'app.profile',
  'app.userService',
  'app.trackService',
  'app.markerParser',
  'app.mapConfigService',
  'app.rotaekle',
  'ui.router',   
  'leaflet-directive'
  ])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider,$logProvider) { // provider-injector
      $locationProvider.html5Mode(true);
      $logProvider.debugEnabled(false);
        // $urlRouterProvider.when('', '/#/');
        var defaultState = {
          name: 'defaultState',
          url: '/',
          templateUrl: '../../components/landing/landing.html'
        };
        $stateProvider.state(defaultState);

        var layoutState = {
          name: 'layout',
          url: '/a/{term}',
          template: '<navbar-directive></navbar-directive><layout-directive></layout-directive>'
        }; 	
        $stateProvider.state(layoutState);

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

        var addTrackState = { 
          name: 'addtrack',
          url: '/rotaekle',
          templateUrl: '../../components/rotaekle/rotaekle.html',
          controller: 'rotaEkleController', 
          controllerAs: 'rotaEkleController'
        };  
        $stateProvider.state(addTrackState);
      })
    .run(function($rootScope, userService) { 
      // instance-injector  
    	// console.log($state);  

      activate();

      function activate() {
        return getUser().then(function() {
            // console.log("getTrack activated");
          })
      }

      function getUser () {
        return userService.getUser()
        .then(function(respond){ 
          // console.log(respond.data); 
          if(respond.data.done){
            $rootScope.user = respond.data.user;
            $rootScope.flagLogin = true;
              console.log($rootScope.user);
            // console.log($rootScope.flagLogin);
          } else {

          }

        })
        .catch(function(err) {
          console.log(err);
        });  
      }
    }); 