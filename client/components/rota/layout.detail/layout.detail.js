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

function LayoutDetailController($scope, $stateParams, trackService, mapConfigService) {
    var vm = this;
    vm.trackDetail = {};
    vm.center = {};
    


    activate();

    function activate() {
        trackService.getTrackDetail($stateParams.id).then(function (res) {
            vm.trackDetail = res.data;
            vm.trackDetail.properties.img_src = vm.trackDetail.properties.img_src.split('client')[1].replaceAll('\\', '/')
            vm.center = {
                lat:  vm.trackDetail.geometry.coordinates[1],
                lng: vm.trackDetail.geometry.coordinates[0],
                zoom: 12
            }
            // console.log(vm.center);

        })
    }


    vm.layers = mapConfigService.getLayer();


}