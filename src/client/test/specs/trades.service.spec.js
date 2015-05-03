"use strict";

describe("tradesService", function () {
    var api = "/api/trades",
        $httpBackend,
        sessionService,
        tradesService;

    beforeEach(module("argo"));

    beforeEach(inject(function ($injector) {
        var environment = "my environment",
            token = "my token",
            accountId = "my account id",
            when;

        $httpBackend = $injector.get("$httpBackend");
        tradesService = $injector.get("tradesService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment: environment,
            token: token,
            accountId: accountId
        });

        $httpBackend
            .when("POST", api)
            .respond([
                {
                    "id": 175427743,
                    "units": 2,
                    "side": "sell",
                    "instrument": "EUR_USD",
                    "time": "2014-02-13T17:47:57Z",
                    "price": 1.36687,
                    "takeProfit": 0,
                    "stopLoss": 0,
                    "trailingStop": 0,
                    "trailingAmount": 0
                },
                {
                    "id": 175427742,
                    "units": 2,
                    "side": "sell",
                    "instrument": "EUR_USD",
                    "time": "2014-02-13T17:47:56Z",
                    "price": 1.36687,
                    "takeProfit": 0,
                    "stopLoss": 0,
                    "trailingStop": 0,
                    "trailingAmount": 0
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

    describe("refresh", function () {
        it("test", function () {
            var trades;

            tradesService.refresh();
            $httpBackend.flush();

            trades = tradesService.getTrades();

            assert.lengthOf(trades, 2);

            assert.equal(175427743, trades[0].id);
            assert.equal(2, trades[0].units);
            assert.equal("sell", trades[0].side);
            assert.equal("EUR_USD", trades[0].instrument);
            assert.equal("2014-02-13T17:47:57Z", trades[0].time);
            assert.equal(1.36687, trades[0].price);
            assert.equal(0, trades[0].takeProfit);
            assert.equal(0, trades[0].stopLoss);
            assert.equal(0, trades[0].trailingStop);
            assert.equal(0, trades[0].trailingAmount);
        });
    });
});
