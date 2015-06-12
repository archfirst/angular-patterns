(function () {

    'use strict';

    angular.module('app.profile')
        .directive('ptrnProfile', directiveFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/profile/profile.html'
        };

        return directive;
    }

})();
