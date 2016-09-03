/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('core')
    .directive('footerDirective', footerDirective);

function footerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/_footer/footer.html',
        // scope: {
        //     max: '='
        // },
        controller: FooterController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function FooterController() {
    var vm = this;
}