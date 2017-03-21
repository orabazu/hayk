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

    HeadlineController.$inject = ['$scope', '$state','$interval'];

    function HeadlineController($scope, $state,$interval) {
        var vm = this;
        window.loadAutoComplete();
        vm.search = function () {
            $state.go('layout', {
                term: vm.elma
            })
        }

        $("#Autocomplete").focus(function () {
            $('html, body').animate({
                scrollTop: $("#Autocomplete").offset().top - 80
            }, 300);
        });



        $interval(changeBg, 6500);

        var i = 1;
        function changeBg() {
            if( i === 5){
                //restart
                i=0;
            }
            i++;
            var imgUrl = "url('../../img/bg-"+ i +".jpg')";
            angular.element(".headline")
                .css({
                    background: imgUrl,
                    // backgroundSize: "cover",
                    // backgroundPosition: "bottom",
                });
        }


    }
})();