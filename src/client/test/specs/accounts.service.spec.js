"use strict";

describe("accountsService", function () {
    var api = "/api/account",
        apiInstruments = "/api/instruments",
        $httpBackend,
        sessionService,
        accountsService;

    beforeEach(module("argo"));

    beforeEach(inject(function ($injector) {
        var environment = "my environment",
            token = "my token",
            accountId = "my account id",
            when;

        $httpBackend = $injector.get("$httpBackend");
        accountsService = $injector.get("accountsService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment: environment,
            token: token,
            accountId: accountId
        });

        $httpBackend
            .when("POST", api)
            .respond({
                accountCurrency: "USD",
                accountId: 7442890,
                accountName: "Primary",
                balance: 110410.5028,
                marginAvail: 110394.9676,
                marginRate: 0.05,
                marginUsed: 18.1671,
                openOrders: 0,
                openTrades: 3,
                realizedPl: -1983.78,
                unrealizedPl: 2.6319
            });

        $httpBackend
            .when("POST", apiInstruments)
            .respond([
                {
                    displayName: "EUR/USD",
                    instrument: "EUR_USD",
                    maxTradeUnits: 10000000,
                    pip: "0.0001"
                }
            ]);

        when = $httpBackend.whenGET;
        when("app/layout/default.html").respond(200);
        when("app/header/header.html").respond(200);
        when("app/trades/trades.html").respond(200);
        when("app/orders/orders.html").respond(200);
        when("app/positions/positions.html").respond(200);
        when("app/exposure/exposure.html").respond(200);
        when("app/activity/activity.html").respond(200);
        when("app/news/news.html").respond(200);
        when("app/account/account.html").respond(200);
        when("app/quotes/quotes.html").respond(200);
        when("app/charts/charts.html").respond(200);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("getAccounts", function () {
        it("test", function () {
            accountsService.getAccounts({
                environment: "my environment",
                token: "my token",
                accountId: "my account id"
            }).then(function () {
                var account = accountsService.getAccount();

                assert.equal("USD", account.accountCurrency);
                assert.equal("7442890", account.accountId);
                assert.equal("Primary", account.accountName);
                assert.equal(110410.5028, account.balance);
                assert.equal(110394.9676, account.marginAvail);
                assert.equal(0.05, account.marginRate);
                assert.equal(18.1671, account.marginUsed);
                assert.equal(0, account.openOrders);
                assert.equal(3, account.openTrades);
                assert.equal(-1983.78, account.realizedPl);
                assert.equal(2.6319, account.unrealizedPl);
                assert.isDefined(account.timestamp);
                assert.equal(0.0023837406163863604, account.unrealizedPlPerc);
                assert.equal(110413.1347, account.netAssetValue);
            });
            $httpBackend.flush();
        });
    });
});
