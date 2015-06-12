/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('accountService', serviceFunction);

    serviceFunction.$inject = ['$http', '$location', 'exception', 'api'];

    /* @ngInject */
    function serviceFunction($http, $location, exception, api) {
        var service = {
            getAccount: getAccount
        };

        return service;

        function getAccount() {
            return $http.get(api + '/account')
                .then(getAccountSuccess)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getAccount')(message);
                    $location.url('/');
                });

            function getAccountSuccess(response) {
                return response.data;
            }
        }
    }
})();
