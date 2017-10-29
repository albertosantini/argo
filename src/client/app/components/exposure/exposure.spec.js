/* eslint-env mocha */
/* global assert, inject */

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
                TradesService: tradesServiceMock
            });

            controller.$onInit();
        });

        it("test", () => {
            const exposures = controller.exposures;

            assert.lengthOf(exposures, 3);

            assert.strictEqual("EUR", exposures[0].market);
            assert.strictEqual(100, exposures[0].units);
            assert.strictEqual("Long", exposures[0].type);

            assert.strictEqual("USD", exposures[1].market);
            assert.strictEqual(417.01, exposures[1].units);
            assert.strictEqual("Short", exposures[1].type);

            assert.strictEqual("GPB", exposures[2].market);
            assert.strictEqual(200, exposures[2].units);
            assert.strictEqual("Long", exposures[2].type);
        });
    });
});
