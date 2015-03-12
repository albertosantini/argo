"use strict";

(function () {
    angular
        .module("argo")
        .controller("Trades", Trades);

    Trades.$inject = ["$mdDialog", "toastService", "tradesService"];
    function Trades($mdDialog, toastService, tradesService) {
        var vm = this;

        vm.getTrades = getTrades;
        vm.closeTrade = closeTrade;

        tradesService.getTrades().then(getTrades);

        function getTrades(trades) {
            vm.trades = trades;
        }

        function closeTrade(event, id) {
            var confirm = $mdDialog.confirm()
                  .content("Are you sure to close the trade?")
                  .ariaLabel("Trade closing confirmation")
                  .ok("Ok")
                  .cancel("Cancel")
                  .targetEvent(event);

            $mdDialog.show(confirm).then(function () {
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
            });
        }
    }

}());
