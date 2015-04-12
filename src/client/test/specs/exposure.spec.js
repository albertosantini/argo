"use strict";

describe("Exposure", function () {
    var $controller,
        tradesServiceMock;

    beforeEach(module("argo"));

    beforeEach(function () {
        tradesServiceMock = {
            getTrades: function () {
                return [
                    {
                        instrument: "EUR_USD",
                        side: "buy",
                        units: 100,
                        price: 1.2345
                    },
                    {
                        instrument: "GPB_USD",
                        side: "buy",
                        units: 200,
                        price: 1.4678
                    }
                ];
            }
        };
    });

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe("vm.exposures", function () {
        var controller;

        beforeEach(function () {
            controller = $controller("Exposure", {
                $scope: {},
                tradesService: tradesServiceMock
            });
        });

        it("test", function () {
            var exposures = controller.exposures;

            assert.lengthOf(exposures, 3);

            assert.equal(exposures[0].market, "EUR");
            assert.equal(exposures[0].units, "100");
            assert.equal(exposures[0].type, "Long");

            assert.equal(exposures[1].market, "USD");
            assert.equal(exposures[1].units, "417.01");
            assert.equal(exposures[1].type, "Short");

            assert.equal(exposures[2].market, "GPB");
            assert.equal(exposures[2].units, "200");
            assert.equal(exposures[2].type, "Long");
        });
    });
});
