/**
 * @desc spinner directive that can be used anywhere across apps at a company named Acme
 * @example <div acme-shared-spinner></div>
 */
angular
  .module('app.rotaekle', [])
  .controller('rotaEkleController', rotaEkleController);

function rotaEkleController($scope, mapConfigService) {
  var vm = this;
  vm.layers = mapConfigService.getLayer();
  vm.center = mapConfigService.getCenter();

  $scope.$on("leafletDirectiveMap.click", function (event, args) {
    var leafEvent = args.leafletEvent;
    console.log(leafEvent);
    var mainMarker = {
      lat: leafEvent.latlng.lat,
      lng: leafEvent.latlng.lng,
      focus: true,
      message: "Başka bir noktaya tıklayarak kaydır.",
      draggable: true
    };
    angular.extend($scope, {
      markers: {
        mainMarker: angular.copy(mainMarker)
      }
    });

  });
}