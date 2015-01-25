(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['accountService', 'logger'];

    /* @ngInject */
    function DashboardController(accountService, logger) {
        var vm = this;

        vm.account = null;

        activate();

        function activate() {
            return getAccount().then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function getAccount() {
            return accountService.getAccount().then(function(data) {
                vm.account = data;
                return vm.account;
            });
        }
    }
})();
