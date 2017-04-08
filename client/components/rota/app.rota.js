(function () {
    'use strict';
    angular
        .module('app.rota', ['app.rotalar', 'app.rotalarDetail', 'app.rotaekle', 'ui.router'])
        .config(function ($stateProvider) { // provider-injector

            var rotalarState = {
                name: 'rotalar',
                url: '/a/{term}?latSW&lngSW&latNE&lngNE',
                template: '<navbar-directive></navbar-directive><rotalar></rotalar>',
                reloadOnSearch: false,
            };
            $stateProvider.state(rotalarState);

            var rotalarDetailState = {
                name: 'rotalarDetail',
                url: '/rota/:id',
                template: '<navbar-directive></navbar-directive><rotalar-detail></rotalar-detail>'
            };
            $stateProvider.state(rotalarDetailState);
 
            var addTrackState = {
                name: 'addtrack',
                url: '/rotaekle',
                templateUrl: '../../components/rota/rotaekle/rotaekle.html',
                controller: 'rotaEkleController',
                controllerAs: 'rotaEkleController'
            };
            $stateProvider.state(addTrackState);

            var addTrackLocationState = {
                name: 'addtrack.location',
                url: '/konum',
                templateUrl: '../../components/rota/rotaekle.location/rotaekle.location.html'
            };
            $stateProvider.state(addTrackLocationState);

            var addTrackMetaState = {
                name: 'addtrack.meta',
                url: '/bilgi',
                templateUrl: '../../components/rota/rotaekle.meta/rotaekle.meta.html'
            }
            $stateProvider.state(addTrackMetaState);

            var addTrackCampState = {
                name: 'addtrack.camp',
                url: '/kamp',
                templateUrl: '../../components/rota/rotaekle.kamp/rotaekle.kamp.html'
            }
            $stateProvider.state(addTrackCampState);

            var addTrackSeasonState = {
                name: 'addtrack.season',
                url: '/sezon',
                templateUrl: '../../components/rota/rotaekle.season/rotaekle.season.html'
            }
            $stateProvider.state(addTrackSeasonState);

            var addTrackImageState = {
                name: 'addtrack.image',
                url: '/resimler',
                templateUrl: '../../components/rota/rotaekle.image/rotaekle.image.html'
            }
            $stateProvider.state(addTrackImageState);

            var addTrackGPXState = {
                name: 'addtrack.gpx',
                url: '/gpx',
                templateUrl: '../../components/rota/rotaekle.gpx/rotaekle.gpx.html'
            }
            $stateProvider.state(addTrackGPXState);

            var addTrackFinishState = {
                name: 'addtrack.finish',
                url: '/kaydet',
                templateUrl: '../../components/rota/rotaekle.finish/rotaekle.finish.html'
            }
            $stateProvider.state(addTrackFinishState);

            
        })

})();