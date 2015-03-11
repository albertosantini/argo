"use strict";

(function () {
    angular
        .module("argo")
        .controller("Trades", Trades);

    Trades.$inject = ["toastService", "tradesService"];
    function Trades(toastService, tradesService) {
        var vm = this;

        vm.getTrades = getTrades;
        vm.closeTrade = closeTrade;

        tradesService.getTrades().then(getTrades);

        function getTrades(trades) {
            vm.trades = trades;
        }

        function closeTrade(id) {
            tradesService.closeTrade(id).then(function (trade) {
                var message = "Closed " +
                    trade.side + " " +
                    trade.instrument +
                    " #" + trade.id +
                    " @" + trade.price +
                    " P&L " + trade.profit;

                toastService.show(message);
                tradesService.getTrades().then(getTrades);
            });
        }
    }

}());
