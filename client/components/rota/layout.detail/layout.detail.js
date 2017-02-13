
angular
    .module('app.layoutDetail', [])
    .directive('layoutDetailDirective', layoutDetailDirective)

function layoutDetailDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/rota/layout.detail/layout.detail.html',
        scope: {},    
        controller: LayoutDetailController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function LayoutDetailController($scope, $state, trackService, mapConfigService) {
    var vm = this;
    vm.tracks = {}; 

    activate();
 
    function activate() {
        
    }


    vm.layers = mapConfigService.getLayer();
    vm.center = mapConfigService.getCenter();


} 