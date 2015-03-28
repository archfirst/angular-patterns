/* global _, d3 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('_', _)
        .constant('d3', d3)
        .constant('api', 'http://localhost:7203/api');
})();
