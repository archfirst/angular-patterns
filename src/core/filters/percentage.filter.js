// Formats a number in decimal format to a percentage (i.e. 0.17 as 17%).
// Usage:
//     {{0.17 | percentage:2}}
//  => 17%

(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('percentage', formatPercent);

    formatPercent.$inject = ['$filter'];
    /* @ngInject */
    function formatPercent($filter) {
        return function(input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
})();
