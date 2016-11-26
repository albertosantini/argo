"use strict";

(function () {
    angular
        .module("components.exposure")
        .component("exposure", {
            controller: Exposure,
            templateUrl: "app/components/exposure/exposure.html"
        });

    Exposure.$inject = ["tradesService"];
    function Exposure(tradesService) {
        var vm = this;

        vm.exposures = [];

        activate();

        function activate() {
            var trades = tradesService.getTrades(),
                exps = {};

            trades.forEach(function (trade) {
                var legs = trade.instrument.split("_");

                exps[legs[0]] = exps[legs[0]] || 0;
                exps[legs[1]] = exps[legs[1]] || 0;

                exps[legs[0]] += parseInt(trade.currentUnits, 10);
                exps[legs[1]] -= trade.currentUnits * trade.price;
            });

            Object.keys(exps).forEach(function (exp) {
                var type = exps[exp] > 0;

                vm.exposures.push({
                    type: type ? "Long" : "Short",
                    market: exp,
                    units: Math.abs(exps[exp])
                });
            });
        }
    }

}());
