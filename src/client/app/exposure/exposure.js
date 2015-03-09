"use strict";

(function () {
    angular
        .module("argo")
        .controller("Exposure", Exposure);

    Exposure.$inject = ["tradesService"];
    function Exposure(tradesService) {
        var vm = this;

        vm.exposures = [];

        tradesService.getTrades().then(function (trades) {
            var exps = {};

            trades.forEach(function (trade) {
                var legs = trade.instrument.split("_");

                exps[legs[0]] = exps[legs[0]] || 0;
                exps[legs[1]] = exps[legs[1]] || 0;

                if (trade.side === "buy") {
                    exps[legs[0]] += trade.units;
                    exps[legs[1]] -= trade.units * trade.price;
                }
                if (trade.side === "sell") {
                    exps[legs[0]] -= trade.units;
                    exps[legs[1]] += trade.units * trade.price;
                }

            });

            Object.keys(exps).forEach(function (exp) {
                var type = exps[exp] > 0;

                vm.exposures.push({
                    type: type ? "Long" : "Short",
                    market: exp,
                    units: Math.abs(exps[exp])
                });
            });
        });
    }

}());
