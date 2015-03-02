"use strict";

(function () {
    angular
        .module("argo")
        .controller("Trades", Trades);

    Trades.$inject = ["tradesService"];
    function Trades(tradesService) {
        var vm = this;

        tradesService.getTrades().then(function (trades) {
            vm.trades = trades;
        });
    }

}());
