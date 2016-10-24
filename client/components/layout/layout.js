/**
 * @desc Main layout for application
 * @example <layout-directive></layout-directive>
 */
angular
    .module('app.layout', [])
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

function LayoutController($scope, $rootScope, $state, trackService, markerParser, mapConfigService, leafletMapEvents, leafletData) {
    var vm = this;
    vm.tracks = {};

    activate();

    function activate() {
        return getTrack().then(function () {
            // console.log("getTrack activated");
        });
    }

    function getTrack() {
        return trackService.getTrack().then(function (respond) {
            console.log(respond);
            vm.tracks.data = respond.data;
            markerParser.jsonToMarkerArray(vm.tracks.data)
                .then(function (response) {

                    vm.markers = markerParser.toObject(response);
                    console.log(vm.tracks.data );
                    var bounds = L.geoJson(vm.tracks.data).getBounds();
                    leafletData.getMap().then(function (map) {
                        map.fitBounds(bounds); 
                    });
                })
                .catch(function (err) {
                    console.log(response);
                });
        });
    }

    vm.layers = mapConfigService.getLayer();
    vm.center = mapConfigService.getCenter();

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

    vm.removeIcon = function (marker) {
        marker.icon = {
            type: 'makiMarker',
            icon: 'park',
            color: '#004c00',
            size: "l"
        }
    }

    vm.zoomMarker = function (marker) {
        var latLngs = [
            [marker.lat, marker.lng]
        ];
        var markerBounds = L.latLngBounds(latLngs);
        leafletData.getMap().then(function (map) {
            map.fitBounds(markerBounds);
        });
    }

    vm.mapEvents = leafletMapEvents.getAvailableMapEvents();

    for (var k in vm.mapEvents) {
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function (event, args) {
            // console.log(event);
            if (event.name == 'leafletDirectiveMarker.mouseover') {
                vm.changeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMarker.mouseout') {
                vm.removeIcon(vm.markers[args.modelName]);
            }

        });
    }
    // console.log(vm.mapEvents);

}