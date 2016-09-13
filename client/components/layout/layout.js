/**
* @desc Main layout for application
* @example <layout-directive></layout-directive>
*/
angular
.module('app.layout',[])
.directive('layoutDirective', layoutDirective)

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

function LayoutController($scope,$rootScope,$state,trackService,markerParser,leafletMapEvents,leafletData) {
    var vm = this;
    vm.tracks = {};

    activate();

    function activate() {
        return getTrack().then(function() {
            // console.log("getTrack activated");
        });
    }

    function getTrack () {
      return trackService.getTrack().then(function(respond){ 
        // console.log(respond.data); 
        vm.tracks.data = respond.data;
        markerParser.jsonToMarkerArray(vm.tracks.data.features)
        .then(function(response) {
            vm.markers = markerParser.toObject(response);
            var bounds = L.geoJson(vm.tracks.data.features).getBounds();
            leafletData.getMap().then(function (map) {
                map.fitBounds(bounds);
            });
        })
        .catch (function(err){
            console.log(response);
        });
    });  
  }




    //MAP STUFF
    vm.center = {
        lat: 39.9032918,
        lng: 32.6223396,
        zoom: 6
    }
    vm.layers = {
        baselayers: {
            Stamen_Terrain: {
                name: 'Arazi',
                url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
                type: 'xyz',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

            },
            Thunderforest_Outdoors: {
                name: 'Outdoor',
                url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
                type: 'xyz',
            } 
        },
        overlays: {
            rotalar: {
                type: 'group',
                name: 'Rotalar',
                visible: true
            }
        }
    }

    vm.changeIcon = function (marker) {
        // var swap = marker.icon;
        // marker.icon = marker.icon_swap;
        // marker.icon_swap = swap;
        // if (marker.focus)
        //     marker.focus = false;
        // else
        //     marker.focus = true;

        marker.icon = {
            type: 'makiMarker',
            icon: 'park',
            color: '#512DA8',
            size: "l"
        }        
    }

    vm.removeIcon = function(marker) {
        marker.icon = {
            type: 'makiMarker',
            icon: 'park',
            color: '#004c00',
            size: "l"
        }
    }

    vm.zoomMarker = function (marker) {
        var latLngs = [[marker.lat, marker.lng]];
        var markerBounds = L.latLngBounds(latLngs);
        leafletData.getMap().then(function (map) {
            map.fitBounds(markerBounds);
        });
    }

    vm.mapEvents = leafletMapEvents.getAvailableMapEvents();

    for (var k in vm.mapEvents){
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function(event ,args){
            // console.log(event);
            if (event.name == 'leafletDirectiveMarker.mouseover') {
             vm.changeIcon(vm.markers[args.modelName]); 
         } else if (event.name == 'leafletDirectiveMarker.mouseout') {
             vm.removeIcon (vm.markers[args.modelName]); 
         }

     });
    }
    // console.log(vm.mapEvents);

}