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