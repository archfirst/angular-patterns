(function () {

    'use strict';

    angular.module('app.approot')
        .directive('ptrnApproot', directiveFunction);


    // ----- directiveFunction -----
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/approot/approot.html',
            scope: {
            }
        };

        return directive;
    }

})();
