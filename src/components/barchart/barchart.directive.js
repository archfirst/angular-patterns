/*
    A directive to draw bar charts using D3. The directive itself takes
    care of the Angular side of the instrumentation, the D3 rendering
    is handled by the BarChart class provided by the barchart factory.

    Note: the prefix "ptrn" in "ptrn-barchart" stands for "patterns".
    You should choose a unique and descriptive prefix for your directives.

    Usage:
        <ptrn-barchart data-chartdata="vm.chartdata"></ptrn-barchart>

    Chart data should be in the following format:

        [
            {
                'key': 'US Stocks',
                'value': 90,
            },
            {
                'key': 'Cash',
                'value': 10,
            },
            ...
        ];
*/

(function () {
    'use strict';

    angular
        .module('app.barchart')
        .directive('ptrnBarchart', directiveFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = ['BarChart', '$window', '_'];

    /* @ngInject */
    function directiveFunction(BarChart, $window, _) {

        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                chartdata: '='
            }
        };
        return directive;

        function link(scope, element) {
            var tableRowHeight = 37; // TODO: take out hard coding

            // initialize the chart
            var svgElement = element.html('<svg>').children()[0];
            var barChart = new BarChart(svgElement);
            barChart.barHeight(tableRowHeight);

            // Redraw whenever chartdata changes
            scope.$watch('chartdata', drawChart);

            // Redraw whenever window resizes, adding some debounce
            var debouncedDrawChart = _.debounce(drawChart, 250);
            angular.element($window).on('resize', debouncedDrawChart);

            // Remove the redraw handler when the scope is destroyed
            // This prevents redrawing when the view containing the barchart is destroyed
            scope.$on('$destroy', function() {
                if (debouncedDrawChart) {
                    angular.element($window).off('resize', debouncedDrawChart);
                    debouncedDrawChart = undefined;
                }
            });

            function drawChart() {
                var chartdata = scope.chartdata;

                // This can happen when the server has not yet returned the chartdata
                if (!chartdata) { return; }

                barChart
                    .width(element[0].offsetWidth)
                    .draw(chartdata);
            }
        }
    }

})();
