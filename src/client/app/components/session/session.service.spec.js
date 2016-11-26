"use strict";

describe("sessionService", function () {
    var scope,
        $httpBackend,
        sessionService,
        environment = "my environment",
        token = "my token",
        accountId = "my account id";

    beforeEach(module("components"));

    beforeEach(inject(function ($injector) {
        var $rootScope = $injector.get("$rootScope");

        scope = $rootScope.$new();
        $httpBackend = $injector.get("$httpBackend");
        sessionService = $injector.get("sessionService");

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

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

    // it("isLogged with credentials resolved", function (done) {
    //     sessionService.isLogged().then(function (credentials) {
    //         assert(angular.isDefined(credentials));
    //
    //         done();
    //     });
    //
    //     scope.$apply();
    // });

});
