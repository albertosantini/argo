"use strict";

{
    angular
        .module("components.exposure")
        .component("exposure", {
            controller: Exposure,
            templateUrl: "app/components/exposure/exposure.html"
        });

    Exposure.$inject = ["tradesService"];
    function Exposure(tradesService) {
        const vm = this;

        vm.exposures = [];

        activate();

        function activate() {
            const trades = tradesService.getTrades(),
                exps = {};

            trades.forEach(trade => {
                const legs = trade.instrument.split("_");

                exps[legs[0]] = exps[legs[0]] || 0;
                exps[legs[1]] = exps[legs[1]] || 0;

                exps[legs[0]] += parseInt(trade.currentUnits, 10);
                exps[legs[1]] -= trade.currentUnits * trade.price;
            });

            Object.keys(exps).forEach(exp => {
                const type = exps[exp] > 0;

                vm.exposures.push({
                    type: type ? "Long" : "Short",
                    market: exp,
                    units: Math.abs(exps[exp])
                });
            });
        }
    }

}
