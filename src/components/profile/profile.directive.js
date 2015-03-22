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
        })
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['logger'];

    /* @ngInject */
    function ProfileController(logger) {
        var vm = this;

        vm.user = {};

        activate();

        function activate() {
            logger.info('Activated Profile View');
        }
    }

})();
