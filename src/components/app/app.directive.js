(function () {

    angular.module('app.core')
        .directive('app', function () {

            return {
                restrict: 'E',
                templateUrl: 'components/app/app.html'
            };
        });
})();
