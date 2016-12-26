"use strict";

describe("Exposure", () => {
    let $controller,
        tradesServiceMock;

    beforeEach(module("components"));

    beforeEach(inject($componentController => {
        $controller = $componentController;

        tradesServiceMock = {
            getTrades() {
                return [
                    {
                        instrument: "EUR_USD",
                        currentUnits: 100,
                        price: 1.2345
                    },
                    {
                        instrument: "GPB_USD",
                        currentUnits: 200,
                        price: 1.4678
                    }
                ];
            }
        };
    }));

    describe("vm.exposures", () => {
        let controller;

        beforeEach(() => {
            controller = $controller("exposure", {
                $scope: {},
                tradesService: tradesServiceMock
            });
        });

        it("test", () => {
            const exposures = controller.exposures;

            assert.lengthOf(exposures, 3);

            assert.equal("EUR", exposures[0].market);
            assert.equal("100", exposures[0].units);
            assert.equal("Long", exposures[0].type);

            assert.equal("USD", exposures[1].market);
            assert.equal("417.01", exposures[1].units);
            assert.equal("Short", exposures[1].type);

            assert.equal("GPB", exposures[2].market);
            assert.equal("200", exposures[2].units);
            assert.equal("Long", exposures[2].type);
        });
    });
});
