"use strict";

describe("sessionService", function () {
    var scope,
        sessionService,
        environment = "my environment",
        token = "my token",
        accountId = "my account id";

    beforeEach(module("argo"));
    beforeEach(inject(function (_$rootScope_, _sessionService_) {
        scope = _$rootScope_.$new();
        sessionService = _sessionService_;
    }));

    it("isLogged with setCredentials", function (done) {
        sessionService.isLogged().then(function (credentials) {
            assert(environment, credentials.environment);
            assert(token, credentials.token);
            assert(accountId, credentials.accountId);

            done();
        });

        sessionService.setCredentials({
            environment: environment,
            token: token,
            accountId: accountId
        });

        scope.$apply();
    });
});
