(function () {

    'use strict';

    angular.module('app.profile')
        .directive('profile', function () {

            return {
                restrict: 'E',
                templateUrl: 'components/profile/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                bindToController: true
            };

        });

})();
