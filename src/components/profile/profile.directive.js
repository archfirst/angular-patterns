(function () {

    'use strict';

    angular.module('app.profile')
        .directive('profile', profileDirective)
        .controller('ProfileController', ProfileController);


    // ----- profileDirective -----
    profileDirective.$inject = [];

    /* @ngInject */
    function profileDirective() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/profile/profile.html',
            controller: 'ProfileController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }


    // ----- ProfileController -----
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
