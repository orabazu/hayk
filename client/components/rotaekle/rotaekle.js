function rotaEkleController($scope, mapConfigService, reverseGeocode) {
  // $ocLazyLoad.load('../../services/map/map.autocomplete.js');  
  var vm = this;
  vm.layers = mapConfigService.getLayer();
  vm.center = mapConfigService.getCenter();
  vm.location;

  //Track parameters
  vm.ownerId;
  vm.img_src = "src";
  vm.summary;
  vm.altitude;
  vm.distance;
  vm.name = '';
  vm.coordinates = [40.43440488077008, 32.65686035156249];

  vm.addTrack = function() {
    console.log(vm);
  }

  angular.extend($scope, {
    markers: {
      mainMarker: {
        lat: vm.coordinates[0],
        lng: vm.coordinates[1],
        focus: true,
        message: "Başka bir noktaya tıklayarak kaydır.",
        draggable: true
      }
    }
  });

  $scope.$on("leafletDirectiveMap.click", function (event, args) {
    var leafEvent = args.leafletEvent;
    console.log(leafEvent);
    reverseGeocode.geocodeLatlng(leafEvent.latlng.lat, leafEvent.latlng.lng).then(function (geocodeSuccess) {
      console.log(geocodeSuccess)
      vm.location = geocodeSuccess;
    }, 
    function (err) {
      console.log(err)
    });
    $scope.markers.mainMarker.lat = leafEvent.latlng.lat;
    $scope.markers.mainMarker.lng = leafEvent.latlng.lng;
  });
}

angular
  .module('app.rotaekle', ['app.map', 'ngAutocomplete'])
  .controller('rotaEkleController', rotaEkleController)