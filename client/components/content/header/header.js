(function () {
    'use strict';
angular 
    .module('app.header',[])
    .directive('headerDirective', headerDirective);

function headerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/content/header/header.html',
        scope: {},
        controller: HeaderController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function HeaderController($scope,$state) {
    var vm = this;
    vm.search = function(){
        $state.go('layout', {term: vm.elma})
    }   
}
})(); 
 