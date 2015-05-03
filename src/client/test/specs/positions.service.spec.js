"use strict";

describe("positionsService", function () {
    var api = "/api/positions",
        $httpBackend,
        sessionService,
        positionsService;

    beforeEach(module("argo"));

    beforeEach(inject(function ($injector) {
        var environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        positionsService = $injector.get("positionsService");
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
                    "instrument": "EUR_USD",
                    "units": 4741,
                    "side": "buy",
                    "avgPrice": 1.3626
                },
                {
                    "instrument": "USD_CAD",
                    "units": 30,
                    "side": "sell",
                    "avgPrice": 1.11563
                },
                {
                    "instrument": "USD_JPY",
                    "units": 88,
                    "side": "buy",
                    "avgPrice": 102.455
                }
            ]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("getPositions", function () {
        it("test", function () {
            positionsService.getPositions().then(function (positions) {
                assert.lengthOf(positions, 3);

                assert.equal("USD_CAD", positions[1].instrument);
                assert.equal(30, positions[1].units);
                assert.equal("sell", positions[1].side);
                assert.equal(1.11563, positions[1].avgPrice);
            });
            $httpBackend.flush();
        });
    });
});
