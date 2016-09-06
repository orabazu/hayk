/**
* @desc Main layout for application
* @example <layout></layout>
*/
angular
    .module('app.layout',[])
    .directive('layoutDirective', layoutDirective);

function layoutDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/layout/layout.html',
        scope: {},
        controller: LayoutController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;  
} 

function LayoutController($scope,$state,trackService) {
    var vm = this;
    trackService.getTrack().then(function(respond){ 
        console.log(respond.data); 
        vm.tracks = respond.data;
    });
}