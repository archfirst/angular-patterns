/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('accountService', accountService);

    accountService.$inject = ['$http', '$location', 'exception', 'api'];
    /* @ngInject */
    function accountService($http, $location, exception, api) {
        var service = {
            getAccount: getAccount
        };

        return service;

        function getAccount() {
            return $http.get(api + '/account')
                .then(getAccountComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getAccount')(message);
                    $location.url('/');
                });

            function getAccountComplete(data) {
                return data.data;
            }
        }
    }
})();
