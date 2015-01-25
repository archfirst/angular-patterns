/* jshint -W079, -W098, -W126 */
var mockData = (function() {
    'use strict';

    return {
        getMockAccount: getMockAccount
    };

    function getMockAccount() {
        return {
            'market_value': 10000,
            'investment': 9500,
            'earnings': 500,
            'cash': 1000,
            'assets': [
                {
                    'asset_class': 'US Stocks',
                    'market_value': 9000,
                    'percent_allocation': 0.90,
                    'percent_return': 0.0510
                },
                {
                    'asset_class': 'Cash',
                    'market_value': 1000,
                    'percent_allocation': 0.10,
                    'percent_return': 0.0000
                }
            ]
        };
    }
})();
