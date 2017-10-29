/* eslint-env mocha */
/* global angular, assert, inject */

describe("tradesService", () => {
    const api = "/api/trades";

    let $httpBackend,
        sessionService,
        tradesService;

    beforeEach(module("components"));

    beforeEach(inject($injector => {
        const environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        tradesService = $injector.get("TradesService");
        sessionService = $injector.get("SessionService");

        sessionService.setCredentials({
            environment,
            token,
            accountId
        });

        $httpBackend
            .when("POST", api)
            .respond([
                {
                    id: 175427743,
                    units: 2,
                    side: "sell",
                    instrument: "EUR_USD",
                    time: "2014-02-13T17:47:57Z",
                    price: 1.36687,
                    takeProfit: 0,
                    stopLoss: 0,
                    trailingStop: 0,
                    trailingAmount: 0
                },
                {
                    id: 175427742,
                    units: 2,
                    side: "sell",
                    instrument: "EUR_USD",
                    time: "2014-02-13T17:47:56Z",
                    price: 1.36687,
                    takeProfit: 0,
                    stopLoss: 0,
                    trailingStop: 0,
                    trailingAmount: 0
                }
            ]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("getTrades", () => {
        const trades = tradesService.getTrades();

        assert.strictEqual(true, angular.isArray(trades));
    });

    it("refresh", () => {
        tradesService.refresh();
        $httpBackend.flush();

        const trades = tradesService.getTrades();

        assert.lengthOf(trades, 2);

        assert.strictEqual(175427743, trades[0].id);
        assert.strictEqual(2, trades[0].units);
        assert.strictEqual("sell", trades[0].side);
        assert.strictEqual("EUR_USD", trades[0].instrument);
        assert.strictEqual("2014-02-13T17:47:57Z", trades[0].time);
        assert.strictEqual(1.36687, trades[0].price);
        assert.strictEqual(0, trades[0].takeProfit);
        assert.strictEqual(0, trades[0].stopLoss);
        assert.strictEqual(0, trades[0].trailingStop);
        assert.strictEqual(0, trades[0].trailingAmount);
    });
});
