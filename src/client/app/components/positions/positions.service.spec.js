"use strict";

describe("positionsService", () => {
    const api = "/api/positions";

    let $httpBackend,
        sessionService,
        positionsService;

    beforeEach(module("components"));

    beforeEach(inject($injector => {
        const environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        positionsService = $injector.get("positionsService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment,
            token,
            accountId
        });

        $httpBackend
            .when("POST", api)
            .respond([
                {
                    instrument: "EUR_USD",
                    long: {
                        units: 4741,
                        averagePrice: 1.3626
                    }
                },
                {
                    instrument: "USD_CAD",
                    short: {
                        units: -30,
                        averagePrice: 1.11563
                    }
                },
                {
                    instrument: "USD_JPY",
                    long: {
                        units: 88,
                        averagePrice: 102.455
                    }
                }
            ]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("getPositions", () => {
        it("test", () => {
            positionsService.getPositions().then(positions => {
                assert.lengthOf(positions, 3);

                assert.equal("USD_CAD", positions[1].instrument);
                assert.equal(-30, positions[1].units);
                assert.equal("sell", positions[1].side);
                assert.equal(1.11563, positions[1].avgPrice);
            });
            $httpBackend.flush();
        });
    });
});
