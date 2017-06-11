  (function () {
      'use strict';

        angular
            .module('app.rotalarim', [])
            .directive('rotalarim', rotalarim)

        function rotalarDetail() {
            var directive = {
                restrict: 'A',
                templateUrl: '../../components/rota/rotalarim/rotalarim.html',
                scope: {},
                controller: RotalarimController,
                controllerAs: 'vm',
                bindToController: true
            };

            return directive; 
        }

        RotalarimController.$inject = ['$scope', '$stateParams', 'trackService', 'mapConfigService', 'leafletData', 'weatherAPI', 'ngDialog'];

        function RotalarimController(){
             
        }

  })();