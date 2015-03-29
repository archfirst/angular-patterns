(function () {

    'use strict';

    angular.module('app.profile')
        .directive('ptrnProfile', profileDirective);


    // ----- profileDirective -----
    profileDirective.$inject = [];

    /* @ngInject */
    function profileDirective() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/profile/profile.html'
        };

        return directive;
    }

})();
