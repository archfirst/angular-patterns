// Usage
// <div data-at-barchart assets="vm.account.assets"></div>
/* global d3 */
/* jshint -W126 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('atBarchart', barchartDirective);

    function barchartDirective() {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                assets: '='
            }
        };
        return directive;

        function link(scope, element) {
            var tableRowHeight = 37; // TODO: take out hard coding

            // initialize the chart
            var base = d3.select(element[0])
                .append('svg')
                .style('width', '100%');
            var barChart = new BarChart(base);
            barChart.barHeight(tableRowHeight);

            // Redraw whenever assets change
            scope.$watch('assets', function() {
                draw();
            });

            // Redraw whenever window resizes
            // TODO: Add a throttle function
            window.onresize = function() {
                // TODO: Fix this hack. It prevents drawing when we are not on the dashboard page
                if (element[0].offsetWidth === 0) { return; }
                draw();
            };

            function draw() {
                var assets = scope.assets;

                // This can happen when the server has not yet returned the assets
                if (!assets) { return; }

                // TODO: Remove this mapping from directive to make it reusable
                var data = assets.map(function(asset) {
                    return {
                        key: asset.asset_class,
                        value: asset.percent_allocation * 100
                    };
                });

                barChart.draw(data);
            }
        }
    }

    /* ----- BarChart -----*/
    function BarChart(base) {
        this.base = base;

        this.margin = {top: 0, right: 7, bottom: 30, left: 5};
        this.axisMargin = 5;

        this.x = d3.scale.linear();

        this.y = d3.scale.ordinal();

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient('bottom');

        // chart base
        this.base
            .attr('class', 'chart');

        // x-axis base
        this.xAxisBase = this.base.append('g')
            .attr('class', 'x axis');

        // plot base
        this.plotBase = this.base.append('g')
            .attr('class', 'plot')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    BarChart.prototype.barHeight = function(barHeight) {
        this.barHeight = barHeight;
        return this;
    };

    BarChart.prototype.draw = function(data) {
        // Compute x-dimensions based on the container width
        this.w = this.base.node().offsetWidth;
        this.plotWidth = this.w - this.margin.left - this.margin.right;
        this.x.range([0, this.plotWidth]);

        // Compute y-dimensions based on bar height
        this.plotHeight = this.barHeight * data.length;
        this.h = this.plotHeight + this.margin.top + this.margin.bottom;
        this.base.attr('height', this.h);
        this.y.rangeBands([0, this.plotHeight], 0.05, 0);
        this.xAxisBase.attr(
            'transform',
            'translate(' + this.margin.left + ',' + (this.margin.top + this.plotHeight + this.axisMargin) + ')'
        );

        // Set the domains for the scales from the supplied data
        this.x.domain([0, d3.max(data.map(function(d) { return d.value; }))]);
        this.y.domain(data.map(function(d) { return d.key; }));

        // Draw the axes
        this.xAxis.tickValues(this.x.domain());
        this.xAxisBase.call(this.xAxis);

        // Create the 'update selection' by selecting the bars and joining with data.
        // Update selection contains the DOM elements that were successfully bound to data
        // plus references to enter and exit selections.
        var updateSelection = this.plotBase.selectAll('.bar')
            .data(data, function(d) { return d.key; });

        // Remove the exiting bars (this is the 'exit selection')
        updateSelection.exit()
            .remove();

        // Get the 'enter selection'
        // Contains placeholder DOM nodes for each data element that was not bound
        var enterSelection = updateSelection.enter();

        // Add a group for each entering element - these are the entering bars
        var barsEnter = enterSelection
            .append('g')
            .attr('class', 'bar');

        // Add the rectangle for the bar
        barsEnter
            .append('rect')
            .attr('x', 0)
            .attr('width', 0)
            .attr('height', this.y.rangeBand());

        // Draw the bars
        var self = this;
        updateSelection.select('rect')
            .attr('x', 0)
            .attr('y', function(d) { return self.y(d.key); })
            .attr('height', this.y.rangeBand())
            .transition()
            .duration(1000)
            .attr('width', function(d) { return self.x(d.value); });
    };
})();
