function rotaEkleController($scope, mapConfigService, reverseGeocode, trackService,$state) {
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
  vm.coordinates = [];

  vm.addTrack = function() {
    console.log(vm);
    trackService.addTrack(vm).then(function(addTrackResponse){
        console.log(addTrackResponse);
        $state.go('layout');
    }, function(addTrackError){
        console.log(addTrackError);
    })
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
    vm.coordinates = [leafEvent.latlng.lng,leafEvent.latlng.lat];
  });
}

angular
  .module('app.rotaekle', ['app.map', 'ngAutocomplete','app.trackService'])
  .controller('rotaEkleController', rotaEkleController)