/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('app.rotaekle', [])
    .controller('rotaEkleController', rotaEkleController);

function rotaEkleController($scope) { 
  $scope.rota = 1;
}
