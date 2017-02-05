function rotaEkleController($scope, mapConfigService, reverseGeocode, trackService, $state, Upload) {
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

  vm.addTrack = function () {
    console.log(vm);
    trackService.addTrack(vm).then(function (addTrackResponse) {
      console.log(addTrackResponse);
      $state.go('layout');
    }, function (addTrackError) {
      console.log(addTrackError);
    })
  }

  vm.uploadPic = function (file) {
    console.log(file);
    file.upload = Upload.upload({
      url: 'api/photos/',
      data: {
        file: file
      },
    }).then(function (resp) { //upload function returns a promise
      if (resp.data.OperationResult === true) { //validate success
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
      } else {
        console.log('an error occured');
      }
    }, function (resp) { //catch error
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
    });;
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
    vm.coordinates = [leafEvent.latlng.lng, leafEvent.latlng.lat];
  });
}

angular
  .module('app.rotaekle', ['app.map', 'ngAutocomplete', 'app.trackService', 'ngFileUpload'])
  .controller('rotaEkleController', rotaEkleController)