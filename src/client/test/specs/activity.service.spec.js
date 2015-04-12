"use strict";

describe("activityService", function () {
    var api = "/api/transactions",
        $httpBackend,
        sessionService,
        activityService;

    beforeEach(module("argo"));

    beforeEach(inject(function ($injector) {
        var environment = "my environment",
            token = "my token",
            accountId = "my account id",
            when;

        $httpBackend = $injector.get("$httpBackend");
        activityService = $injector.get("activityService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment: environment,
            token: token,
            accountId: accountId
        });

        $httpBackend
            .when("POST", api)
            .respond({
                "data": [
                    {
                        "id": 176403879,
                        "accountId": 6765103,
                        "time": "2014-04-07T18:31:05Z",
                        "type": "MARKET_ORDER_CREATE",
                        "instrument": "EUR_USD",
                        "units": 2,
                        "side": "buy",
                        "price": 1.25325,
                        "pl": 0,
                        "interest": 0,
                        "accountBalance": 100000,
                        "tradeOpened": {
                            "id": 176403879,
                            "units": 2
                        }
                    }
                ]
            });

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

    describe("getActivities", function () {
        it("test", function () {
            activityService.getActivities().then(function (response) {
                var activities = response.data;

                assert.lengthOf(activities, 1);

                assert.equal("176403879", activities[0].id);
                assert.equal("MARKET_ORDER_CREATE", activities[0].type);
                assert.equal("EUR_USD", activities[0].instrument);
                assert.equal("2", activities[0].units);
                assert.equal("1.25325", activities[0].price);
                assert.equal("0", activities[0].interest);
                assert.equal("0", activities[0].pl);
                assert.equal("100000", activities[0].accountBalance);
                assert.equal("2014-04-07T18:31:05Z", activities[0].time);
            });
            $httpBackend.flush();
        });
    });
});
