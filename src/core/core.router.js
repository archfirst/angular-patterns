(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);

    configFunction.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configFunction($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('dashboard', {
                url: '/',
                template: '<ptrn-dashboard></ptrn-dashboard>'
            })
            .state('profile', {
                url: '/profile',
                template: '<ptrn-profile></ptrn-profile>'
            });
    }
})();
