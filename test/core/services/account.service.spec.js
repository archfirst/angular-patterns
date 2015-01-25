/* jshint -W024, -W030, -W098, -W117 */
describe('accountService', function() {
    'use strict';
    var account = mockData.getMockAccount();

    beforeEach(function() {
        bard.appModule('app.core');
        bard.inject('$httpBackend', '$rootScope', 'accountService', 'api');
    });

    beforeEach(function() {
        $httpBackend.when('GET', api + '/account').respond(200, account);
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should be registered', function() {
        expect(accountService).not.to.equal(null);
    });

    describe('getAccount function', function() {
        it('should exist', function() {
            expect(accountService.getAccount).not.to.equal(null);
        });

        it('should return 2 assets', function(done) {
            accountService.getAccount().then(function(data) {
                expect(data.assets.length).to.equal(2);
            }).then(done, done);
            $httpBackend.flush();
        });
    });
});
