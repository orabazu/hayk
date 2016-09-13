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
        templateUrl: '../../components/profile/profile.html',
        // scope: {
        //     max: '='
        // },
        controller: profileController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function profileController($rootScope, userService) {
    var vm = this;

    vm.user = {};

    activate();

    function activate() {
        return getUser().then(function() {
            // console.log("getTrack activated");
        })
    }

    function getUser () {
      return userService.getUser()
      .then(function(respond){ 
        console.log(respond.data); 
        if(respond.data.done){
            vm.user = respond.data.user;
            console.log(vm.user);
            $rootScope.flagLogin = true;
            console.log($rootScope.flagLogin);
        } else {

        }

        })
      .catch(function(err) {
        console.log(err);
        });  
    }
}