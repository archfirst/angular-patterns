(function () {

    angular.module('app.dashboard')
        .directive('dashboard', function(){

            return {
                restrict: 'E',
                templateUrl: 'components/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                bindToController: true
            };
        });

})();
