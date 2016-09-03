angular.module('core', [])
    .config(function() { // provider-injector

    })
    .run(function() { // instance-injector

    });
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('core')
    .directive('navDirective', navDirective);

function navDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/_nav/nav.html',
        // scope: {
        //     max: '='
        // },
        controller: NavController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function NavController() {
    var vm = this;
}
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
/**
* @desc spinner directive that can be used anywhere across apps at a company named Acme
* @example <div acme-shared-spinner></div>
*/
angular
    .module('core')
    .directive('headerDirective', headerDirective);

function headerDirective() {
    var directive = {
        restrict: 'EA',
        templateUrl: '../../components/_header/header.html',
        // scope: {
        //     max: '='
        // },
        controller: HeaderController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function HeaderController() {
    var vm = this;
    vm.min = 3;
    console.log('CTRL: vm.min = %s', vm.min);
    console.log('CTRL: vm.max = %s', vm.max);
}