"use strict";

describe("Exposure", function () {
    var $controller,
        tradesServiceMock;

    beforeEach(module("components"));

    beforeEach(inject(function ($componentController) {
        $controller = $componentController;

        tradesServiceMock = {
            getTrades: function () {
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

    describe("vm.exposures", function () {
        var controller;

        beforeEach(function () {
            controller = $controller("exposure", {
                $scope: {},
                tradesService: tradesServiceMock
            });
        });

        it("test", function () {
            var exposures = controller.exposures;

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
