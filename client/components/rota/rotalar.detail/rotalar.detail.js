angular
    .module('app.rotalarDetail', [])
    .directive('rotalarDetail', rotalarDetail)

function rotalarDetail() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/rota/rotalar.detail/rotalar.detail.html',
        scope: {},
        controller: RotalarDetailController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive; 
}

RotalarDetailController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData', 'weatherAPI', 'ngDialog'];

function RotalarDetailController($scope, $stateParams, trackService, mapConfigService, leafletData, weatherAPI, ngDialog) {
    var vm = this;
    vm.trackDetail = {};
    vm.center = {};
    vm.layers = mapConfigService.getLayerForDetail();
    vm.controls = controls;
    vm.updateTrack = updateTrack;
    vm.deleteTrack = deleteTrack;
    vm.deleteTrackOK = deleteTrackOK;

    activate();

    function activate() {
        trackService.getTrackDetail($stateParams.id).then(function (res) {
            vm.trackDetail = res.data;
            vm.trackDetail.properties.img_src = vm.trackDetail.properties.img_src;
            vm.center = {
                lat: vm.trackDetail.geometry.coordinates[1],
                lng: vm.trackDetail.geometry.coordinates[0],
                zoom: 12
            }

            vm.gpxData = {};

            weatherAPI.darkSkyWeather(vm.trackDetail.geometry.coordinates[1], vm.trackDetail.geometry.coordinates[0]).then(function (res) {
                vm.weather = res;
                var skycons = new Skycons({
                    color: 'black'
                });
                skycons.add("icon1", res.currently.icon);
                skycons.play();

                var skycons = new Skycons({
                    color: 'white'
                });
                skycons.add("icon2", res.currently.icon);
                skycons.play();
                var skyconsDaily = new Skycons({
                    color: 'black'
                });
                var skyconsDailyWhite = new Skycons({
                    color: 'white'
                });
                setTimeout(function () {
                    angular.forEach(vm.weather.daily.data, function (value, key) {

                        var s = key + 10;
                        var k = key + 20;
                        var ss = "icon" + s;
                        var kk = "icon" + k;

                        skyconsDaily.add(ss, value.icon)
                        skyconsDailyWhite.add(kk, value.icon)
                        skyconsDaily.play();
                        skyconsDailyWhite.play();
                    });
                }, 0);
            })

            leafletData.getMap().then(function (map) {
                if (window.mobilecheck())
                    map.scrollWheelZoom.disable();
                // map.dragging.disable();

                // map.addControl(new L.Control.Fullscreen());

                var gpx = vm.trackDetail.properties.gpx; // URL to your GPX file or the GPX itself
                var g = new L.GPX(gpx, {
                    async: true,
                    polyline_options: {
                        color: 'yellow',
                        dashArray: '10,10',
                        weight: '3',
                        opacity: '0.9'
                    },
                    marker_options: {
                        wptIconUrls: {
                            '': 'img/icon-go.svg',
                            'Geocache Found': 'img/gpx/geocache.png',
                            'Park': 'img/gpx/tree.png'
                        },
                        startIconUrl: 'img/icon-go.svg',
                        endIconUrl: 'img/icon-stop.svg',
                        shadowUrl: 'img/pin-shadow.png'
                    },

                });
                g.on('loaded', function (e) {
                    vm.gpxData.distance = e.target.get_distance();
                    vm.gpxData.eleMin = e.target.get_elevation_min();
                    vm.gpxData.eleMax = e.target.get_elevation_max();
                    vm.data = {
                        dataset0: e.target.get_elevation_data()
                    }

                    map.fitBounds(e.target.getBounds());
                    console.log(e.target.getBounds())
                    var newBounds = {
                        _northEast: {
                            lat: e.target.getBounds()._northEast.lat + 0.2,
                            lng: e.target.getBounds()._northEast.lng + 0.2
                        },
                        _southWest: {
                            lat: e.target.getBounds()._southWest.lat - 0.2,
                            lng: e.target.getBounds()._southWest.lng - 0.2
                        }
                    };

                    var southWest = L.latLng(newBounds._northEast.lat, newBounds._northEast.lng),
                        northEast = L.latLng(newBounds._southWest.lat, newBounds._southWest.lng),
                        bounds = L.latLngBounds(southWest, northEast);

                    map.setMaxBounds(bounds);
                    map._layersMinZoom = 10
                });
                g.addTo(map);
            });

        })

    }
    var controls = {
        fullscreen: {
            position: 'topleft'
        }
    }

    function updateTrack() {
        return trackService.updateTrack(vm.trackDetail).then(function () {}, function () {});
    }

    function deleteTrackOK() {

        ngDialog.open({
            template: 'templateId',
            className: 'ngdialog-theme-default',
            showClose: false,
            preCloseCallback: function (value) {
               $('.container').css({
                    'filter': 'none',
                    '-webkit-filter': 'none',
                    '-moz-filter': 'none',
                    '-o-filter': 'none',
                    '-ms-filter': 'none'
                });
            },
            onOpenCallback: function (value) {
                $('.container').css({
                    'filter': 'blur(5px)',
                    '-webkit-filter': 'blur(5px)',
                    '-moz-filter': 'blur(5px)',
                    '-o-filter': 'blur(5px)',
                    '-ms-filter': 'blur(5px)'
                });
            },
            scope: $scope
        });
    } 

    function deleteTrack() {
        console.log(1);
        trackService.deleteTrack(vm.trackDetail).then(function (res) {
            if(res.OperationResult === true) {
                $state.go("rotalarState"); 
            }
        }, function (rej) {
            console.log('rej')
        });
    }

}