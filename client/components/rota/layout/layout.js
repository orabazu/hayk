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
        templateUrl: '../../components/rota/layout/layout.html',
        scope: {},
        controller: LayoutController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

LayoutController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'trackService', 'markerParser', 'mapConfigService', 'leafletMapEvents', 'leafletData', '$location'];

function LayoutController($scope, $rootScope, $state, $stateParams, trackService, markerParser, mapConfigService, leafletMapEvents, leafletData, $location) {
    var vm = this;
    vm.tracks = {};
    vm.getTrack = getTrack;
    vm.mapAutoRefresh = true;
    vm.params = {
        latNE: parseFloat($stateParams.latNE),
        lngNE: parseFloat($stateParams.lngNE),
        latSW: parseFloat($stateParams.latSW),
        lngSW: parseFloat($stateParams.lngSW),
    }
    activate();

    function activate() {
        if (vm.params.latNE && vm.params.lngNE && vm.params.latSW && vm.params.lngSW) {
            leafletData.getMap().then(function (map) {
                var bounds = [
                    [vm.params.latNE, vm.params.lngNE],
                    [vm.params.latSW, vm.params.lngSW],
                ];
                map.fitBounds(bounds);
                return vm.getTrack().then(function () {});
            });

        } else {
            return vm.getTrack().then(function () {});
        }
    }

    function getTrack() {
        return trackService.getTrack(vm.params).then(function (respond) {
            vm.tracks.data = respond.data;
            if (vm.tracks.data == []) {

            }
            markerParser.jsonToMarkerArray(vm.tracks.data).then(function (response) {
                vm.markers = markerParser.toObject(response);
                var bounds = L.geoJson(vm.tracks.data).getBounds();
                // leafletData.getMap().then(function (map) {
                //     map.fitBounds(bounds);
                // });

            }).catch(function (err) {});
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
        // console.log($location.search().latNE = 20);
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
        // console.log(vm.mapEvents);
        var eventName = 'leafletDirectiveMarker.' + vm.mapEvents[k];
        $scope.$on(eventName, function (event, args) {
            if (event.name == 'leafletDirectiveMarker.mouseover') {
                vm.changeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMarker.mouseout') {
                vm.removeIcon(vm.markers[args.modelName]);
            } else if (event.name == 'leafletDirectiveMap.moveend') {
                console.log(asd);
            }
        });
    }
    var mapEvent = 'leafletDirectiveMap.moveend';

    $scope.$on(mapEvent, function (event, args) {
        // console.log(args.leafletObject);
        if (vm.mapAutoRefresh) {
            if (vm.markers != undefined) {
                vm.params.latNE = args.leafletObject.getBounds()._northEast.lat;
                vm.params.lngNE = args.leafletObject.getBounds()._northEast.lng;
                vm.params.latSW = args.leafletObject.getBounds()._southWest.lat;
                vm.params.lngSW = args.leafletObject.getBounds()._southWest.lng;
            }
            $location.search({
                'latNE': args.leafletObject.getBounds()._northEast.lat,
                'lngNE': args.leafletObject.getBounds()._northEast.lng,
                'latSW': args.leafletObject.getBounds()._southWest.lat,
                'lngSW': args.leafletObject.getBounds()._southWest.lng
            })
            leafletData.getMap().then(function (map) {
                // map.fitBounds(bounds);
                return vm.getTrack().then(function () {});
            });
        }


    })
    $scope.$on('$routeUpdate', function () {
        alert(1)
    });

}