(function () {

    'use strict';

    angular.module('app.dashboard')
        .directive('ptrnDashboard', dashboardDirective)
        .controller('DashboardController', DashboardController);


    // ----- dashboardDirective -----
    dashboardDirective.$inject = [];

    /* @ngInject */
    function dashboardDirective() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- DashboardController -----
    DashboardController.$inject = ['accountService', 'logger', '_'];

    /* @ngInject */
    function DashboardController(accountService, logger, _) {
        var vm = this;

        vm.account = null;
        vm.chartdata = null;

        activate();

        function activate() {
            return getAccount().then(function () {
                logger.log('Activated Dashboard View');
            });
        }

        function getAccount() {
            return accountService.getAccount().then(function (data) {

                // Convert assets to chart data
                var chartdata = _.map(data.assets, function (asset) {
                    return {
                        key: asset.asset_class,
                        value: asset.percent_allocation * 100
                    };
                });

                vm.account = data;
                vm.chartdata = chartdata;
                return vm.account;
            });
        }
    }

})();
