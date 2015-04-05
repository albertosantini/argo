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
            var when;

            scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            sessionService = _sessionService_;

            when = $httpBackend.whenGET;
            when("app/layout/default.html").respond("dummy");
            when("app/header/header.html").respond("dummy");
            when("app/trades/trades.html").respond("dummy");
            when("app/orders/orders.html").respond("dummy");
            when("app/positions/positions.html").respond("dummy");
            when("app/exposure/exposure.html").respond("dummy");
            when("app/activity/activity.html").respond("dummy");
            when("app/news/news.html").respond("dummy");
            when("app/account/account.html").respond("dummy");
            when("app/quotes/quotes.html").respond("dummy");
            when("app/charts/charts.html").respond("dummy");
            $httpBackend.flush();

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
