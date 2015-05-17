(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configure);

    configure.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configure($locationProvider, $stateProvider, $urlRouterProvider) {

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
