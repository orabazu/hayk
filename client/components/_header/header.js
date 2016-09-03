/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('core')
    .directive('headerDirective', headerDirective);

function headerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/_header/header.html',
        // scope: {
        //     max: '='
        // },
        controller: HeaderController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function HeaderController() {
    var vm = this;
    vm.min = 3;
    console.log('CTRL: vm.min = %s', vm.min);
    console.log('CTRL: vm.max = %s', vm.max);
}