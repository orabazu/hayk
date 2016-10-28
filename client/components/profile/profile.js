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
        transclude: true,
        controller: profileController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function profileController($rootScope, userService,trackService,markerParser) {
    var vm = this;
    vm.tracks = {};
    activate();

    function activate() {
        return getTrack().then(function () {
            
        })
    }

    function getTrack() {
        return trackService.getTrack().then(function (respond) {
            vm.tracks.data = respond.data;
            markerParser.jsonToMarkerArray(vm.tracks.data)
                .then(function (response) {
                    vm.markers = markerParser.toObject(response);
                })
                .catch(function (err) {
                    console.log(response);
                });
        });
    }
}