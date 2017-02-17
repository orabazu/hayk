(function () {
    'use strict';
    angular
        .module('app.header', [])
        .directive('headlineDirective', headlineDirective);

    function headlineDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: '../../components/content/headline/headline.html',
            scope: {},
            controller: HeadlineController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    function HeadlineController($scope, $state) {
        var vm = this;
        window.loadAutoComplete();
        vm.search = function () {
            $state.go('layout', {
                term: vm.elma
            })
        }

        $("#Autocomplete").focus(function () {
            $('html, body').animate({
                scrollTop: $("#Autocomplete").offset().top - 200
            }, 300);
        });

    }
})();