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

  $scope.loginLoading = true;

  vm.addTrack = function () {
    trackService.addTrack(vm).then(function (addTrackResponse) {
      $state.go('layout');
    }, function (addTrackError) {
      console.log(addTrackError);
    })
  }
  vm.uploadPic = function (file) {
    if(file)
    {
vm.uploading = true;
    file.upload = Upload.upload({
      url: 'api/photos/',
      data: {
        file: file
      },
    }).then(function (resp) {
        if (resp.data.OperationResult === true) {
          vm.img_src = resp.data.Data.path
          $state.go('addtrack.finish');
        } else {
          console.log('an error occured');
        }
      },
      function (resp) { //catch error
        console.log('Error status: ' + resp.status);
      })['finally'](
      function () {
        vm.uploading = false;
      }); 
    }
    
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
    reverseGeocode.geocodeLatlng(leafEvent.latlng.lat, leafEvent.latlng.lng).then(function (geocodeSuccess) {
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
  .module('app.rotaekle', ['app.map', 'ngAutocomplete', 'app.trackService', 'ngFileUpload', 'angular-ladda'])
  .controller('rotaEkleController', rotaEkleController)