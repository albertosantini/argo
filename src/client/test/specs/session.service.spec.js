"use strict";

describe("sessionService", function () {
    var scope,
        $httpBackend,
        sessionService,
        environment = "my environment",
        token = "my token",
        accountId = "my account id";

    it("setup", function (done) {
        module("argo");
        inject(function (_$rootScope_, _$httpBackend_, _sessionService_) {
            scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            sessionService = _sessionService_;

            $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);

            done();
        });
    });

    it("isLogged and setCredentials", function (done) {
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

    it("isLogged with credentials resolved", function (done) {
        sessionService.isLogged().then(function (credentials) {
            assert(angular.isDefined(credentials));

            done();
        });

        scope.$apply();
    });

});
