/* jshint -W117 */
describe('Dashboard', function() {
    'use strict';

    var controller;

    beforeEach(function() {
        bard.appModule('app.dashboard');
        bard.inject('$rootScope', '$controller', '$q',  'accountService');
    });

    beforeEach(function() {
        sinon.stub(accountService, 'getAccount').returns($q.when(mockData.getMockAccount()));

        controller = $controller('DashboardController');
        $rootScope.$apply();
    });

    describe('Dashboard controller', function() {
        it('should have a market value of $10,000', function() {
            expect(controller.account.market_value).to.equal(10000);
        });

        it('should have an investment amount of $9,500', function() {
            expect(controller.account.investment).to.equal(9500);
        });

        it('should have an earnings amount of $500', function() {
            expect(controller.account.earnings).to.equal(500);
        });

        it('should have $1,000 in cash', function() {
            expect(controller.account.cash).to.equal(1000);
        });

        it('should have 2 assets', function() {
            expect(controller.account.assets.length).to.equal(2);
        });
    });
});
