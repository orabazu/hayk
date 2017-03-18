/**
* @desc card component 
* @example <card></card>
*/
angular
    .module('app.card', [])
    .directive('cardDirective', cardDirective);
   
function cardDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/common/card/card.html',
        scope: {
            title: '<',
            summary: '<',
            owner:'<',
            imgSrc:'<',
            id: '<',
        },
        controller: CardController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;
}

function CardController() {
    var vm = this; 
    // vm.imgSrc = vm.imgSrc.split('client')[1];
} 
