(function () {
    'use strict';

    angular
        .module('app.profile')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'profile',
                config: {
                    url: '/#profile',
                    template: '<profile></profile>',
                    title: 'Profile',
                    settings: {
                        nav: 2  // position in navbar
                    }
                }
            }
        ];
    }
})();
