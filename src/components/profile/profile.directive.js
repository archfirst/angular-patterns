(function () {

    'use strict';

    angular.module('app.profile')
        .directive('profile', profileDirective);


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
