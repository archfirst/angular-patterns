/* jshint -W024, -W030, -W117 */
/**
 *  Demonstrates use of bard's real $http and $q
 *  restoring the ability to make AJAX calls to the server
 *  while retaining all the goodness of ngMocks.
 *
 *  An alternative to the ngMidwayTester
 */

describe('Server: accountService', function() {
    'use strict';
    var accountService;

    beforeEach(bard.asyncModule('app'));

    beforeEach(inject(function(_accountService_) {
        accountService = _accountService_;
    }));

    describe('when call getAccount', function() {

        it('should get 5 assets', function(done) {
            accountService.getAccount()
                .then(function(data) {
                    expect(data.assets).to.have.length(5);
                })
                .then(done, done);
        });
    });
});
