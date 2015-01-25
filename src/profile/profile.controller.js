(function() {
    'use strict';

    angular
        .module('app.profile')
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
